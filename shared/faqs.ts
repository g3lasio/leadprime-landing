/**
 * FAQ copy (Brief E4 AEO) in both languages. The visible FAQ section and the
 * FAQPage JSON-LD in the static HTML are both rendered from this list, so
 * Google's "structured answers must be visible on the page" rule holds by
 * construction for /, /es, and any future language.
 */
import type { Lang } from "./pageMeta";

export type Faq = { q: string; a: string; compareLink?: boolean };

export const FAQS: Record<Lang, Faq[]> = {
  en: [
    {
      q: "What's the best CRM for contractors that works in Spanish?",
      a: "LeadPrime is built for Latino contractors in the U.S. — it works fully in English and Spanish, so your whole crew can use it. Estimates, invoices, digital contracts, payments, and an AI agent (KEEN) that follows up on leads are all native to the platform, not add-ons.",
    },
    {
      q: "Is there a free CRM for contractors?",
      a: "Yes. LeadPrime starts at $0 with the Pay-As-You-Go plan — you get $15 in welcome credits, no credit card required, and you only pay for what you use. Paid plans are optional: Pro is $15/month and Network Elite is $249/month.",
    },
    {
      q: "What's the difference between the plans and the Growth and Legacy programs?",
      a: "Pay-As-You-Go, Pro, and Network Elite are self-serve software: you set up and run LeadPrime yourself. Growth ($650/month) and Legacy ($1,200/month) are done-with-you programs that include LeadPrime Elite software ($249/month value). In Growth we build the machine and you run it; in Legacy we build it and run it with you. Ad spend is paid directly to Google and Meta, never inside the fee, and results are not guaranteed.",
    },
    {
      q: "What's the best CRM for small contractors or solo operators?",
      a: "LeadPrime is designed for solo operators and small crews: start at $0, send professional estimates from your phone, and let the KEEN AI agent follow up on every lead so none goes cold. There are no setup fees and no annual contract — cancel anytime.",
    },
    {
      q: "Is there a CRM that includes estimates, invoices, and contracts?",
      a: "Yes — in LeadPrime they're native, not paid add-ons. Build an estimate, turn it into an invoice with one tap, send the contract for e-signature (LeadSign), and take card or ACH payment, all inside the same platform.",
    },
    {
      q: "How is LeadPrime different from Jobber or ServiceTitan?",
      a: "Three honest differences: LeadPrime starts at $0 Pay-As-You-Go while competitors start at a monthly subscription; LeadPrime is built bilingual (English and Spanish) rather than translated; and estimates, invoices, contracts, payments, and the AI agent are all included natively. ServiceTitan targets larger operations; Jobber starts from about $39/month (publicly reported figures, July 2026).",
      compareLink: true,
    },
  ],
  es: [
    {
      q: "¿Cuál es el mejor CRM para contratistas que funcione en español?",
      a: "LeadPrime está hecho para contratistas latinos en Estados Unidos — funciona completamente en inglés y en español, para que todo tu equipo lo pueda usar. Estimados, facturas, contratos digitales, pagos y un agente de IA (KEEN) que da seguimiento a tus leads vienen integrados en la plataforma, no como complementos.",
    },
    {
      q: "¿Hay un CRM gratis para contratistas?",
      a: "Sí. LeadPrime empieza en $0 con el plan de pago por uso (Pay-As-You-Go): recibes $15 en créditos de bienvenida, sin tarjeta de crédito, y solo pagas lo que usas. Los planes pagados son opcionales: Pro cuesta $15 al mes y Network Elite $249 al mes.",
    },
    {
      q: "¿Cuál es la diferencia entre los planes y los programas Growth y Legacy?",
      a: "Pago por uso, Pro y Network Elite son software de autoservicio: tú configuras y manejas LeadPrime. Growth ($650 al mes) y Legacy ($1,200 al mes) son programas hechos con nosotros que incluyen el software LeadPrime Elite ($249 al mes de valor). En Growth te construimos la máquina y tú la operas; en Legacy te la construimos y la operamos contigo. La pauta se paga directo a Google y Meta, nunca dentro del fee, y no hay garantía de resultados.",
    },
    {
      q: "¿Cuál es el mejor CRM para contratistas pequeños o que trabajan solos?",
      a: "LeadPrime está pensado para quienes trabajan solos y para equipos pequeños: empieza en $0, manda estimados profesionales desde tu teléfono y deja que el agente de IA KEEN dé seguimiento a cada lead para que ninguno se enfríe. No hay costos de instalación ni contrato anual — cancela cuando quieras.",
    },
    {
      q: "¿Hay un CRM que incluya estimados, facturas y contratos?",
      a: "Sí — en LeadPrime vienen integrados, no son complementos pagados. Haz un estimado, conviértelo en factura con un toque, manda el contrato a firma electrónica (LeadSign) y cobra con tarjeta o ACH, todo dentro de la misma plataforma.",
    },
    {
      q: "¿En qué se diferencia LeadPrime de Jobber o ServiceTitan?",
      a: "Tres diferencias honestas: LeadPrime empieza en $0 con pago por uso, mientras que la competencia empieza con una suscripción mensual; LeadPrime está hecho bilingüe (inglés y español) desde el principio, no traducido después; y estimados, facturas, contratos, pagos y el agente de IA vienen incluidos de forma nativa. ServiceTitan está pensado para operaciones más grandes; Jobber empieza desde unos $39 al mes (cifras reportadas públicamente, julio 2026).",
      compareLink: true,
    },
  ],
};

/** FAQPage structured data mirroring the visible FAQ for `lang`. */
export function faqPageJsonLd(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: FAQS[lang].map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
