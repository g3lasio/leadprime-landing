import { describe, expect, it } from "vitest";
import { esTextoNoWebsite, infoWebsiteDeRegistro, urlWebsiteValida } from "./routers/legacy";

/**
 * La columna de website del portal del dueño (landing): tres
 * estados y ninguno se inventa — «tiene» solo con URL asentada;
 * «sin_website» solo si él lo dijo (el «no» literal asentado
 * como texto por el equipo) o la fila nació por la vía
 * sin-website del formulario; sin señal, «por_verificar».
 */
describe("legacy · el estado del website", () => {
  it("URL válida: tiene, con la URL normalizada", () => {
    expect(infoWebsiteDeRegistro({ website_url: "https://jp.com", sin_website: false }))
      .toEqual({ estado: "tiene", url: "https://jp.com", base: "url" });
    expect(urlWebsiteValida("jp.com")).toBe("https://jp.com");
  });

  it("el «no» literal asentado como texto: sin_website (base texto)", () => {
    expect(infoWebsiteDeRegistro({ website_url: "no", sin_website: false }))
      .toEqual({ estado: "sin_website", url: null, base: "texto" });
    expect(esTextoNoWebsite(" No ")).toBe(true);
  });

  it("la fila nacida por la vía sin-website: sin_website (base registro)", () => {
    expect(infoWebsiteDeRegistro({ website_url: null, sin_website: true }))
      .toEqual({ estado: "sin_website", url: null, base: "registro" });
  });

  it("sin ninguna señal: por_verificar — jamás se afirma que no tiene", () => {
    expect(infoWebsiteDeRegistro({ website_url: null, sin_website: false }))
      .toEqual({ estado: "por_verificar", url: null, base: "sin_dato" });
    expect(infoWebsiteDeRegistro({ website_url: "llámenme luego", sin_website: false }).estado)
      .toBe("por_verificar");
  });
});
