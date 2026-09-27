"use client";

import { useStore } from "@/store/useStore";
import { Cpu, ChevronDown, Zap, Brain, Code } from "lucide-react";

const MODELS = [
  // ── Fast & installed ──────────────────────────────────────────────
  {
    value: "llama3.2:3b",
    label: "Llama 3.2 · 3B",
    sublabel: "Best overall · Fast",
    color: "text-emerald-400",
    icon: <Zap size={12} className="text-emerald-400" />,
    badge: "BEST",
    badgeColor: "bg-emerald-500/20 text-emerald-300",
  },
  {
    value: "qwen2.5-coder:1.5b",
    label: "Qwen 2.5 Coder · 1.5B",
    sublabel: "Code specialist · Very fast",
    color: "text-sky-400",
    icon: <Code size={12} className="text-sky-400" />,
    badge: "CODE",
    badgeColor: "bg-sky-500/20 text-sky-300",
  },
  // ── Coming soon (install next) ────────────────────────────────────
  {
    value: "phi4-mini:3.8b",
    label: "Phi-4 Mini · 3.8B",
    sublabel: "Microsoft · Smart & compact",
    color: "text-violet-400",
    icon: <Brain size={12} className="text-violet-400" />,
    badge: "SMART",
    badgeColor: "bg-violet-500/20 text-violet-300",
  },
  {
    value: "gemma3:4b",
    label: "Gemma 3 · 4B",
    sublabel: "Google · Balanced",
    color: "text-amber-400",
    icon: <Zap size={12} className="text-amber-400" />,
    badge: "NEW",
    badgeColor: "bg-amber-500/20 text-amber-300",
  },
  {
    value: "mistral:7b",
    label: "Mistral · 7B",
    sublabel: "Powerful · Best quality",
    color: "text-rose-400",
    icon: <Brain size={12} className="text-rose-400" />,
    badge: "PRO",
    badgeColor: "bg-rose-500/20 text-rose-300",
  },
];

export default function ModelSelector() {
  const { activeModel, setActiveModel } = useStore();
  const current = MODELS.find((m) => m.value === activeModel) || MODELS[0];

  return (
    <div className="relative group">
      <div className="flex items-center gap-2 bg-slate-800/60 hover:bg-slate-800
        border border-white/8 hover:border-emerald-500/30
        rounded-lg pl-3 pr-2 py-1.5 cursor-pointer transition-all duration-200">
        <Cpu size={14} className="text-emerald-500 flex-shrink-0" />
        <span className={`text-sm font-medium ${current.color}`}>{current.label}</span>
        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${current.badgeColor}`}>
          {current.badge}
        </span>
        <ChevronDown size={12} className="text-slate-500 ml-1" />
      </div>

      {/* Dropdown */}
      <div className="absolute top-full left-0 mt-1.5 w-72 py-1.5 rounded-xl
        bg-slate-900 border border-white/8 shadow-2xl shadow-black/50
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">

        <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Modèles disponibles
        </div>

        {MODELS.map((m) => (
          <button
            key={m.value}
            onClick={() => setActiveModel(m.value)}
            className={`w-full text-left px-3 py-2.5 transition-colors hover:bg-white/5
              ${m.value === activeModel ? "bg-emerald-500/5" : ""}`}
          >
            <div className="flex items-center gap-2.5">
              {m.value === activeModel && (
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              )}
              {m.value !== activeModel && <div className="w-1.5 h-1.5 flex-shrink-0" />}
              {m.icon}
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${m.color}`}>{m.label}</div>
                <div className="text-[11px] text-slate-500">{m.sublabel}</div>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ${m.badgeColor}`}>
                {m.badge}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

