"use client";

import { useStore } from "@/store/useStore";
import { Plus, Settings, ChevronLeft, ChevronRight, LogIn, LogOut, Sun, Moon } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, theme, toggleTheme, clearMessages } = useStore();
  const { data: session } = useSession();

  return (
    <>
      {/* Sidebar Container */}
      <div
        className={`flex flex-col border-r border-slate-200 dark:border-white/5 transition-all duration-300 h-full relative z-10
          ${isSidebarOpen ? "w-72" : "w-0"} overflow-hidden
          bg-[#f8f9fa] dark:bg-[#131314]`}
      >
        {/* Top Section with Logo & New Chat */}
        <div className="flex flex-col min-w-[18rem] pt-3 pb-2 px-3 gap-4">
          
          {/* Logo */}
          <div className="flex items-center px-3 h-10">
            <span className="text-xl font-medium tracking-wide text-slate-800 dark:text-slate-200">NAZEM</span>
          </div>

          {/* New Chat Button (Gemini Style) */}
          <button
            onClick={clearMessages}
            className="flex items-center gap-3 w-max px-4 py-3 rounded-full
              bg-[#e8eaed] hover:bg-[#e0e3e7] dark:bg-[#202124] dark:hover:bg-[#303134]
              text-sm font-medium text-slate-700 dark:text-slate-300
              transition-all duration-200"
          >
            <Plus size={20} className="text-slate-600 dark:text-slate-400" />
            <span>Nouveau chat</span>
          </button>
        </div>

        {/* Empty space where real history will go later */}
        <div className="flex-1 min-w-[18rem] overflow-y-auto px-3 py-2">
          {/* Recent chats placeholder for the future */}
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 px-3 py-2">Récents</div>
          <div className="px-3 py-2 text-sm text-slate-400 dark:text-slate-500 italic">
            Aucun historique pour le moment.
          </div>
        </div>

        {/* Bottom Section: Settings & User Profile */}
        <div className="min-w-[18rem] pb-4 px-3 flex flex-col gap-1">
          {/* Settings & Theme */}
          <div className="flex items-center gap-1 mb-1">
            <button className="flex-1 flex items-center gap-3 px-3 py-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-[#303134] text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors">
              <Settings size={18} className="text-slate-500" />
              <span>Paramètres</span>
            </button>
            <button onClick={toggleTheme} className="p-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-[#303134] text-slate-700 dark:text-slate-300 transition-colors" title="Changer le thème">
              {theme === 'dark' ? <Sun size={18} className="text-slate-500" /> : <Moon size={18} className="text-slate-500" />} 
            </button>
          </div>

          {/* User Block */}
          {session ? (
            <div className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-slate-200 dark:hover:bg-[#303134] transition-colors group cursor-pointer">
              {session.user?.image ? (
                <img src={session.user.image} alt="Avatar" className="w-8 h-8 rounded-full" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-medium text-white">
                  {session.user?.name?.[0] || "U"}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-700 dark:text-slate-300 truncate">{session.user?.name}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); signOut(); }}
                className="text-slate-500 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 p-1"
                title="Se déconnecter">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-3 px-3 py-2.5 rounded-full hover:bg-slate-200 dark:hover:bg-[#303134] text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors w-full"
            >
              <LogIn size={18} className="text-slate-500" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>

      {/* Collapse Toggle Button (Gemini Style) */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center
          bg-slate-200 dark:bg-[#303134] hover:bg-slate-300 dark:hover:bg-[#3c4043]
          text-slate-600 dark:text-slate-300 transition-all duration-200
          ${isSidebarOpen 
            ? "w-6 h-12 rounded-r-lg left-72 shadow-sm border border-l-0 border-slate-300 dark:border-white/5" 
            : "w-10 h-10 rounded-full left-4 shadow-md"}`}
      >
        {isSidebarOpen ? <ChevronLeft size={16} /> : <Plus size={20} />}
      </button>
    </>
  );
}
