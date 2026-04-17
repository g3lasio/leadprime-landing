export default function EventoFooter() {
  return (
    <footer className="bg-[#050810] border-t border-white/5 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Logo Chyrris */}
        <div className="text-center mb-8">
          <h3
            className="text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Chyrris
          </h3>
          <p className="text-white/40 text-sm">
            Chyrris es la compañía madre de LeadPrime y Owl Fenc
          </p>
        </div>

        {/* Sub-brands */}
        <div className="flex justify-center gap-8 mb-10">
          <a
            href="https://leadprime.chyrris.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-[#00D4FF] text-sm font-medium transition-colors"
          >
            LeadPrime ↗
          </a>
          <a
            href="https://owlfenc.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-[#D4AF37] text-sm font-medium transition-colors"
          >
            Owl Fenc ↗
          </a>
        </div>

        {/* Contact */}
        <div className="text-center mb-8">
          <p className="text-white/40 text-sm">
            ¿Preguntas?{" "}
            <a href="mailto:info@chyrris.com" className="text-[#D4AF37] hover:text-[#F5E6A3] transition-colors">
              info@chyrris.com
            </a>
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/25">
            <p>© 2026 Chyrris · Owl Fenc LLC · Todos los derechos reservados</p>
            <div className="flex gap-4">
              <a href="https://chyrris.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">
                Privacy Policy
              </a>
              <a href="https://chyrris.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white/50 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          <p className="text-center text-white/15 text-xs mt-4">Hecho con orgullo en California</p>
        </div>
      </div>
    </footer>
  );
}
