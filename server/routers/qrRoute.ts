/**
 * Self-hosted QR code endpoint.
 * Returns a PNG image for a given code.
 * Used in invitation emails so img src is a real https URL (not base64 data URI,
 * which all major email clients block).
 * Route: GET /api/qr/:code
 */
import type { Express } from "express";
import QRCode from "qrcode";

export function registerQRRoute(app: Express) {
  app.get("/api/qr/:code", async (req, res) => {
    const raw = (req.params.code ?? "").replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 20);
    if (!raw) {
      return res.status(400).send("Invalid code");
    }
    try {
      const buffer = await QRCode.toBuffer(`LPN-${raw}`, {
        width: 250,
        margin: 2,
        color: { dark: "#0a1628", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      res.set("Content-Type", "image/png");
      res.set("Cache-Control", "public, max-age=31536000, immutable");
      res.send(buffer);
    } catch (e) {
      console.error("[QR] Failed to generate QR for", raw, e);
      res.status(500).send("QR generation failed");
    }
  });
}
