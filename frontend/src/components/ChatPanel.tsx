"use client";

import { useState, useRef, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { Send, Bot, User, Zap, AlertCircle, Copy, Check, RefreshCw, Terminal } from "lucide-react";
import ModelSelector from "./ModelSelector";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function CopyCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-emerald-400 transition-colors"
    >
      {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
      {copied ? "Copié !" : "Copier"}
    </button>
  );
}

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
      const response = await fetch("http://localhost:8001/chat/message", {
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
        content: "Impossible de joindre le serveur local. Vérifiez que le backend tourne sur le port 8001.",
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
          <div key={msg.id} className={`flex gap-3 group ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center shadow-lg
              ${msg.sender === "user"
                ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                : msg.sender === "system"
                ? "bg-gradient-to-br from-rose-600 to-red-800"
                : "bg-gradient-to-br from-emerald-500 to-teal-600"
              }`}>
              {msg.sender === "user" ? (
                <User size={15} className="text-white" />
              ) : msg.sender === "system" ? (
                <AlertCircle size={15} className="text-white" />
              ) : (
                <Bot size={15} className="text-white" />
              )}
            </div>

            {/* Bubble */}
            <div className={`flex flex-col ${msg.sender === "user" ? "items-end max-w-[70%]" : "items-start max-w-[82%]"}`}>
              <span className="text-[10px] font-semibold text-slate-500 mb-1.5 px-1 uppercase tracking-wider">
                {msg.sender === "user" ? "Vous" : msg.sender === "system" ? "Système" : "Nazem"}
              </span>

              <div className={`relative text-sm leading-relaxed shadow-lg
                ${msg.sender === "user"
                  ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl rounded-tr-sm px-4 py-3"
                  : msg.sender === "system"
                  ? "bg-rose-950/60 text-rose-300 border border-rose-800/50 rounded-2xl rounded-tl-sm px-4 py-3"
                  : "bg-slate-800/80 text-slate-100 border border-white/8 rounded-2xl rounded-tl-sm backdrop-blur-sm overflow-hidden"
                }`}>

                {msg.sender === "user" || msg.sender === "system" ? (
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                ) : (
                  // Beautiful markdown rendering for Nazem messages
                  <div className="markdown-body px-4 py-3">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeHighlight]}
                      components={{
                        // Code blocks
                        code({ node, className, children, ...props }: React.ComponentProps<'code'> & { node?: unknown; inline?: boolean }) {
                          const match = /language-(\w+)/.exec(className || "");
                          const isBlock = !!(match || (String(children).includes('\n')));
                          const lang = match?.[1] ?? "";
                          if (isBlock) {
                            return (
                              <div className="my-3 rounded-xl overflow-hidden border border-white/10 bg-[#0d1117]">
                                {lang && (
                                  <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-white/8">
                                    <div className="flex items-center gap-2">
                                      <Terminal size={12} className="text-slate-500" />
                                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{lang}</span>
                                    </div>
                                    <CopyCodeButton code={String(children)} />
                                  </div>
                                )}
                                <code className={`block p-4 text-[13px] font-mono overflow-x-auto ${className || ""}`} {...props}>
                                  {children}
                                </code>
                              </div>
                            );
                          }
                          return (
                            <code className="px-1.5 py-0.5 rounded-md bg-slate-700/80 text-emerald-300 font-mono text-[13px]" {...props}>
                              {children}
                            </code>
                          );
                        },
                        // Headings
                        h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-4 mb-2 pb-1 border-b border-white/10">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-lg font-semibold text-white mt-3 mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-base font-semibold text-slate-200 mt-3 mb-1">{children}</h3>,
                        // Paragraphs
                        p: ({ children }) => <p className="mb-3 last:mb-0 text-slate-200 leading-relaxed">{children}</p>,
                        // Lists
                        ul: ({ children }) => <ul className="mb-3 pl-5 space-y-1 list-disc marker:text-emerald-500">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-3 pl-5 space-y-1 list-decimal marker:text-emerald-500">{children}</ol>,
                        li: ({ children }) => <li className="text-slate-200">{children}</li>,
                        // Blockquote
                        blockquote: ({ children }) => (
                          <blockquote className="my-3 pl-4 border-l-2 border-emerald-500 bg-emerald-500/5 py-2 pr-3 rounded-r-lg text-slate-300 italic">
                            {children}
                          </blockquote>
                        ),
                        // Table
                        table: ({ children }) => (
                          <div className="my-3 overflow-x-auto rounded-lg border border-white/10">
                            <table className="w-full text-sm">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => <th className="px-3 py-2 bg-slate-700/60 text-slate-200 font-semibold text-left border-b border-white/10">{children}</th>,
                        td: ({ children }) => <td className="px-3 py-2 text-slate-300 border-b border-white/5">{children}</td>,
                        // Horizontal rule
                        hr: () => <hr className="my-4 border-white/10" />,
                        // Strong / em
                        strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
                        em: ({ children }) => <em className="italic text-slate-300">{children}</em>,
                        // Links
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Copy full message button */}
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
