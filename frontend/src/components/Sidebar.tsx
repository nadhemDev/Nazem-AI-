"use client";

import { useStore } from "@/store/useStore";
import {
  MessageSquare, Plus, Settings, ChevronLeft, ChevronRight,
  LogIn, LogOut, Sparkles, Folder, Clock, Star, Trash2, MoreHorizontal, Sun, Moon
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";

const NazemLogo3D = dynamic(() => import("./NazemLogo3D"), { ssr: false });

const MOCK_SESSIONS = [
  { id: "1", title: "Initialisation projet", category: "today", starred: true },
  { id: "2", title: "Endpoint FastAPI chat", category: "today", starred: false },
  { id: "3", title: "Sidebar Dark Mode", category: "yesterday", starred: false },
  { id: "4", title: "Connexion Ollama local", category: "week", starred: false },
];

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, theme, toggleTheme } = useStore();
  const { data: session } = useSession();

  const today = MOCK_SESSIONS.filter((s) => s.category === "today");
  const yesterday = MOCK_SESSIONS.filter((s) => s.category === "yesterday");
  const week = MOCK_SESSIONS.filter((s) => s.category === "week");

  return (
    <>
      {/* Sidebar */}
      <div
        className={`flex flex-col border-r border-slate-200 dark:border-white/5 transition-all duration-300 h-full relative z-10
          ${isSidebarOpen ? "w-72" : "w-0"} overflow-hidden
          bg-white dark:bg-gradient-to-b dark:from-[#080c14] dark:via-[#090d16] dark:to-[#0a1020]`}
      >
        {/* Logo 3D */}
        <div className="h-40 min-w-[18rem] relative flex-shrink-0 flex justify-center items-center">
          <img src="/logo.png" alt="Nazem AI" className="w-full h-full object-contain p-6 drop-shadow-lg" />
          {/* Glowing underline */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
        </div>

        {/* New Chat Button */}
        <div className="px-4 py-3 min-w-[18rem]">
          <button className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl
            bg-gradient-to-r from-emerald-600/80 to-teal-600/80
            hover:from-emerald-500 hover:to-teal-500
            border border-emerald-500/30 hover:border-emerald-400/50
            text-white font-semibold shadow-lg shadow-emerald-900/30
            transition-all duration-200 hover:shadow-emerald-500/20 hover:scale-[1.02]">
            <div className="p-1 rounded-lg bg-white/10">
              <Plus size={16} />
            </div>
            <span>Nouveau Projet</span>
            <Sparkles size={14} className="ml-auto opacity-50 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>

        {/* Conversations list */}
        <div className="flex-1 overflow-y-auto px-3 min-w-[18rem] pb-2 space-y-4
          scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

          {/* Today */}
          <div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 px-2 pt-2">
              <Clock size={10} />
              <span>Aujourd'hui</span>
            </div>
            {today.map((s) => (
              <ConversationItem key={s.id} session={s} />
            ))}
          </div>

          {/* Yesterday */}
          <div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 px-2">
              <Clock size={10} />
              <span>Hier</span>
            </div>
            {yesterday.map((s) => (
              <ConversationItem key={s.id} session={s} />
            ))}
          </div>

          {/* Last 7 days */}
          <div>
            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 px-2">
              <Clock size={10} />
              <span>7 derniers jours</span>
            </div>
            {week.map((s) => (
              <ConversationItem key={s.id} session={s} />
            ))}
          </div>
        </div>

        {/* Bottom: settings + user */}
        <div className="min-w-[18rem] border-t border-slate-200 dark:border-white/5">
          {/* Settings row */}
          <div className="px-4 py-2 flex items-center justify-between">
            <button className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-xs transition-colors py-1">
              <Settings size={14} />
              <span>Paramètres</span>
            </button>
            <button onClick={toggleTheme} className="flex items-center gap-2 text-slate-500 hover:text-nazem-pink dark:hover:text-nazem-teal text-xs transition-colors py-1">
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />} 
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          {/* User block */}
          <div className="p-3">
            {session ? (
              <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group">
                {session.user?.image ? (
                  <img src={session.user.image} alt="Avatar"
                    className="w-9 h-9 rounded-full ring-2 ring-emerald-500/40" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-nazem-pink to-nazem-teal
                    flex items-center justify-center text-sm font-bold text-white ring-2 ring-nazem-teal/40">
                    {session.user?.name?.[0] || "U"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-200 truncate">{session.user?.name}</p>
                  <p className="text-xs text-slate-500 truncate">{session.user?.email}</p>
                </div>
                <button onClick={() => signOut()}
                  className="text-slate-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  title="Se déconnecter">
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl
                  bg-white text-gray-900 hover:bg-slate-100
                  font-semibold text-sm transition-all duration-200 hover:scale-[1.02]
                  shadow-lg shadow-black/20"
              >
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Connexion avec Google</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-6 h-12 flex items-center justify-center
          bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-r-lg
          text-slate-400 hover:text-white transition-all duration-200 shadow-lg"
        style={{ left: isSidebarOpen ? "18rem" : "0" }}
      >
        {isSidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>
    </>
  );
}

function ConversationItem({ session }: { session: { id: string; title: string; starred: boolean } }) {
  return (
    <button className="group w-full flex items-center gap-3 px-3 py-2 rounded-lg
      hover:bg-white/5 text-slate-400 hover:text-slate-200
      transition-all duration-150 text-left text-sm">
      <MessageSquare size={14} className="flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:text-emerald-500 transition-colors" />
      <span className="flex-1 truncate">{session.title}</span>
      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
        {session.starred && <Star size={12} className="text-amber-400" fill="currentColor" />}
        <MoreHorizontal size={12} className="text-slate-500" />
      </div>
    </button>
  );
}
