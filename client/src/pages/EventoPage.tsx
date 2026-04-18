import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Event constants
const EVENT_DATE = "Viernes 22 de Mayo, 2026";
const EVENT_TIME = "7:00 PM – 10:00 PM";
const EVENT_VENUE = "Fairfield Community Center";
const EVENT_ADDRESS = "1000 Kentucky St, Fairfield, CA 94533";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663306487441/bdcwZfK93hqCYNkzHv426f/noche-chyrris-hero_73b82ad9.jpg";
const GELASIO_PHOTO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663306487441/bdcwZfK93hqCYNkzHv426f/gelasio-photo_3fe4ac74.png";

const CITIES = [
  "Fairfield", "Vacaville", "Vallejo", "Benicia", "Suisun City",
  "Napa", "American Canyon", "Martinez", "Concord", "Walnut Creek",
  "Pittsburg", "Antioch", "Otra",
];

const TRADE_TYPES = [
  "Plomería", "Electricidad", "Roofing", "Fencing", "Handyman general",
  "Carpintería", "Pintura", "Pisos/Flooring", "Jardinería/Landscaping",
  "Concreto", "HVAC", "Remodelación", "Drywall", "Otro",
];

const YEARS_OPTIONS = [
  "Menos de 1 año", "1-3 años", "4-7 años", "8-15 años", "Más de 15 años",
];

type FormData = {
  full_name: string;
  phone: string;
  email: string;
  role: string;
  city: string;
  city_other: string;
  preferred_language: string;
  // Contractor
  business_name: string;
  trade_types: string[];
  trade_other: string;
  has_cslb_license: string;
  cslb_license_number: string;
  years_in_business: string;
  team_size: string;
  current_estimating_tool: string;
  // PM
  units_managed: string;
  property_types: string[];
  has_real_estate_license: string;
  current_pm_software: string;
  // Realtor
  brokerage_name: string;
  dre_license_number: string;
  also_property_manager: string;
  service_areas: string[];
  // Other
  profession_description: string;
  // Common final
  referral_source: string;
  referral_name: string;
  dietary_restriction: string;
  dietary_other: string;
  consent_contact: boolean;
  consent_photo: boolean;
};

const initialForm: FormData = {
  full_name: "", phone: "", email: "", role: "", city: "", city_other: "",
  preferred_language: "",
  business_name: "", trade_types: [], trade_other: "", has_cslb_license: "",
  cslb_license_number: "", years_in_business: "", team_size: "", current_estimating_tool: "",
  units_managed: "", property_types: [], has_real_estate_license: "", current_pm_software: "",
  brokerage_name: "", dre_license_number: "", also_property_manager: "", service_areas: [],
  profession_description: "",
  referral_source: "", referral_name: "", dietary_restriction: "", dietary_other: "",
  consent_contact: false, consent_photo: false,
};

function RegistrationForm({ onSuccess }: { onSuccess: (code: string) => void }) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2>(1);

  const register = trpc.evento.register.useMutation({
    onSuccess: (data) => onSuccess(data.code),
    onError: (e) => {
      if (e.message.includes("ya está registrado")) {
        toast.error(e.message);
      } else {
        toast.error("Hubo un error al procesar tu registro. Intenta de nuevo.");
      }
    },
  });

  const set = (field: keyof FormData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleMulti = (field: "trade_types" | "property_types" | "service_areas", val: string) => {
    const arr = form[field] as string[];
    set(field, arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const validateStep1 = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.full_name || form.full_name.length < 3) e.full_name = "Ingresa tu nombre completo";
    if (!form.phone) e.phone = "Ingresa tu teléfono";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ingresa un email válido";
    if (!form.role) e.role = "Selecciona tu rol";
    if (!form.city) e.city = "Selecciona tu ciudad";
    if (form.city === "Otra" && !form.city_other) e.city_other = "Escribe tu ciudad";
    if (!form.consent_contact) e.consent_contact = "Necesitamos tu autorización para contactarte";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.full_name || form.full_name.length < 3) e.full_name = "Ingresa tu nombre completo";
    if (!form.phone) e.phone = "Ingresa tu teléfono";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ingresa un email válido";
    if (!form.role) e.role = "Selecciona tu rol";
    if (!form.city) e.city = "Selecciona tu ciudad";
    if (form.city === "Otra" && !form.city_other) e.city_other = "Escribe tu ciudad";
    if (!form.consent_contact) e.consent_contact = "Necesitamos tu autorización para contactarte";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Por favor completa los campos requeridos");
      return;
    }

    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      role: form.role as "Contratista" | "Property Manager" | "Realtor" | "Otro profesional de la industria",
      city: form.city === "Otra" ? form.city_other : form.city,
      preferred_language: form.preferred_language,
      business_name: form.business_name || null,
      trade_types: form.trade_types.length > 0
        ? form.trade_types.map((t) => t === "Otro" && form.trade_other ? form.trade_other : t).join(", ")
        : null,
      has_cslb_license: form.has_cslb_license || null,
      cslb_license_number: form.cslb_license_number || null,
      years_in_business: form.years_in_business || null,
      team_size: form.team_size || null,
      current_estimating_tool: form.current_estimating_tool || null,
      units_managed: form.units_managed || null,
      property_types: form.property_types.length > 0 ? form.property_types.join(", ") : null,
      has_real_estate_license: form.has_real_estate_license || null,
      current_pm_software: form.current_pm_software || null,
      brokerage_name: form.brokerage_name || null,
      dre_license_number: form.dre_license_number || null,
      also_property_manager: form.also_property_manager || null,
      service_areas: form.service_areas.length > 0 ? form.service_areas.join(", ") : null,
      profession_description: form.profession_description || null,
      referral_source: form.referral_source,
      referral_name: form.referral_name || null,
      dietary_restriction: form.dietary_restriction === "Otra" && form.dietary_other
        ? form.dietary_other
        : form.dietary_restriction,
      consent_contact: form.consent_contact,
      consent_photo: form.consent_photo,
    };

    register.mutate(payload);
  };

  const handleSkipStep2 = () => {
    // Submit with only step 1 data
    const payload = {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      role: form.role as "Contratista" | "Property Manager" | "Realtor" | "Otro profesional de la industria",
      city: form.city === "Otra" ? form.city_other : form.city,
      preferred_language: form.preferred_language || "Español",
      business_name: null, trade_types: null, has_cslb_license: null, cslb_license_number: null,
      years_in_business: null, team_size: null, current_estimating_tool: null, units_managed: null,
      property_types: null, has_real_estate_license: null, current_pm_software: null,
      brokerage_name: null, dre_license_number: null, also_property_manager: null,
      service_areas: null, profession_description: null,
      referral_source: "No especificado", referral_name: null,
      dietary_restriction: "Ninguna",
      consent_contact: form.consent_contact, consent_photo: false,
    };
    register.mutate(payload);
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-3 rounded-xl bg-white/5 border ${errors[field] ? "border-red-500/60" : "border-white/10"} text-white placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 transition-colors`;

  const labelClass = "block text-sm text-white/70 mb-1.5 font-medium";
  const errorClass = "text-red-400 text-xs mt-1";
  const checkboxClass = "w-4 h-4 rounded border-white/20 bg-white/5 accent-[#D4AF37] cursor-pointer";

  return (
    <div className="space-y-6">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${step === 1 ? 'bg-[#D4AF37] text-[#080C14]' : 'bg-[#D4AF37]/20 text-[#D4AF37]'}`}>1</div>
        <div className="flex-1 h-px bg-white/10" />
        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-black ${step === 2 ? 'bg-[#D4AF37] text-[#080C14]' : 'bg-white/10 text-white/30'}`}>2</div>
      </div>

      {step === 1 && (
      <form onSubmit={handleStep1} className="space-y-5">
        <p className="text-white/50 text-xs text-center">Paso 1 de 2 — Información básica</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre completo *</label>
            <input className={inputClass("full_name")} value={form.full_name} onChange={(e) => set("full_name", e.target.value)} placeholder="Tu nombre completo" />
            {errors.full_name && <p className={errorClass}>{errors.full_name}</p>}
          </div>
          <div>
            <label className={labelClass}>Teléfono (USA) *</label>
            <input className={inputClass("phone")} value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(707) 555-0100" type="tel" />
            {errors.phone && <p className={errorClass}>{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Email *</label>
          <input className={inputClass("email")} value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tu@email.com" type="email" />
          {errors.email && <p className={errorClass}>{errors.email}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>¿Cuál es tu rol? *</label>
            <select className={inputClass("role") + " bg-[#0D1220]"} value={form.role} onChange={(e) => set("role", e.target.value)}>
              <option value="">Selecciona tu rol</option>
              <option>Contratista</option>
              <option>Property Manager</option>
              <option>Realtor</option>
              <option>Otro profesional de la industria</option>
            </select>
            {errors.role && <p className={errorClass}>{errors.role}</p>}
          </div>
          <div>
            <label className={labelClass}>Ciudad *</label>
            <select className={inputClass("city") + " bg-[#0D1220]"} value={form.city} onChange={(e) => set("city", e.target.value)}>
              <option value="">Selecciona tu ciudad</option>
              {CITIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            {errors.city && <p className={errorClass}>{errors.city}</p>}
          </div>
        </div>

        {form.city === "Otra" && (
          <div>
            <label className={labelClass}>¿Cuál ciudad? *</label>
            <input className={inputClass("city_other")} value={form.city_other} onChange={(e) => set("city_other", e.target.value)} placeholder="Escribe tu ciudad" />
            {errors.city_other && <p className={errorClass}>{errors.city_other}</p>}
          </div>
        )}

        <div className="p-4 rounded-xl bg-white/3 border border-white/10">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={form.consent_contact} onChange={(e) => set("consent_contact", e.target.checked)} className={checkboxClass + " mt-0.5 flex-shrink-0"} />
            <span className="text-white/70 text-sm leading-relaxed">
              Autorizo que Chyrris me contacte por teléfono y email para confirmar mi asistencia y enviarme información del evento. *
            </span>
          </label>
          {errors.consent_contact && <p className={errorClass}>{errors.consent_contact}</p>}
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl font-black text-lg text-[#080C14] transition-all"
          style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)" }}
        >
          Solicitar mi Invitación →
        </button>
        <p className="text-center text-white/30 text-xs">Gratis · Sin tarjeta de crédito · Cupo limitado a 150 personas</p>
      </form>
      )}

      {step === 2 && (
      <form onSubmit={handleSubmit} className="space-y-5">
        <p className="text-white/50 text-xs text-center">Paso 2 de 2 — Completa tu perfil (opcional)</p>
        <div className="p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/20">
          <p className="text-[#D4AF37] text-sm font-bold mb-1">Hola {form.full_name.split(' ')[0]}! 👋</p>
          <p className="text-white/60 text-sm">Tu solicitud ya fue recibida. Completar tu perfil nos ayuda a preparar mejor el evento. Es opcional — puedes saltarte este paso.</p>
        </div>

        {form.role === "Contratista" && (
          <div className="space-y-4 p-4 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/5">
            <p className="text-[#D4AF37] text-sm font-bold uppercase tracking-wider">Sobre tu negocio</p>
            <div><label className={labelClass}>Nombre del negocio</label><input className={inputClass("business_name")} value={form.business_name} onChange={(e) => set("business_name", e.target.value)} placeholder="Ej: García Roofing & Construction" /></div>
            <div><label className={labelClass}>Tipo de trabajo</label><div className="grid grid-cols-2 gap-2 mt-1">{TRADE_TYPES.slice(0,8).map((t) => (<label key={t} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.trade_types.includes(t)} onChange={() => toggleMulti("trade_types", t)} className={checkboxClass} /><span className="text-white/70 text-sm">{t}</span></label>))}</div></div>
            <div><label className={labelClass}>Años en el negocio</label><select className={inputClass("years_in_business") + " bg-[#0D1220]"} value={form.years_in_business} onChange={(e) => set("years_in_business", e.target.value)}><option value="">Selecciona</option>{YEARS_OPTIONS.map((y) => <option key={y}>{y}</option>)}</select></div>
          </div>
        )}

        {form.role === "Property Manager" && (
          <div className="space-y-4 p-4 rounded-xl border border-[#00D4FF]/20 bg-[#00D4FF]/5">
            <p className="text-[#00D4FF] text-sm font-bold uppercase tracking-wider">Sobre tu empresa</p>
            <div><label className={labelClass}>Nombre de la empresa</label><input className={inputClass("business_name")} value={form.business_name} onChange={(e) => set("business_name", e.target.value)} placeholder="Ej: Solano Property Group" /></div>
            <div><label className={labelClass}>Unidades que manejas</label><select className={inputClass("units_managed") + " bg-[#0D1220]"} value={form.units_managed} onChange={(e) => set("units_managed", e.target.value)}><option value="">Selecciona</option>{["1-10","11-25","26-50","51-100","Más de 100"].map((u) => <option key={u}>{u}</option>)}</select></div>
            <div><label className={labelClass}>Software actual</label><select className={inputClass("current_pm_software") + " bg-[#0D1220]"} value={form.current_pm_software} onChange={(e) => set("current_pm_software", e.target.value)}><option value="">Selecciona</option>{["AppFolio","Buildium","Propertyware","Rent Manager","Excel/Google Sheets","Ninguno","Otro"].map((s) => <option key={s}>{s}</option>)}</select></div>
          </div>
        )}

        {form.role === "Realtor" && (
          <div className="space-y-4 p-4 rounded-xl border border-[#A78BFA]/20 bg-[#A78BFA]/5">
            <p className="text-[#A78BFA] text-sm font-bold uppercase tracking-wider">Sobre tu brokerage</p>
            <div><label className={labelClass}>Nombre del brokerage</label><input className={inputClass("brokerage_name")} value={form.brokerage_name} onChange={(e) => set("brokerage_name", e.target.value)} placeholder="Ej: Keller Williams Fairfield" /></div>
            <div><label className={labelClass}>Años en el negocio</label><select className={inputClass("years_in_business") + " bg-[#0D1220]"} value={form.years_in_business} onChange={(e) => set("years_in_business", e.target.value)}><option value="">Selecciona</option>{YEARS_OPTIONS.map((y) => <option key={y}>{y}</option>)}</select></div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>¿Cómo te enteraste?</label><select className={inputClass("referral_source") + " bg-[#0D1220]"} value={form.referral_source} onChange={(e) => set("referral_source", e.target.value)}><option value="">Selecciona</option>{["Invitación directa de Gelasio","Un amigo/colega me invitó","Home Depot","Redes sociales","Otro"].map((r) => <option key={r}>{r}</option>)}</select></div>
          <div><label className={labelClass}>Restricción alimentaria</label><select className={inputClass("dietary_restriction") + " bg-[#0D1220]"} value={form.dietary_restriction} onChange={(e) => set("dietary_restriction", e.target.value)}><option value="">Ninguna</option>{["Ninguna","Vegetariano","Vegano","Sin gluten","Otra"].map((d) => <option key={d}>{d}</option>)}</select></div>
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={form.consent_photo} onChange={(e) => set("consent_photo", e.target.checked)} className={checkboxClass + " mt-0.5 flex-shrink-0"} />
          <span className="text-white/70 text-sm leading-relaxed">Autorizo el uso de fotos del evento para redes sociales de Chyrris. (Opcional)</span>
        </label>

        <div className="flex gap-3">
          <button type="button" onClick={handleSkipStep2} disabled={register.isPending} className="flex-1 py-3 rounded-2xl font-bold text-white/60 border border-white/10 hover:border-white/20 transition-colors text-sm">
            {register.isPending ? "Enviando..." : "Saltar este paso"}
          </button>
          <button type="submit" disabled={register.isPending} className="flex-1 py-3 rounded-2xl font-black text-[#080C14] transition-all disabled:opacity-60" style={{ background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)" }}>
            {register.isPending ? "Enviando..." : "Completar perfil →"}
          </button>
        </div>
      </form>
      )}
    </div>
  );
}


function SuccessScreen({ code, onClose }: { code: string; onClose: () => void }) {
  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        ¡Solicitud recibida!
      </h3>
      <p className="text-white/60 mb-6">Revisa tu email — te enviamos todos los detalles.</p>

      <div className="inline-block px-8 py-4 rounded-2xl mb-6" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
        <p className="text-white/40 text-xs uppercase tracking-widest mb-1">Tu código de asistente</p>
        <p className="text-[#D4AF37] text-4xl font-black tracking-widest" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {code}
        </p>
      </div>

      <p className="text-white/50 text-sm mb-6">
        Guarda este código — lo necesitarás para el check-in el día del evento.
      </p>

      <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left mb-6">
        <p className="text-white/80 text-sm font-medium mb-2">📅 Detalles del evento</p>
        <p className="text-white/60 text-sm">{EVENT_DATE}</p>
        <p className="text-white/60 text-sm">{EVENT_TIME} · Solano County, California</p>
        <p className="text-white/40 text-xs mt-2">La dirección exacta se confirma 7 días antes por email.</p>
      </div>

      <button onClick={onClose} className="text-white/40 text-sm hover:text-white/60 transition-colors">
        Cerrar
      </button>
    </div>
  );
}

export default function EventoPage() {
  const [showModal, setShowModal] = useState(false);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowSticky(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openModal = () => { setSuccessCode(null); setShowModal(true); };
  const closeModal = () => setShowModal(false);
  const handleSuccess = (code: string) => setSuccessCode(code);

  const goldBtn = "inline-block px-8 py-4 rounded-2xl font-black text-lg text-[#080C14] cursor-pointer transition-all hover:scale-105 active:scale-95";
  const goldBtnStyle = { background: "linear-gradient(135deg, #D4AF37 0%, #F5E6A3 50%, #D4AF37 100%)" };

  return (
    <div className="min-h-screen bg-[#080C14] text-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* Sticky CTA */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${showSticky ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        style={{ background: "rgba(8,12,20,0.95)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(212,175,55,0.2)" }}
      >
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div>
            <p className="text-white font-bold text-sm">La Noche Chyrris</p>
            <p className="text-white/40 text-xs">22 de Mayo · Solano County</p>
          </div>
          <button onClick={openModal} className={goldBtn + " text-sm px-6 py-3"} style={goldBtnStyle}>
            Solicitar mi Invitación
          </button>
        </div>
      </div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-4" style={{ background: "rgba(8,12,20,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-[#D4AF37] text-sm" style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}>C</div>
            <span className="text-white font-bold text-sm">Chyrris</span>
          </div>
          <button onClick={openModal} className="px-4 py-2 rounded-xl text-sm font-bold text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/10 transition-colors">
            Confirmar Lugar
          </button>
        </div>
      </nav>

      {/* SECTION 1: Hero */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-20"
        style={{ minHeight: "100vh" }}
      >
        <div className="absolute inset-0 z-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(8,12,20,0.7) 0%, rgba(8,12,20,0.5) 50%, rgba(8,12,20,0.95) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6" style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37" }}>
            Primera Reunión · Solo por Invitación
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-white mb-4 leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            La Noche<br />
            <span style={{ WebkitTextStroke: "2px #D4AF37", color: "transparent" }}>Chyrris</span>
          </h1>

          <p className="text-xl sm:text-2xl text-white/70 mb-8 font-medium">
            Contratistas y Property Managers<br />del Norte de California
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: "📅", text: EVENT_DATE },
              { icon: "📍", text: "Solano County, California" },
              { icon: "🎟", text: "150 cupos exclusivos" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white/80" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>

          <button onClick={openModal} className={goldBtn + " text-xl px-10 py-5 shadow-2xl"} style={goldBtnStyle}>
            Solicitar mi Invitación →
          </button>

          <p className="text-white/40 text-sm mt-4">
            Gratis · Incluye comida y bebidas · 90 minutos que pueden cambiar tu negocio
          </p>
        </div>

        {/* Logos bottom right */}
        <div className="absolute bottom-8 right-6 z-10 flex items-center gap-3 opacity-50">
          <span className="text-white/40 text-xs">Presentado por</span>
          <span className="text-white/60 text-xs font-bold">LeadPrime</span>
          <span className="text-white/30">·</span>
          <span className="text-white/60 text-xs font-bold">Owl Fenc</span>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-white/40 rounded-full" />
          </div>
        </div>
      </section>

      {/* SECTION 2: El problema */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contractors */}
            <div className="p-6 rounded-2xl" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
              <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4">Para contratistas</p>
              <h3 className="text-xl font-bold text-white mb-4 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                "Si eres contratista en el Bay Area, esto te suena familiar:"
              </h3>
              <ul className="space-y-3">
                {[
                  "Pierdes leads porque no alcanzas a llamar de regreso a tiempo.",
                  "Haces estimados en papel o en Excel, te tardas 2 horas, el cliente ya contrató a otro.",
                  "Mandas contratos por WhatsApp y nunca sabes si el cliente los firmó realmente.",
                  "Quieres chamba recurrente con property managers pero no sabes cómo llegar a ellos.",
                  "Tus competidores tienen apps en inglés que tú no entiendes y que cobran $200+ al mes.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                    <span className="text-[#D4AF37] mt-0.5 flex-shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Property Managers */}
            <div className="p-6 rounded-2xl" style={{ background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.15)" }}>
              <p className="text-[#00D4FF] text-xs font-bold uppercase tracking-widest mb-4">Para property managers</p>
              <h3 className="text-xl font-bold text-white mb-4 leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                "Si administras propiedades, conoces este dolor:"
              </h3>
              <ul className="space-y-3">
                {[
                  "Llamas a 5 plomeros un sábado en la noche y nadie contesta.",
                  "El contratista que sí viene te cobra el doble porque es fin de semana.",
                  "Coordinas todo por WhatsApp y pierdes 2 horas al día en logística.",
                  "Nunca sabes cuáles contratistas son de confianza hasta que te fallan.",
                  "Usas AppFolio o Buildium que te cobra $300/mes y sigues sin resolver el problema humano.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70 text-sm leading-relaxed">
                    <span className="text-[#00D4FF] mt-0.5 flex-shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Por eso estamos organizando esta noche.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: Timeline */}
      <section className="py-20 px-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">El programa</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Qué va a pasar esa noche
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { time: "7:00 PM", title: "Llegada y networking", desc: "Café, botanas, bebidas. 30 minutos para conocer a otros profesionales del condado. Credenciales con QR para intercambio rápido de contactos.", icon: "🤝" },
              { time: "7:30 PM", title: "La ponencia", desc: "Gelasio Sánchez comparte por qué llevó años construyendo una plataforma específicamente para la industria latina de construction y property management. 20 minutos, puro contenido real.", icon: "🎤" },
              { time: "7:55 PM", title: "Demo en vivo", desc: "Un estimado profesional generado en 99 segundos. Un contrato firmado digitalmente frente a ustedes. El proceso que hoy te toma 2 horas, ejecutado en menos de 5 minutos.", icon: "⚡" },
              { time: "8:20 PM", title: "Tu perfil en la red", desc: "Mesa de registro con iPads. Creas tu perfil en LeadPrime Network ahí mismo. Sales del evento con 3-5 conexiones reales ya guardadas en tu teléfono.", icon: "📱" },
            ].map((item, i) => (
              <div key={i} className="relative p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="text-3xl mb-3">{item.icon}</div>
                <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-1">{item.time}</p>
                <h4 className="text-white font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{item.title}</h4>
                <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-xl text-center" style={{ background: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.15)" }}>
            <p className="text-white/60 text-sm">
              <span className="text-[#D4AF37] font-bold">7:30 PM — Después del cierre:</span>{" "}
              Continuamos conversaciones 1:1 con quien quiera quedarse. Los mejores acuerdos siempre se cierran en la segunda hora.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">Beneficios exclusivos</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Tu asistencia incluye:
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                badge: "Para contratistas",
                color: "#D4AF37",
                title: "60 días de Owl Fenc Mero Patrón",
                value: "Valor real: $99.98",
                features: [
                  "500 créditos AI por mes (1,000 totales)",
                  "Estimados profesionales sin marca de agua",
                  "Contratos con firma dual (Dual Signature Protocol)",
                  "Property Verifier para evitar fraudes",
                  "AI Invoices y Permit Advisor",
                  "Perfil verificado en LeadPrime Network",
                  "Acceso a property managers del condado",
                ],
                footer: "Sin tarjeta de crédito · Sin compromisos · Cancelas cuando quieras",
              },
              {
                badge: "Para property managers",
                color: "#00D4FF",
                title: "60 días de LeadPrime Pro + $50 en créditos",
                value: "Valor real: $80.00",
                features: [
                  "$20 en créditos renovables + $50 de bonus",
                  "Command Center para llamadas y mensajes",
                  "AI Autopilot con inquilinos y contratistas",
                  "LeadSign para contratos digitales",
                  "Property Manager Module completo",
                  "Directorio de contratistas verificados",
                  "Invitación a eventos futuros del ecosistema",
                ],
                footer: "Sin tarjeta de crédito · Sin compromisos · Cancelas cuando quieras",
              },
              {
                badge: "Para realtors",
                color: "#A78BFA",
                title: "60 días de LeadPrime Pro + 50% off Network Elite",
                value: "Valor real: $452.50 en 5 meses",
                features: [
                  "60 días de LeadPrime Pro gratis ($30 de valor)",
                  "3 meses de Network Elite al 50% después",
                  "Government Projects access",
                  "Business Financing & 0% Credit Lines",
                  "Acceso al directorio completo",
                  "Exclusive Networking Events",
                ],
                footer: "Sin tarjeta de crédito el día del evento · Upgrade voluntario solo si decides continuar",
              },
            ].map((card) => (
              <div
                key={card.badge}
                className="p-6 rounded-2xl flex flex-col"
                style={{ background: `${card.color}08`, border: `1px solid ${card.color}25` }}
              >
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 self-start" style={{ background: `${card.color}20`, color: card.color }}>
                  {card.badge}
                </div>
                <h3 className="text-xl font-black text-white mb-1 leading-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {card.title}
                </h3>
                <p className="text-sm font-bold mb-4" style={{ color: card.color }}>{card.value}</p>
                <ul className="space-y-2 flex-1 mb-4">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                      <span style={{ color: card.color }} className="mt-0.5 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <p className="text-white/30 text-xs border-t border-white/10 pt-3">{card.footer}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 rounded-2xl text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/60 text-sm italic leading-relaxed">
              "Los beneficios se activan el día del evento al crear tu perfil en LeadPrime Network. Todos los regalos son reales, sin letra pequeña, sin trucos. Si no quieres usarlos, no los uses — pero están ahí para ti."
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: Host */}
      <section className="py-20 px-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(212,175,55,0.2)" }}>
                <img src={GELASIO_PHOTO} alt="Gelasio Sánchez" className="w-full object-cover" style={{ maxHeight: "500px", objectPosition: "top" }} />
              </div>
              <div className="absolute -bottom-4 -right-4 px-4 py-2 rounded-xl" style={{ background: "rgba(8,12,20,0.95)", border: "1px solid rgba(212,175,55,0.3)" }}>
                <p className="text-[#D4AF37] text-xs font-bold">Gelasio Sánchez</p>
                <p className="text-white/40 text-xs">Founder, Chyrris</p>
              </div>
            </div>

            <div>
              <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-4">Sobre el host</p>
              <div className="space-y-4 text-white/70 leading-relaxed">
                <p>"Me llamo Gelasio Sánchez. Soy el founder de Chyrris, la compañía madre detrás de LeadPrime y Owl Fenc.</p>
                <p>Llevo años viendo cómo la industria de construction y property management en el Bay Area opera con herramientas que no fueron hechas para nosotros — caras, complicadas, en inglés, y diseñadas para corporaciones que manejan 500 propiedades, no para el plomero independiente o el PM que maneja 30 unidades en Fairfield.</p>
                <p>Por eso construí Chyrris. Y por eso los invito esta noche. Creo que el contratista latino y el property manager local del condado merecen herramientas tan buenas como las que tienen los grandes, pero diseñadas para como realmente trabajamos y en el idioma que hablamos.</p>
                <p>Si vienes esa noche, te prometo dos cosas: vas a salir con contactos reales que van a mover tu negocio, y vas a tener herramientas que te van a cambiar cómo trabajas. Lo demás es bonus."</p>
              </div>
              <p className="text-white/50 text-sm mt-4 italic">Nos vemos el 22 de mayo. — Gelasio</p>

              <button onClick={openModal} className={goldBtn + " mt-6"} style={goldBtnStyle}>
                Solicitar mi Invitación →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">Preguntas frecuentes</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Resolvemos tus dudas
            </h2>
          </div>

          <div className="space-y-3">
            {[
              { q: "¿Tengo que pagar algo?", a: "No. El evento es completamente gratuito, incluyendo comida y bebidas. Los regalos (60 días de Owl Fenc o LeadPrime) tampoco tienen costo para los asistentes." },
              { q: "¿Es un evento para venderme algo?", a: "Es un evento para mostrarte dos productos que creemos que te van a ayudar. Los puedes usar, ignorar, o cancelar después. No te pedimos tarjeta de crédito ni información de pago en ningún momento del evento." },
              { q: "¿Tengo que hablar inglés?", a: "El evento es en español. Si vienes con alguien que solo habla inglés, también es bienvenido — los productos funcionan en ambos idiomas." },
              { q: "¿Puedo llevar a un colega o pareja?", a: "Sí, pero cada persona debe registrarse por separado por tema de cupo y comida." },
              { q: "¿Dónde exactamente va a ser?", a: "Fairfield Community Center, 1000 Kentucky St, Fairfield, CA 94533. Fácilmente accesible desde I-80. Hay estacionamiento disponible." },
              { q: "¿Qué pasa si me registro y no puedo ir?", a: "Avísanos con al menos 48 horas de anticipación para darle tu lugar a alguien de la lista de espera. Respetamos el tiempo de todos." },
              { q: "¿Puedo ir si no soy de Solano/Contra Costa/Napa?", a: "Sí, siempre que el cupo lo permita. Prioridad de registro es para residentes de esos 3 condados, pero si vienes de Sacramento, Marin o Alameda y hay lugar, eres bienvenido." },
              { q: "¿Habrá WiFi disponible en el evento?", a: "Sí, y te vamos a ayudar a configurar tu cuenta de LeadPrime y/o Owl Fenc directamente en tu teléfono durante el tiempo de networking." },
            ].map((item, i) => (
              <FAQItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7: Registration Form (inline) */}
      <section id="registro" className="py-20 px-4" style={{ background: "rgba(212,175,55,0.03)", borderTop: "1px solid rgba(212,175,55,0.1)" }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-3">Registro</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Solicita tu Invitación
            </h2>
            <p className="text-white/50">Gratis · Solo por invitación · 150 cupos exclusivos</p>
          </div>

          {successCode ? (
            <SuccessScreen code={successCode} onClose={() => setSuccessCode(null)} />
          ) : (
            <RegistrationForm onSuccess={handleSuccess} />
          )}
        </div>
      </section>

      {/* SECTION 8: Footer */}
      <footer className="py-12 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="text-4xl font-black text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Chyrris</div>
          <p className="text-white/40 text-sm mb-6">Chyrris es la compañía madre de LeadPrime y Owl Fenc</p>

          <div className="flex justify-center gap-6 mb-6">
            <a href="https://leadprime.chyrris.com" className="text-white/50 hover:text-white/80 text-sm transition-colors">LeadPrime</a>
            <a href="https://owlfenc.com" className="text-white/50 hover:text-white/80 text-sm transition-colors">Owl Fenc</a>
          </div>

          <div className="flex justify-center gap-4 mb-6 text-xs text-white/30">
            <a href="https://chyrris.com/privacy" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="https://chyrris.com/terms" className="hover:text-white/50 transition-colors">Terms of Service</a>
            <span>·</span>
            <a href="mailto:info@chyrris.com" className="hover:text-white/50 transition-colors">info@chyrris.com</a>
          </div>

          <p className="text-white/20 text-xs">© 2026 Chyrris · Owl Fenc LLC · Todos los derechos reservados</p>
          <p className="text-white/15 text-xs mt-1">Hecho con orgullo en California 🌴</p>
        </div>
      </footer>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6"
            style={{ background: "#0D1220", border: "1px solid rgba(212,175,55,0.2)" }}
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/40 hover:text-white text-2xl leading-none z-10"
            >
              ✕
            </button>

            {successCode ? (
              <SuccessScreen code={successCode} onClose={closeModal} />
            ) : (
              <>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-black text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Confirma tu lugar
                  </h2>
                  <p className="text-white/40 text-sm mt-1">La Noche Chyrris · 22 de Mayo, 2026</p>
                </div>
                <RegistrationForm onSuccess={handleSuccess} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden cursor-pointer"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between px-5 py-4 gap-4">
        <p className="text-white font-medium text-sm">{q}</p>
        <span className="text-white/40 text-lg flex-shrink-0 transition-transform" style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}>+</span>
      </div>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-white/60 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}
