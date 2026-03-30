"use client";

/**
 * Türkiye haritası silüeti + animasyonlu rota pinleri
 * "Nasıl Çalışır" → Adım 1: Rota Ara kartı için
 */
export default function RouteMapAnimation() {
  return (
    <div className="relative h-full w-full bg-gradient-to-br from-navy/5 to-brand/5 flex items-center justify-center overflow-hidden">
      {/* Türkiye harita silüeti */}
      <svg viewBox="0 0 800 400" className="w-[90%] h-auto opacity-15" fill="currentColor" aria-hidden>
        <path
          className="text-navy"
          d="M180 200c10-30 40-60 80-80s90-20 130-30c30-8 60-5 90 5s50 30 70 50c15 15 35 25 55 20s40-20 55-35c10-10 25-15 38-10 20 8 15 35 5 50s-25 30-40 40c-20 13-45 18-65 25-30 10-55 25-85 30s-65 3-95-5c-25-7-50-18-75-25s-55-10-80-5c-20 4-38 15-55 25s-35 18-55 15c-15-2-28-15-30-30s5-30 15-40z"
        />
      </svg>

      {/* Pin: İstanbul */}
      <div className="absolute" style={{ left: "58%", top: "32%" }}>
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-brand animate-ping absolute" />
          <div className="w-3 h-3 rounded-full bg-brand relative z-10" />
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-navy whitespace-nowrap">
            İstanbul
          </span>
        </div>
      </div>

      {/* Pin: Ankara */}
      <div className="absolute" style={{ left: "48%", top: "40%" }}>
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-brand animate-ping absolute [animation-delay:0.5s]" />
          <div className="w-3 h-3 rounded-full bg-brand relative z-10" />
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-navy whitespace-nowrap">
            Ankara
          </span>
        </div>
      </div>

      {/* Pin: İzmir */}
      <div className="absolute" style={{ left: "33%", top: "50%" }}>
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-brand animate-ping absolute [animation-delay:1s]" />
          <div className="w-3 h-3 rounded-full bg-brand relative z-10" />
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-navy whitespace-nowrap">
            İzmir
          </span>
        </div>
      </div>

      {/* Pin: Antalya */}
      <div className="absolute" style={{ left: "42%", top: "62%" }}>
        <div className="relative">
          <div className="w-3 h-3 rounded-full bg-brand animate-ping absolute [animation-delay:1.5s]" />
          <div className="w-3 h-3 rounded-full bg-brand relative z-10" />
          <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-navy whitespace-nowrap">
            Antalya
          </span>
        </div>
      </div>

      {/* Animated route line: İstanbul → Ankara */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <line
          x1="58" y1="34" x2="48" y2="42"
          stroke="currentColor"
          className="text-brand"
          strokeWidth="0.3"
          strokeDasharray="2 2"
        >
          <animate attributeName="stroke-dashoffset" from="4" to="0" dur="1.5s" repeatCount="indefinite" />
        </line>
        <line
          x1="48" y1="42" x2="33" y2="52"
          stroke="currentColor"
          className="text-brand/60"
          strokeWidth="0.3"
          strokeDasharray="2 2"
        >
          <animate attributeName="stroke-dashoffset" from="4" to="0" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
        </line>
        <line
          x1="48" y1="42" x2="42" y2="64"
          stroke="currentColor"
          className="text-brand/60"
          strokeWidth="0.3"
          strokeDasharray="2 2"
        >
          <animate attributeName="stroke-dashoffset" from="4" to="0" dur="1.5s" repeatCount="indefinite" begin="1s" />
        </line>
      </svg>

      {/* Taşınan paket ikonu — rota üzerinde hareket */}
      <div className="absolute animate-bounce [animation-duration:2s]" style={{ left: "52%", top: "36%" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-brand">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      </div>
    </div>
  );
}
