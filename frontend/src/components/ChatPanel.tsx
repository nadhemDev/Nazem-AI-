"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Send, Bot, User, Zap, AlertCircle, Copy, Check, RefreshCw } from "lucide-react";
import ModelSelector from "./ModelSelector";

export default function ChatPanel() {
  const { messages, addMessage, activeModel } = useStore();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCopy = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
    setInput(ta.value);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    addMessage({ id: Date.now().toString(), sender: "user", content: userMessage });
    setIsLoading(true);

    const nazemId = (Date.now() + 1).toString();

    try {
      const response = await fetch("http://localhost:8000/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, model: activeModel }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Add empty message immediately — will fill in token by token
      addMessage({ id: nazemId, sender: "nazem", content: "" });
      setIsLoading(false);

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.token && !parsed.done) {
              // Append token to existing message
              useStore.setState((state) => ({
                messages: state.messages.map((m) =>
                  m.id === nazemId
                    ? { ...m, content: m.content + parsed.token }
                    : m
                ),
              }));
            }
          } catch {
            // ignore malformed chunks
          }
        }
      }
    } catch {
      addMessage({
        id: (Date.now() + 2).toString(),
        sender: "system",
        content: "Impossible de joindre le serveur local. Vérifiez que le backend tourne sur le port 8000.",
      });
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl" />
      </div>

      {/* Top bar */}
      <div className="relative z-50 h-14 border-b border-white/5 flex items-center px-5 gap-4 bg-[#090d16]/80 backdrop-blur-md">
        <ModelSelector />
        <div className="flex-1" />
        {/* Ollama status */}
        <div className="flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full
          border border-emerald-500/20 bg-emerald-500/5 text-emerald-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Ollama Online
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 relative z-10
        scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">

        {messages.length === 0 && (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-60">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Zap size={28} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-300">Prêt à coder</h2>
              <p className="text-slate-500 text-sm mt-1">Posez une question ou demandez à Nazem de modifier votre code.</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 group ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg
              ${msg.sender === "user"
                ? "bg-nazem-teal"
                : msg.sender === "system"
                ? "bg-rose-500"
                : "bg-nazem-pink"
              }`}>
              {msg.sender === "user" ? (
                <User size={16} className="text-white" />
              ) : msg.sender === "system" ? (
                <AlertCircle size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col max-w-[75%] ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <span className="text-[11px] font-semibold text-slate-500 mb-1.5 px-1">
                {msg.sender === "user" ? "Vous" : msg.sender === "system" ? "Système" : "Nazem"}
              </span>
              <div className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg
                ${msg.sender === "user"
                  ? "bg-nazem-teal text-white rounded-tr-sm"
                  : msg.sender === "system"
                  ? "bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 rounded-tl-sm"
                  : "bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/5 rounded-tl-sm backdrop-blur-sm"
                }`}>
                <pre className="whitespace-pre-wrap font-sans break-words">{msg.content}</pre>

                {/* Copy button for nazem messages */}
                {msg.sender === "nazem" && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
                      text-slate-500 hover:text-slate-300 p-1 rounded-md hover:bg-white/5"
                  >
                    {copiedId === msg.id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-semibold text-slate-500 mb-1.5 px-1">Nazem</span>
              <div className="bg-slate-800/70 border border-white/5 rounded-2xl rounded-tl-sm px-5 py-4">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:0ms]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:150ms]" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="relative z-10 px-4 py-4 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#090d16] dark:via-[#090d16]/95">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto relative bg-slate-900/80 backdrop-blur-md border border-white/8
            rounded-2xl overflow-hidden shadow-2xl shadow-black/40
            focus-within:border-emerald-500/30 focus-within:shadow-emerald-500/5 transition-all duration-300"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={autoResize}
            onKeyDown={handleKeyDown}
            placeholder="Posez une question ou demandez à Nazem de modifier du code… (Shift+Entrée pour saut de ligne)"
            rows={1}
            disabled={isLoading}
            className="w-full bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-500 px-5 pt-4 pb-2
              focus:outline-none resize-none text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between px-4 pb-3 pt-1">
            <span className="text-[10px] text-slate-600">Shift+Entrée pour un saut de ligne</span>
            <div className="flex gap-2 items-center">
              {isLoading && (
                <RefreshCw size={14} className="text-slate-500 animate-spin" />
              )}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                  bg-gradient-to-r from-nazem-pink to-nazem-teal hover:opacity-90
                  text-white disabled:opacity-30 disabled:cursor-not-allowed
                  shadow-lg shadow-emerald-900/30 hover:shadow-emerald-500/20 hover:scale-105 active:scale-95"
              >
                <Send size={14} />
                <span>Envoyer</span>
              </button>
            </div>
          </div>
        </form>
        <p className="text-center text-[10px] text-slate-700 mt-2">
          Nazem peut faire des erreurs. Vérifiez les modifications importantes.
        </p>
      </div>
    </div>
  );
}
