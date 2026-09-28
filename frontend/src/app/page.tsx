"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";
import { useStore } from "@/store/useStore";

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), { ssr: false });

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const fetchModels = useStore((s) => s.fetchModels);

  // Fetch installed Ollama models ONCE when the app boots — never again
  useEffect(() => {
    fetchModels();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className="flex h-full w-full relative overflow-hidden">
      {/* Chat Interface — always mounted but hidden during splash */}
      <div
        className={`flex h-full w-full transition-all duration-700
          ${showSplash ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      >
        <Sidebar />
        <ChatPanel />
      </div>

      {/* Splash overlay */}
      {showSplash && (
        <SplashScreen onEnter={() => setShowSplash(false)} />
      )}
    </main>
  );
}
