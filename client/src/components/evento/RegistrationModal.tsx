import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
  inline?: boolean;
}

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

const YEARS_OPTIONS = ["Menos de 1 año", "1-3 años", "4-7 años", "8-15 años", "Más de 15 años"];

type Role = "Contratista" | "Property Manager" | "Realtor" | "Otro profesional de la industria" | "";

interface FormData {
  full_name: string;
  phone: string;
  email: string;
  role: Role;
  city: string;
  city_other: string;
  preferred_language: string;
  // Contratista
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
  // Otro
  profession_description: string;
  // Common final
  referral_source: string;
  referral_name: string;
  dietary_restriction: string;
  dietary_other: string;
  consent_contact: boolean;
  consent_photo: boolean;
}

const INITIAL: FormData = {
  full_name: "", phone: "", email: "", role: "", city: "", city_other: "",
  preferred_language: "", business_name: "", trade_types: [], trade_other: "",
  has_cslb_license: "", cslb_license_number: "", years_in_business: "",
  team_size: "", current_estimating_tool: "", units_managed: "",
  property_types: [], has_real_estate_license: "", current_pm_software: "",
  brokerage_name: "", dre_license_number: "", also_property_manager: "",
  service_areas: [], profession_description: "", referral_source: "",
  referral_name: "", dietary_restriction: "", dietary_other: "",
  consent_contact: false, consent_photo: false,
};

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-white/80 mb-1.5">
      {children}
      {required && <span className="text-[#D4AF37] ml-1">*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", maxLength }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors"
    />
  );
}

function SelectInput({ value, onChange, children }: {
  value: string; onChange: (v: string) => void; children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 rounded-lg bg-[#0D1220] border border-white/10 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37]/30 transition-colors appearance-none"
    >
      {children}
    </select>
  );
}

function RadioGroup({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="accent-[#D4AF37]"
          />
          <span className="text-sm text-white/75">{opt}</span>
        </label>
      ))}
    </div>
  );
}

function MultiCheckbox({ values, onChange, options }: {
  values: string[]; onChange: (v: string[]) => void; options: string[];
}) {
  const toggle = (opt: string) => {
    if (values.includes(opt)) {
      onChange(values.filter((v) => v !== opt));
    } else {
      onChange([...values, opt]);
    }
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <label
          key={opt}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
            values.includes(opt)
              ? "border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#D4AF37]"
              : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
          }`}
        >
          <input
            type="checkbox"
            checked={values.includes(opt)}
            onChange={() => toggle(opt)}
            className="hidden"
          />
          {values.includes(opt) && <span>✓</span>}
          {opt}
        </label>
      ))}
    </div>
  );
}

function FormContent({ onSuccess }: { onSuccess: (code: string) => void }) {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"form" | "success">("form");
  const [successCode, setSuccessCode] = useState("");

  const set = (field: keyof FormData) => (value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  };

  const registerMutation = trpc.evento.register.useMutation({
    onSuccess: (data) => {
      setSuccessCode(data.code);
      setStep("success");
      onSuccess(data.code);
    },
    onError: (err) => {
      toast.error(err.message || "Error al registrarse. Intenta de nuevo.");
    },
  });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.full_name || form.full_name.length < 3) e.full_name = "Nombre requerido (mínimo 3 caracteres)";
    if (!form.phone) e.phone = "Teléfono requerido";
    else if (!/^\+?1?\d{10}$/.test(form.phone.replace(/[\s\-\(\)]/g, ""))) e.phone = "Número de teléfono USA inválido";
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email válido requerido";
    if (!form.role) e.role = "Selecciona tu rol";
    if (!form.city) e.city = "Selecciona tu ciudad";
    if (form.city === "Otra" && !form.city_other) e.city_other = "Especifica tu ciudad";
    if (!form.preferred_language) e.preferred_language = "Selecciona tu idioma preferido";
    if (!form.consent_contact) e.consent_contact = "Debes aceptar para registrarte";

    if (form.role === "Contratista") {
      if (!form.business_name) e.business_name = "Nombre del negocio requerido";
      if (form.trade_types.length === 0) e.trade_types = "Selecciona al menos un tipo de trabajo";
      if (!form.has_cslb_license) e.has_cslb_license = "Requerido";
      if (!form.years_in_business) e.years_in_business = "Requerido";
      if (!form.team_size) e.team_size = "Requerido";
    }
    if (form.role === "Property Manager") {
      if (!form.business_name) e.business_name = "Nombre del negocio requerido";
      if (!form.units_managed) e.units_managed = "Requerido";
      if (form.property_types.length === 0) e.property_types = "Selecciona al menos uno";
      if (!form.years_in_business) e.years_in_business = "Requerido";
      if (!form.has_real_estate_license) e.has_real_estate_license = "Requerido";
      if (!form.current_pm_software) e.current_pm_software = "Requerido";
    }
    if (form.role === "Realtor") {
      if (!form.brokerage_name) e.brokerage_name = "Nombre del brokerage requerido";
      if (!form.years_in_business) e.years_in_business = "Requerido";
      if (!form.also_property_manager) e.also_property_manager = "Requerido";
      if (form.service_areas.length === 0) e.service_areas = "Selecciona al menos una área";
    }
    if (form.role === "Otro profesional de la industria") {
      if (!form.profession_description) e.profession_description = "Describe tu profesión";
    }
    if (!form.referral_source) e.referral_source = "¿Cómo te enteraste?";
    if (!form.dietary_restriction) e.dietary_restriction = "Requerido";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    registerMutation.mutate({
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
      role: form.role as string,
      city: form.city === "Otra" ? form.city_other : form.city,
      preferred_language: form.preferred_language,
      business_name: form.business_name || null,
      trade_types: form.trade_types.length > 0 ? form.trade_types.join(", ") : null,
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
      dietary_restriction: form.dietary_restriction === "Otra" ? form.dietary_other : form.dietary_restriction,
      consent_contact: form.consent_contact,
      consent_photo: form.consent_photo,
    });
  };

  const err = (field: string) =>
    errors[field] ? <p className="text-red-400 text-xs mt-1">{errors[field]}</p> : null;

  if (step === "success") {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-5xl mb-4">🎉</div>
        <h3
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          ¡Estás dentro!
        </h3>
        <p className="text-white/60 text-sm mb-6">
          Tu lugar está confirmado para La Noche Chyrris — 29 de mayo, 2026
        </p>
        <div
          className="inline-block px-8 py-4 rounded-xl border-2 border-[#D4AF37] mb-6"
          style={{ background: "rgba(212,175,55,0.1)" }}
        >
          <p className="text-white/50 text-xs mb-1">Tu código de asistente</p>
          <p
            className="text-3xl font-bold text-[#D4AF37]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {successCode}
          </p>
        </div>
        <p className="text-white/40 text-xs">
          Revisa tu email — te enviamos la confirmación con todos los detalles.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Common fields */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Nombre completo</FieldLabel>
          <TextInput value={form.full_name} onChange={set("full_name")} placeholder="Juan García" />
          {err("full_name")}
        </div>
        <div>
          <FieldLabel required>Teléfono (USA)</FieldLabel>
          <TextInput value={form.phone} onChange={set("phone")} placeholder="+1 (707) 555-0100" type="tel" />
          {err("phone")}
        </div>
      </div>

      <div>
        <FieldLabel required>Email</FieldLabel>
        <TextInput value={form.email} onChange={set("email")} placeholder="juan@ejemplo.com" type="email" />
        {err("email")}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>¿Cuál es tu rol?</FieldLabel>
          <SelectInput value={form.role} onChange={(v) => set("role")(v as Role)}>
            <option value="">Selecciona...</option>
            <option>Contratista</option>
            <option>Property Manager</option>
            <option>Realtor</option>
            <option>Otro profesional de la industria</option>
          </SelectInput>
          {err("role")}
        </div>
        <div>
          <FieldLabel required>Ciudad</FieldLabel>
          <SelectInput value={form.city} onChange={set("city")}>
            <option value="">Selecciona...</option>
            {CITIES.map((c) => <option key={c}>{c}</option>)}
          </SelectInput>
          {err("city")}
        </div>
      </div>

      {form.city === "Otra" && (
        <div>
          <FieldLabel required>¿Cuál ciudad?</FieldLabel>
          <TextInput value={form.city_other} onChange={set("city_other")} placeholder="Nombre de tu ciudad" />
          {err("city_other")}
        </div>
      )}

      <div>
        <FieldLabel required>Idioma preferido</FieldLabel>
        <RadioGroup
          value={form.preferred_language}
          onChange={set("preferred_language")}
          options={["Español", "English", "Bilingüe"]}
        />
        {err("preferred_language")}
      </div>

      {/* ─── CONTRATISTA FIELDS ─── */}
      {form.role === "Contratista" && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider">Información del contratista</p>

          <div>
            <FieldLabel required>Nombre del negocio</FieldLabel>
            <TextInput value={form.business_name} onChange={set("business_name")} placeholder="García Plomería LLC" />
            {err("business_name")}
          </div>

          <div>
            <FieldLabel required>Tipo de trabajo (selecciona todos los que aplican)</FieldLabel>
            <MultiCheckbox values={form.trade_types} onChange={(v) => set("trade_types")(v)} options={TRADE_TYPES} />
            {err("trade_types")}
          </div>

          {form.trade_types.includes("Otro") && (
            <div>
              <FieldLabel>¿Cuál otro tipo?</FieldLabel>
              <TextInput value={form.trade_other} onChange={set("trade_other")} placeholder="Describe tu especialidad" />
            </div>
          )}

          <div>
            <FieldLabel required>Licencia CSLB</FieldLabel>
            <RadioGroup
              value={form.has_cslb_license}
              onChange={set("has_cslb_license")}
              options={["Sí, tengo licencia CSLB", "No tengo licencia", "En trámite"]}
            />
            {err("has_cslb_license")}
          </div>

          {form.has_cslb_license === "Sí, tengo licencia CSLB" && (
            <div>
              <FieldLabel>Número de licencia CSLB</FieldLabel>
              <TextInput value={form.cslb_license_number} onChange={set("cslb_license_number")} placeholder="123456" />
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Años en el negocio</FieldLabel>
              <SelectInput value={form.years_in_business} onChange={set("years_in_business")}>
                <option value="">Selecciona...</option>
                {YEARS_OPTIONS.map((y) => <option key={y}>{y}</option>)}
              </SelectInput>
              {err("years_in_business")}
            </div>
            <div>
              <FieldLabel required>Tamaño del equipo</FieldLabel>
              <SelectInput value={form.team_size} onChange={set("team_size")}>
                <option value="">Selecciona...</option>
                <option>Solo yo</option>
                <option>2-5 personas</option>
                <option>6-10 personas</option>
                <option>Más de 10</option>
              </SelectInput>
              {err("team_size")}
            </div>
          </div>

          <div>
            <FieldLabel>¿Qué usas actualmente para estimados?</FieldLabel>
            <SelectInput value={form.current_estimating_tool} onChange={set("current_estimating_tool")}>
              <option value="">Selecciona...</option>
              <option>Papel y lápiz</option>
              <option>Excel</option>
              <option>Otra app</option>
              <option>No uso nada específico</option>
            </SelectInput>
          </div>
        </div>
      )}

      {/* ─── PROPERTY MANAGER FIELDS ─── */}
      {form.role === "Property Manager" && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <p className="text-[#00D4FF] text-xs font-bold uppercase tracking-wider">Información del property manager</p>

          <div>
            <FieldLabel required>Nombre del negocio / empresa</FieldLabel>
            <TextInput value={form.business_name} onChange={set("business_name")} placeholder="Fairfield Property Management" />
            {err("business_name")}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Unidades que administras</FieldLabel>
              <SelectInput value={form.units_managed} onChange={set("units_managed")}>
                <option value="">Selecciona...</option>
                <option>1-10</option>
                <option>11-25</option>
                <option>26-50</option>
                <option>51-100</option>
                <option>Más de 100</option>
              </SelectInput>
              {err("units_managed")}
            </div>
            <div>
              <FieldLabel required>Años en el negocio</FieldLabel>
              <SelectInput value={form.years_in_business} onChange={set("years_in_business")}>
                <option value="">Selecciona...</option>
                {YEARS_OPTIONS.map((y) => <option key={y}>{y}</option>)}
              </SelectInput>
              {err("years_in_business")}
            </div>
          </div>

          <div>
            <FieldLabel required>Tipo de propiedades</FieldLabel>
            <MultiCheckbox
              values={form.property_types}
              onChange={(v) => set("property_types")(v)}
              options={["Single-family", "Multi-family", "Comercial", "Mixto"]}
            />
            {err("property_types")}
          </div>

          <div>
            <FieldLabel required>¿Tienes licencia de bienes raíces?</FieldLabel>
            <RadioGroup value={form.has_real_estate_license} onChange={set("has_real_estate_license")} options={["Sí", "No"]} />
            {err("has_real_estate_license")}
          </div>

          <div>
            <FieldLabel required>Software de PM que usas actualmente</FieldLabel>
            <SelectInput value={form.current_pm_software} onChange={set("current_pm_software")}>
              <option value="">Selecciona...</option>
              {["AppFolio", "Buildium", "Yardi", "Propertyware", "Rent Manager", "Excel/manual", "Ninguna", "Otra"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </SelectInput>
            {err("current_pm_software")}
          </div>
        </div>
      )}

      {/* ─── REALTOR FIELDS ─── */}
      {form.role === "Realtor" && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Información del realtor</p>

          <div>
            <FieldLabel required>Nombre del brokerage</FieldLabel>
            <TextInput value={form.brokerage_name} onChange={set("brokerage_name")} placeholder="Keller Williams Solano" />
            {err("brokerage_name")}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel required>Años en el negocio</FieldLabel>
              <SelectInput value={form.years_in_business} onChange={set("years_in_business")}>
                <option value="">Selecciona...</option>
                {YEARS_OPTIONS.map((y) => <option key={y}>{y}</option>)}
              </SelectInput>
              {err("years_in_business")}
            </div>
            <div>
              <FieldLabel>Número de licencia DRE (opcional)</FieldLabel>
              <TextInput value={form.dre_license_number} onChange={set("dre_license_number")} placeholder="01234567" />
            </div>
          </div>

          <div>
            <FieldLabel required>¿También administras propiedades?</FieldLabel>
            <RadioGroup value={form.also_property_manager} onChange={set("also_property_manager")} options={["Sí", "No"]} />
            {err("also_property_manager")}
          </div>

          <div>
            <FieldLabel required>Áreas de servicio</FieldLabel>
            <MultiCheckbox
              values={form.service_areas}
              onChange={(v) => set("service_areas")(v)}
              options={["Solano", "Contra Costa", "Napa", "Sacramento", "Marin", "Alameda", "Otras"]}
            />
            {err("service_areas")}
          </div>
        </div>
      )}

      {/* ─── OTRO FIELDS ─── */}
      {form.role === "Otro profesional de la industria" && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div>
            <FieldLabel required>Describe tu profesión (máx. 100 caracteres)</FieldLabel>
            <TextInput
              value={form.profession_description}
              onChange={set("profession_description")}
              placeholder="Ej: Inspector de propiedades independiente"
              maxLength={100}
            />
            <p className="text-white/30 text-xs mt-1 text-right">{form.profession_description.length}/100</p>
            {err("profession_description")}
          </div>
        </div>
      )}

      {/* ─── COMMON FINAL FIELDS ─── */}
      {form.role && (
        <div className="space-y-4 pt-2 border-t border-white/10">
          <div>
            <FieldLabel required>¿Cómo te enteraste del evento?</FieldLabel>
            <SelectInput value={form.referral_source} onChange={set("referral_source")}>
              <option value="">Selecciona...</option>
              <option>Invitación directa de Gelasio</option>
              <option>Un amigo/colega me invitó</option>
              <option>Home Depot</option>
              <option>Redes sociales</option>
              <option>Otro</option>
            </SelectInput>
            {err("referral_source")}
          </div>

          {form.referral_source === "Un amigo/colega me invitó" && (
            <div>
              <FieldLabel>Nombre de quien te invitó</FieldLabel>
              <TextInput value={form.referral_name} onChange={set("referral_name")} placeholder="Nombre de tu colega" />
            </div>
          )}

          <div>
            <FieldLabel required>Restricción alimentaria</FieldLabel>
            <SelectInput value={form.dietary_restriction} onChange={set("dietary_restriction")}>
              <option value="">Selecciona...</option>
              <option>Ninguna</option>
              <option>Vegetariano</option>
              <option>Vegano</option>
              <option>Sin gluten</option>
              <option>Otra</option>
            </SelectInput>
            {err("dietary_restriction")}
          </div>

          {form.dietary_restriction === "Otra" && (
            <div>
              <FieldLabel>¿Cuál restricción?</FieldLabel>
              <TextInput value={form.dietary_other} onChange={set("dietary_other")} placeholder="Describe tu restricción" />
            </div>
          )}

          {/* Consents */}
          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent_contact}
                onChange={(e) => set("consent_contact")(e.target.checked)}
                className="mt-0.5 accent-[#D4AF37]"
              />
              <span className="text-sm text-white/70">
                <span className="text-[#D4AF37]">*</span> Autorizo que Chyrris me contacte por teléfono y email para confirmar mi asistencia y enviarme información del evento.
              </span>
            </label>
            {err("consent_contact")}

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.consent_photo}
                onChange={(e) => set("consent_photo")(e.target.checked)}
                className="mt-0.5 accent-[#D4AF37]"
              />
              <span className="text-sm text-white/70">
                Autorizo el uso de fotos generales del evento para materiales de marketing de Chyrris. (Opcional)
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={registerMutation.isPending || !form.role}
        className="w-full py-4 rounded-xl text-base font-bold text-[#080C14] transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        style={{
          background: "linear-gradient(135deg, #D4AF37, #F5E6A3, #D4AF37)",
          boxShadow: "0 0 30px rgba(212,175,55,0.3)",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {registerMutation.isPending ? "Confirmando..." : "Confirmar mi Lugar — Es Gratis"}
      </button>

      <p className="text-center text-white/30 text-xs">
        Sin tarjeta de crédito · Sin compromisos · Cancelas cuando quieras
      </p>
    </form>
  );
}

export default function RegistrationModal({ open, onClose, inline = false }: RegistrationModalProps) {
  const [successCode, setSuccessCode] = useState("");

  const handleSuccess = (code: string) => {
    setSuccessCode(code);
  };

  if (inline) {
    return (
      <div className="max-w-2xl mx-auto bg-[#0D1220]/80 border border-white/10 rounded-2xl p-8">
        <FormContent onSuccess={handleSuccess} />
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0D1220] border border-white/10 text-white p-0">
        <div className="sticky top-0 z-10 bg-[#0D1220] border-b border-white/10 px-6 py-4">
          <DialogTitle
            className="text-xl font-bold text-white"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Confirmar mi Lugar
          </DialogTitle>
          <p className="text-white/50 text-sm mt-1">La Noche Chyrris · 29 de Mayo, 2026 · Solano County</p>
        </div>
        <div className="px-6 py-6">
          <FormContent onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
