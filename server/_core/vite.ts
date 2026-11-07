import express, { type Express, type Response } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import { PAGE_META, pageMetaFor } from "@shared/pageMeta";
import viteConfig from "../../vite.config";
import { renderLandingHtml } from "./landingHtml";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = renderLandingHtml(
        await vite.transformIndexHtml(url, template),
        pageMetaFor(url.split(/[?#]/)[0]) ?? PAGE_META["/"]
      );
      res
        .status(200)
        .set({ "Content-Type": "text/html", "Cache-Control": "no-store" })
        .end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  // One localized copy of the SPA shell per marketing page, rendered once at
  // boot. HTML is revalidated on every visit (ETag → 304) so a new deploy
  // never leaves a browser holding a shell that points at deleted assets.
  const indexPath = path.resolve(distPath, "index.html");
  const template = fs.existsSync(indexPath)
    ? fs.readFileSync(indexPath, "utf-8")
    : "";
  const pages = new Map<string, string>(
    Object.values(PAGE_META).map(meta => [
      meta.path,
      renderLandingHtml(template, meta),
    ])
  );
  const sendShell = (res: Response, pagePath: string | undefined) =>
    res
      .status(200)
      .set({
        "Content-Type": "text/html; charset=utf-8",
        // El shell NUNCA se almacena en caché (blindaje 7-nov-2026):
        // referencia los bundles con hash de la versión desplegada, y
        // un teléfono que se queda con una copia vieja corre un router
        // al que le faltan rutas vigentes y pinta el 404 del SPA
        // aunque el servidor esté sano (pasó la mañana del evento de
        // Stockton: el dueño veía «404 Page Not Found» con el servidor
        // respondiendo 200). Antes iba "no-cache" sin ETag ni
        // Last-Modified, revalidación que no todos los navegadores
        // móviles honran al restaurar la pestaña. Con "no-store" cada
        // navegación baja el shell vigente; los assets con hash sí
        // quedan inmutables por un año (abajo), que es lo seguro.
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      })
      .send(pages.get(pagePath ?? "/"));

  // Registered before express.static so "/" gets the rendered shell, not the
  // raw index.html template.
  app.get(["/index.html", ...Object.keys(PAGE_META)], (req, res) =>
    sendShell(res, pageMetaFor(req.path)?.path)
  );

  // Hashed assets are immutable — cache them for a year; everything else
  // (sitemap, robots, images, static pages) revalidates hourly (Brief C4).
  app.use(
    express.static(distPath, {
      setHeaders(res, filePath) {
        if (/[/\\]assets[/\\]/.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "public, max-age=3600");
        }
      },
    })
  );

  // fall through to the (English) SPA shell if the file doesn't exist
  app.use("*", (_req, res) => sendShell(res, "/"));
}
