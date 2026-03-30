"use client";

import { useState, useEffect, useRef } from "react";

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/api$/, "");
const SESSION_KEY = "pj_splash_shown";

function toUrl(path: string) {
  return path.startsWith("http") ? path : `${API_ORIGIN}${path}`;
}

export default function SplashLoader({
  children,
  videos,
}: {
  children: React.ReactNode;
  videos?: string[] | null;
}) {
  const [phase, setPhase] = useState<"loading" | "video" | "fadeout" | "done">("loading");
  const [videoIdx, setVideoIdx] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoList = videos?.length ? videos : [];

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) || !videoList.length) {
      setPhase("done");
    } else {
      setPhase("video");
    }
  }, []);

  // 3 saniye sonra "Geç" butonu göster
  useEffect(() => {
    if (phase !== "video") return;
    const t = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(t);
  }, [phase]);

  function handleEnd() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("fadeout");
    setTimeout(() => setPhase("done"), 800);
  }

  function handleVideoEnded() {
    // Sonraki video varsa oynat
    if (videoIdx < videoList.length - 1) {
      setVideoIdx(videoIdx + 1);
    } else {
      handleEnd();
    }
  }

  if (phase === "done" || phase === "loading") return <>{children}</>;

  return (
    <>
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center bg-navy"
        style={{
          opacity: phase === "fadeout" ? 0 : 1,
          transition: "opacity 800ms ease-out",
        }}
      >
        <video
          ref={videoRef}
          key={videoIdx}
          src={toUrl(videoList[videoIdx])}
          autoPlay
          muted
          playsInline
          onEnded={handleVideoEnded}
          className="h-full w-full object-contain max-h-screen max-w-screen"
        />

        {/* Geç butonu */}
        <button
          onClick={handleEnd}
          className="absolute bottom-8 right-8 px-4 py-2 text-sm text-white/60 hover:text-white border border-white/20 hover:border-white/40 rounded-full backdrop-blur-sm transition-all"
          style={{
            opacity: showSkip ? 1 : 0,
            transform: showSkip ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 500ms, transform 500ms",
            pointerEvents: showSkip ? "auto" : "none",
          }}
        >
          Geç →
        </button>
      </div>
      <div className="invisible">{children}</div>
    </>
  );
}
