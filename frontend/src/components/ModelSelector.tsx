"use client";

import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { Cpu, ChevronDown, Zap, Brain, Code, WifiOff, Loader2 } from "lucide-react";

// ── Metadata catalogue (enriches raw Ollama model names) ────────────────────
const MODEL_META: Record<string, { label: string; sublabel: string; color: string; badge: string; badgeColor: string; icon: React.ReactNode }> = {
  "llama3.2:3b":         { label: "Llama 3.2 · 3B",         sublabel: "Meilleur général · Rapide",        color: "text-emerald-400", badge: "BEST",  badgeColor: "bg-emerald-500/20 text-emerald-300", icon: <Zap  size={12} className="text-emerald-400" /> },
  "llama3.2:1b":         { label: "Llama 3.2 · 1B",         sublabel: "Ultra rapide · Léger",             color: "text-emerald-300", badge: "FAST",  badgeColor: "bg-emerald-500/20 text-emerald-200", icon: <Zap  size={12} className="text-emerald-300" /> },
  "llama3.1:8b":         { label: "Llama 3.1 · 8B",         sublabel: "Puissant · Meilleure qualité",     color: "text-emerald-500", badge: "PRO",   badgeColor: "bg-emerald-600/20 text-emerald-400", icon: <Brain size={12} className="text-emerald-500" /> },
  "qwen2.5-coder:1.5b":  { label: "Qwen 2.5 Coder · 1.5B",  sublabel: "Spécialiste code · Très rapide",   color: "text-sky-400",     badge: "CODE",  badgeColor: "bg-sky-500/20 text-sky-300",         icon: <Code  size={12} className="text-sky-400" /> },
  "qwen2.5-coder:7b":    { label: "Qwen 2.5 Coder · 7B",    sublabel: "Expert code · Précis",             color: "text-sky-500",     badge: "CODE",  badgeColor: "bg-sky-600/20 text-sky-400",         icon: <Code  size={12} className="text-sky-500" /> },
  "qwen2.5:3b":          { label: "Qwen 2.5 · 3B",          sublabel: "Polyvalent · Rapide",              color: "text-cyan-400",    badge: "FAST",  badgeColor: "bg-cyan-500/20 text-cyan-300",       icon: <Zap  size={12} className="text-cyan-400" /> },
  "phi4-mini:3.8b":      { label: "Phi-4 Mini · 3.8B",      sublabel: "Microsoft · Intelligent & compact",color: "text-violet-400",  badge: "SMART", badgeColor: "bg-violet-500/20 text-violet-300",  icon: <Brain size={12} className="text-violet-400" /> },
  "gemma3:4b":           { label: "Gemma 3 · 4B",           sublabel: "Google · Équilibré",               color: "text-amber-400",   badge: "NEW",   badgeColor: "bg-amber-500/20 text-amber-300",    icon: <Zap  size={12} className="text-amber-400" /> },
  "gemma3:1b":           { label: "Gemma 3 · 1B",           sublabel: "Google · Ultra léger",             color: "text-amber-300",   badge: "FAST",  badgeColor: "bg-amber-500/20 text-amber-200",    icon: <Zap  size={12} className="text-amber-300" /> },
  "mistral:7b":          { label: "Mistral · 7B",           sublabel: "Puissant · Meilleure qualité",     color: "text-rose-400",    badge: "PRO",   badgeColor: "bg-rose-500/20 text-rose-300",      icon: <Brain size={12} className="text-rose-400" /> },
  "deepseek-r1:1.5b":    { label: "DeepSeek R1 · 1.5B",     sublabel: "Raisonnement · Compact",           color: "text-indigo-400",  badge: "R1",    badgeColor: "bg-indigo-500/20 text-indigo-300",  icon: <Brain size={12} className="text-indigo-400" /> },
  "deepseek-r1:7b":      { label: "DeepSeek R1 · 7B",       sublabel: "Raisonnement · Avancé",            color: "text-indigo-500",  badge: "R1",    badgeColor: "bg-indigo-600/20 text-indigo-400",  icon: <Brain size={12} className="text-indigo-500" /> },
};

function getModelMeta(name: string) {
  if (MODEL_META[name]) return MODEL_META[name];
  // Fallback for unknown models
  return {
    label: name,
    sublabel: "Modèle local Ollama",
    color: "text-slate-300",
    badge: "LOCAL",
    badgeColor: "bg-slate-500/20 text-slate-400",
    icon: <Cpu size={12} className="text-slate-400" />,
  };
}

export default function ModelSelector() {
  const { activeModel, setActiveModel, installedModels, ollamaOnline, modelsLoading: loading } = useStore();

  const current = getModelMeta(activeModel);

  return (
    <div className="relative group">
      {/* Trigger button */}
      <div className="flex items-center gap-2 bg-slate-800/60 hover:bg-slate-800
        border border-white/8 hover:border-emerald-500/30
        rounded-lg pl-3 pr-2 py-1.5 cursor-pointer transition-all duration-200">
        {loading ? (
          <Loader2 size={14} className="text-slate-500 animate-spin" />
        ) : ollamaOnline === false ? (
          <WifiOff size={14} className="text-rose-500 flex-shrink-0" />
        ) : (
          <Cpu size={14} className="text-emerald-500 flex-shrink-0" />
        )}
        <span className={`text-sm font-medium ${current.color}`}>
          {loading ? "Chargement..." : current.label}
        </span>
        {!loading && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${current.badgeColor}`}>
            {current.badge}
          </span>
        )}
        <ChevronDown size={12} className="text-slate-500 ml-1" />
      </div>

      {/* Dropdown */}
      <div className="absolute top-full left-0 mt-1.5 w-72 py-1.5 rounded-xl
        bg-slate-900 border border-white/8 shadow-2xl shadow-black/50
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        translate-y-1 group-hover:translate-y-0 transition-all duration-200 z-50">

        {ollamaOnline === false ? (
          <div className="px-4 py-3 flex items-center gap-2 text-rose-400 text-sm">
            <WifiOff size={14} />
            <div>
              <div className="font-semibold">Ollama hors ligne</div>
              <div className="text-[11px] text-rose-500/70">Démarrez Ollama pour utiliser les modèles</div>
            </div>
          </div>
        ) : loading ? (
          <div className="px-4 py-3 flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 size={14} className="animate-spin" />
            Chargement des modèles...
          </div>
        ) : installedModels.length === 0 ? (
          <div className="px-4 py-3 text-slate-500 text-sm">
            Aucun modèle installé.<br />
            <span className="text-xs">Exécutez : <code className="text-emerald-400">ollama pull llama3.2:3b</code></span>
          </div>
        ) : (
          <>
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Modèles installés ({installedModels.length})
            </div>
            {installedModels.map((name) => {
              const meta = getModelMeta(name);
              return (
                <button
                  key={name}
                  onClick={() => setActiveModel(name)}
                  className={`w-full text-left px-3 py-2.5 transition-colors hover:bg-white/5
                    ${name === activeModel ? "bg-emerald-500/5" : ""}`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${name === activeModel ? "bg-emerald-500" : "bg-transparent"}`} />
                    {meta.icon}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${meta.color}`}>{meta.label}</div>
                      <div className="text-[11px] text-slate-500">{meta.sublabel}</div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0 ${meta.badgeColor}`}>
                      {meta.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}


