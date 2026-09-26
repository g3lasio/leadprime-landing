/**
 * Landing language (EN/ES). Pages take their language from the route
 * (/ and /programs = English, /es and /programas = Spanish) and provide it
 * through LangContext; each component picks from its own `{ en, es }` copy
 * with useLang().
 */
import { createContext, useContext, useEffect } from "react";
import {
  PAGE_META,
  SITE_URL,
  type Lang,
  type PagePath,
} from "@shared/pageMeta";

export type { Lang };

export const LangContext = createContext<Lang>("en");

export const useLang = () => useContext(LangContext);

const STORAGE_KEY = "lp-lang";

/** Remembers an explicit EN/ES choice (storage can be blocked — ignored). */
export function rememberLang(lang: Lang) {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* private mode / blocked storage: the choice just isn't remembered */
  }
}

/**
 * Language for a visitor who lands on "/": the EN/ES choice they made
 * before, otherwise their browser's first preferred language.
 */
export function preferredLang(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "es") return saved;
  } catch {
    /* fall through to the browser language */
  }
  const first = navigator.languages?.[0] ?? navigator.language ?? "";
  return first.toLowerCase().startsWith("es") ? "es" : "en";
}

/**
 * The server already renders each page's <head>; this keeps <html lang>,
 * title, description, and canonical right after client-side navigation
 * (EN/ES toggle, redirects).
 */
export function usePageMeta(pagePath: PagePath) {
  useEffect(() => {
    const meta = PAGE_META[pagePath];
    document.documentElement.lang = meta.lang;
    document.title = meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", meta.description);
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", SITE_URL + (pagePath === "/" ? "/" : pagePath));
  }, [pagePath]);
}

/**
 * Scrolls to the URL #fragment once the page content is rendered — the
 * browser can't do it on its own for SPA-rendered sections (e.g. a nav link
 * from /programas to /es#pricing).
 */
export function useScrollToHash(ready = true) {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!ready || !id) return;
    const frame = requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView()
    );
    return () => cancelAnimationFrame(frame);
  }, [ready]);
}
