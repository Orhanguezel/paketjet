"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "pj_short_intro_seen";

/** A brief brand greeting, never a prerequisite for using the page. */
export default function SplashLoader({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();
  const initialPath = useRef(pathname);
  const started = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (initialPath.current !== "/" || motion.matches) return;
    try {
      if (!started.current && sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Storage restrictions must never prevent the page from opening.
      return;
    }
    started.current = true;
    setVisible(true);
    const dismiss = () => setVisible(false);
    const timer = window.setTimeout(dismiss, 1200);
    window.addEventListener("pointerdown", dismiss, { once: true, passive: true });
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    motion.addEventListener("change", dismiss);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", dismiss);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("wheel", dismiss);
      motion.removeEventListener("change", dismiss);
    };
  }, []);

  if (!visible || pathname !== "/") return null;
  return (
    <div className="brand-intro" aria-hidden="true">
      <div className="brand-intro-content">
        {logoUrl && <Image src={logoUrl} alt="" width={80} height={80} unoptimized className="brand-intro-logo" />}
        <span className="brand-intro-name">Paket<span>Jet</span></span>
        <svg className="brand-intro-route" viewBox="0 0 240 40" fill="none">
          <path d="M12 30C65 30 65 10 120 10S180 30 228 10" pathLength="1" />
          <circle cx="12" cy="30" r="4" /><circle cx="228" cy="10" r="4" />
        </svg>
        <span className="brand-intro-caption">Yolları bağlantıya dönüştür.</span>
      </div>
    </div>
  );
}
