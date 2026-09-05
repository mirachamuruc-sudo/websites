import React from 'react';
import { Bot, RotateCcw, Sparkles } from 'lucide-react';

interface HeaderProps {
  onResetChat: () => void;
  messageCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onResetChat, messageCount }) => {
  return (
    <header
      id="app-header"
      className="sticky top-0 z-30 w-full bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 shadow-md"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Title and Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-neutral-900 overflow-hidden shadow-lg shadow-red-950/40 border border-red-500/40 group">
            <img
              src="/brickmind_logo.jpg"
              alt="BrickMind Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-neutral-900" title="Bereit" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                BrickMind 🧱🧠
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md bg-red-950/60 text-red-400 border border-red-800/40">
                <Sparkles className="w-3 h-3" /> Roblox AI Assistant
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Dein intelligenter Bau- und Skript-Begleiter für Roblox Studio
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {messageCount > 1 && (
            <button
              id="reset-chat-btn"
              onClick={onResetChat}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-300 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 transition-colors"
              title="Chat zurücksetzen"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Neuer Chat</span>
            </button>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-neutral-800 border border-neutral-700/70 text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-medium">Backend aktiv</span>
          </div>
        </div>
      </div>
    </header>
  );
};
