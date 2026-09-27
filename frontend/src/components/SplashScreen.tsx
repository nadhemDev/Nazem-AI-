"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const NazemLogo3D = dynamic(() => import("./NazemLogo3D"), { ssr: false });

interface SplashScreenProps {
  onEnter: () => void;
}

export default function SplashScreen({ onEnter }: SplashScreenProps) {
  const [phase, setPhase] = useState<"logo" | "tagline" | "cta">("logo");
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("tagline"), 2000);
    const t2 = setTimeout(() => setPhase("cta"), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onEnter, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center
        bg-[#090d16] transition-all duration-700
        ${leaving ? "opacity-0 scale-105" : "opacity-100 scale-100"}`}
    >
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-[600px] h-[600px] rounded-full
          bg-emerald-500/5 blur-3xl animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/3 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-teal-500/3 blur-3xl" />
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(16,185,129,1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* 3D Logo */}
      <div className="w-[500px] h-[220px] relative">
        <NazemLogo3D />
      </div>

      {/* Tagline */}
      <div
        className={`mt-2 text-center transition-all duration-700
          ${phase !== "logo" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        <p className="text-slate-400 text-base font-light tracking-widest uppercase">
          Your&nbsp; <span className="text-emerald-400 font-semibold">Local</span>
          &nbsp;AI Coding Agent
        </p>
        <div className="flex items-center justify-center gap-3 mt-3">
          <Chip label="Ollama" />
          <Chip label="LangChain" />
          <Chip label="FastAPI" />
          <Chip label="Next.js" />
        </div>
      </div>

      {/* CTA Button */}
      <div
        className={`mt-10 transition-all duration-700
          ${phase === "cta" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        <button
          onClick={handleEnter}
          className="group relative px-10 py-4 rounded-2xl font-semibold text-base text-white
            bg-gradient-to-r from-emerald-600 to-teal-600
            hover:from-emerald-500 hover:to-teal-500
            shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40
            border border-emerald-500/30 hover:border-emerald-400/60
            transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-3">
            <span>Commencer à coder</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
        <p className="text-center text-slate-600 text-xs mt-3">Propulsé par vos modèles locaux · 100% privé</p>
      </div>

      {/* Bottom version tag */}
      <div className="absolute bottom-6 text-slate-700 text-xs font-mono">
        NAZEM.AI v1.0 — Phase 1
      </div>
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-medium
      bg-emerald-500/8 text-emerald-400/70 border border-emerald-500/15">
      {label}
    </span>
  );
}
