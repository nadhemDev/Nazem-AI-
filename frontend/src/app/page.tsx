"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), { ssr: false });

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

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
