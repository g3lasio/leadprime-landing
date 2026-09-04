import { useState } from "react";
import Footer from "@/components/Footer";
import { APP_URL } from "@/lib/appLinks";

type Language = "en" | "es";

const supportEmail = "info@chyrris.com";
const supportPhone = "SOPORTE_TELEFONO";
const responseTarget = "SOPORTE_TIEMPO_RESPUESTA";

const copy = {
  en: {
    nav: "Back to home",
    eyebrow: "LEADPRIME SUPPORT",
    title: "Help for the business you run.",
    description:
      "LeadPrime is the AI-powered CRM that brings leads, messages, estimates, contracts, and payments into one place. Built for contractors and service businesses that want less administrative work and more time in the field.",
    contactTitle: "Get in touch",
    contactIntro: "Our support team assists customers in English and Spanish.",
    emailLabel: "Support email",
    phoneLabel: "Support phone",
    responseLabel: "Response target",
    responseSuffix: "during business days",
    contactNote: "For account access, billing, or data requests, include the email address on your LeadPrime account.",
    faqEyebrow: "QUICK ANSWERS",
    faqTitle: "Frequently asked questions",
    privacyTitle: "Your account and privacy",
    privacyText:
      "Need help with account deletion or a privacy request? Contact support from the email associated with your account. We will verify the request before processing it.",
    privacyLink: "Privacy Policy",
    termsLink: "Terms of Service",
    signInLink: "Go to LeadPrime sign in",
  },
  es: {
    nav: "Volver al inicio",
    eyebrow: "SOPORTE LEADPRIME",
    title: "Ayuda para el negocio que manejas.",
    description:
      "LeadPrime es el CRM impulsado por IA que reúne prospectos, mensajes, estimados, contratos y pagos en un solo lugar. Está diseñado para contratistas y negocios de servicios que quieren menos trabajo administrativo y más tiempo en campo.",
    contactTitle: "Contáctanos",
    contactIntro: "Nuestro equipo de soporte atiende en inglés y español.",
    emailLabel: "Correo de soporte",
    phoneLabel: "Teléfono de soporte",
    responseLabel: "Tiempo de respuesta",
    responseSuffix: "en días hábiles",
    contactNote: "Para acceso a cuenta, cobros o solicitudes de datos, incluye el correo asociado a tu cuenta de LeadPrime.",
    faqEyebrow: "RESPUESTAS RÁPIDAS",
    faqTitle: "Preguntas frecuentes",
    privacyTitle: "Tu cuenta y privacidad",
    privacyText:
      "¿Necesitas borrar tu cuenta o hacer una solicitud de privacidad? Escribe a soporte desde el correo asociado a tu cuenta. Verificaremos la solicitud antes de procesarla.",
    privacyLink: "Política de Privacidad",
    termsLink: "Términos de Servicio",
    signInLink: "Ir a iniciar sesión en LeadPrime",
  },
} as const;

const faqs = {
  en: [
    {
      question: "How do I recover my password?",
      answer:
        "Open the LeadPrime sign-in page and use the password recovery option. If you cannot access the email on your account, contact support so we can help verify your identity.",
    },
    {
      question: "How do I cancel or change my plan?",
      answer:
        "Use the billing area in LeadPrime to review your plan and available options. If you need help with a change or cancellation, email our support team from the address linked to your account.",
    },
    {
      question: "How does billing work?",
      answer:
        "Your plan and any applicable usage are shown in the billing area of LeadPrime. Contact support if a charge, invoice, or payment status needs review.",
    },
    {
      question: "How do I delete my account and data?",
      answer:
        "Email support from the address associated with your account and state that you are requesting account deletion. We will verify the request before processing it.",
    },
    {
      question: "Why can’t I sign in?",
      answer:
        "Confirm that you are using the email tied to your LeadPrime account and try the password recovery option. If the issue continues, send support the email address and a short description of what you see.",
    },
  ],
  es: [
    {
      question: "¿Cómo recupero mi contraseña?",
      answer:
        "Abre la página de inicio de sesión de LeadPrime y usa la opción para recuperar la contraseña. Si no tienes acceso al correo de tu cuenta, contacta a soporte para que podamos verificar tu identidad.",
    },
    {
      question: "¿Cómo cancelo o cambio mi plan?",
      answer:
        "Usa el área de cobros de LeadPrime para revisar tu plan y las opciones disponibles. Si necesitas ayuda con un cambio o cancelación, escribe a soporte desde el correo vinculado a tu cuenta.",
    },
    {
      question: "¿Cómo funciona el cobro?",
      answer:
        "Tu plan y cualquier uso aplicable aparecen en el área de cobros de LeadPrime. Contacta a soporte si necesitas revisar un cargo, factura o estado de pago.",
    },
    {
      question: "¿Cómo borro mi cuenta y mis datos?",
      answer:
        "Escribe a soporte desde el correo asociado a tu cuenta e indica que solicitas borrar la cuenta. Verificaremos la solicitud antes de procesarla.",
    },
    {
      question: "¿Por qué no puedo iniciar sesión?",
      answer:
        "Confirma que usas el correo vinculado a tu cuenta de LeadPrime y prueba la opción de recuperar contraseña. Si el problema continúa, envía a soporte tu correo y una breve descripción de lo que aparece.",
    },
  ],
} as const;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`h-5 w-5 shrink-0 text-[#00D4FF] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  );
}

function SupportQuestion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        className="flex min-h-16 w-full items-center justify-between gap-5 py-5 text-left text-base font-bold text-white outline-none transition-colors hover:text-[#7BE5FF] focus-visible:ring-2 focus-visible:ring-[#00D4FF] focus-visible:ring-offset-2 focus-visible:ring-offset-[#071120]"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{question}</span>
        <Chevron open={open} />
      </button>
      {open ? <p className="max-w-3xl pb-6 pr-10 text-base leading-7 text-white/65">{answer}</p> : null}
    </article>
  );
}

export default function SupportPage() {
  const [language, setLanguage] = useState<Language>("en");
  const t = copy[language];
  const alternateLanguage: Language = language === "en" ? "es" : "en";

  return (
    <div className="min-h-screen bg-[#050B18] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
      <header className="border-b border-white/10 bg-[#050B18]/95 backdrop-blur">
        <div className="container mx-auto flex min-h-20 items-center justify-between gap-4 px-4 lg:px-8">
          <a href="/" className="inline-flex shrink-0 items-center rounded outline-none focus-visible:ring-2 focus-visible:ring-[#00D4FF]">
            <img src="/logo-full.png" alt="LeadPrime" className="h-9 w-auto" width={160} height={36} />
          </a>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="hidden rounded px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-[#00D4FF] focus-visible:ring-2 focus-visible:ring-[#00D4FF] sm:inline-flex"
            >
              {t.nav}
            </a>
            <button
              type="button"
              className="min-h-11 rounded-lg border border-[#00D4FF]/35 px-3 text-sm font-bold text-[#8DE8FF] transition-colors hover:border-[#00D4FF] hover:bg-[#00D4FF]/10 focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
              onClick={() => setLanguage(alternateLanguage)}
              aria-label={language === "en" ? "Cambiar a español" : "Switch to English"}
            >
              {language === "en" ? "ES" : "EN"}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-white/10 bg-[#071120] py-20 sm:py-28">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,212,255,0.16),transparent_45%)]" aria-hidden="true" />
          <div className="container relative mx-auto max-w-4xl px-4 text-center lg:px-8">
            <p className="mb-5 text-xs font-bold tracking-[0.22em] text-[#00D4FF]">{t.eyebrow}</p>
            <h1 className="text-balance text-4xl font-black leading-tight text-white sm:text-6xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t.title}
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-pretty text-lg leading-8 text-white/70">{t.description}</p>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24" aria-labelledby="contact-title">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="mb-4 text-xs font-bold tracking-[0.22em] text-[#00D4FF]">CONTACT</p>
              <h2 id="contact-title" className="text-3xl font-black text-white sm:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t.contactTitle}
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-white/65">{t.contactIntro}</p>
              <p className="mt-5 max-w-md text-sm leading-6 text-white/45">{t.contactNote}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <a
                className="lp-card lp-border-cyan rounded-2xl p-6 outline-none transition hover:-translate-y-0.5 hover:border-[#00D4FF]/60 focus-visible:ring-2 focus-visible:ring-[#00D4FF]"
                href={`mailto:${supportEmail}`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00D4FF]">{t.emailLabel}</p>
                <p className="mt-3 break-all text-lg font-bold text-white">{supportEmail}</p>
              </a>
              <div className="lp-card rounded-2xl p-6">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00D4FF]">{t.phoneLabel}</p>
                <p className="mt-3 text-lg font-bold text-white">{supportPhone}</p>
              </div>
              <div className="lp-card rounded-2xl p-6 sm:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#00D4FF]">{t.responseLabel}</p>
                <p className="mt-3 text-lg font-bold text-white">
                  {responseTarget} <span className="text-white/55">{t.responseSuffix}</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#071120] py-16 lg:py-24" aria-labelledby="faq-title">
          <div className="container mx-auto max-w-4xl px-4 lg:px-8">
            <p className="mb-4 text-center text-xs font-bold tracking-[0.22em] text-[#00D4FF]">{t.faqEyebrow}</p>
            <h2 id="faq-title" className="text-center text-3xl font-black text-white sm:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {t.faqTitle}
            </h2>
            <div className="mt-10 rounded-2xl border border-white/10 bg-[#0A1628] px-6 sm:px-8">
              {faqs[language].map((faq) => (
                <SupportQuestion key={faq.question} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-6xl px-4 py-16 lg:px-8 lg:py-24" aria-labelledby="privacy-title">
          <div className="lp-card rounded-2xl p-8 sm:p-12">
            <div className="max-w-3xl">
              <p className="text-xs font-bold tracking-[0.22em] text-[#F59E0B]">PRIVACY</p>
              <h2 id="privacy-title" className="mt-4 text-3xl font-black text-white sm:text-4xl" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {t.privacyTitle}
              </h2>
              <p className="mt-5 text-base leading-7 text-white/65">{t.privacyText}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a className="lp-btn-primary rounded-xl px-5 py-3 text-center text-sm" href={`${APP_URL}/privacy-policy`} target="_blank" rel="noopener noreferrer">
                  {t.privacyLink}
                </a>
                <a className="rounded-xl border border-white/20 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-[#00D4FF] hover:text-[#8DE8FF] focus-visible:ring-2 focus-visible:ring-[#00D4FF]" href={`${APP_URL}/terms-of-service`} target="_blank" rel="noopener noreferrer">
                  {t.termsLink}
                </a>
                <a className="rounded-xl border border-white/20 px-5 py-3 text-center text-sm font-bold text-white transition hover:border-[#00D4FF] hover:text-[#8DE8FF] focus-visible:ring-2 focus-visible:ring-[#00D4FF]" href={`${APP_URL}/?auth=signin`} target="_blank" rel="noopener noreferrer">
                  {t.signInLink}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
