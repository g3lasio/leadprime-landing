import { useEffect, useRef, useState } from "react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663306487441/bdcwZfK93hqCYNkzHv426f/leadprime-hero-bg-Ki24rhdyt34NdqbVbGeeCk.webp";

const stats = [
  { value: "10+", label: "Industry Verticals" },
  { value: "AI", label: "Powered Automation" },
  { value: "$0", label: "To Get Started" },
  { value: "5+", label: "Integrations" },
];

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(target / 40);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(start);
        }, 30);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050B18]/70 via-[#050B18]/60 to-[#050B18]" />

      {/* Animated grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-[#00D4FF] animate-pulse" />
            <span
              className="text-sm font-semibold text-[#00D4FF]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Start free — Pay only for what you use
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl lg:text-7xl xl:text-8xl font-black text-white leading-[1.05] mb-6 animate-slide-up"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            The CRM Built
            <br />
            <span className="lp-text-gradient-cyan">For Your Industry.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg lg:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif", animationDelay: "0.2s" }}
          >
            LeadPrime connects{" "}
            <span className="text-[#00D4FF] font-semibold">Contractors</span>,{" "}
            <span className="text-[#F59E0B] font-semibold">Property Managers</span>,{" "}
            <span className="text-[#10B981] font-semibold">Investors</span>,{" "}
            <span className="text-white font-semibold">Realtors</span>,{" "}
            <span className="text-purple-400 font-semibold">Lenders</span> &{" "}
            <span className="text-pink-400 font-semibold">Wholesalers</span>{" "}
            in one AI-powered ecosystem. Automate leads, close deals, and grow your business.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <a
              href="https://lead-prime.chyrris.com"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn-primary px-8 py-4 rounded-xl text-base font-bold text-center inline-flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Get Started Free
            </a>
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 rounded-xl text-base font-bold border border-white/20 text-white hover:border-[#00D4FF]/50 hover:text-[#00D4FF] transition-all duration-200 inline-flex items-center justify-center gap-2"
            >
              See All Features
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="lp-card rounded-xl p-4 text-center">
                <div
                  className="text-3xl font-black lp-text-gradient-cyan mb-1"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs text-white/50 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
}
