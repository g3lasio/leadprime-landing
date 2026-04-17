import { useState, useEffect } from "react";
import { Link } from "wouter";

interface EventoNavbarProps {
  onRegisterClick: () => void;
}

export default function EventoNavbar({ onRegisterClick }: EventoNavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#080C14]/95 backdrop-blur-md border-b border-[#D4AF37]/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="font-bold text-lg text-white"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Chyrris
            </span>
            <span className="text-[#D4AF37] text-xs">×</span>
            <span className="text-white/60 text-xs">La Noche</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {[
              { label: "El Problema", id: "problema" },
              { label: "El Programa", id: "programa" },
              { label: "Beneficios", id: "beneficios" },
              { label: "FAQ", id: "faq" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="text-sm font-medium text-white/60 hover:text-[#D4AF37] transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <button
            onClick={onRegisterClick}
            className="px-5 py-2 rounded-lg text-sm font-bold text-[#080C14] transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #F5E6A3)",
              boxShadow: "0 0 15px rgba(212,175,55,0.3)",
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Confirmar mi Lugar
          </button>
        </div>
      </div>
    </nav>
  );
}
