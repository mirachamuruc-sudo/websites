import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div
      id="typing-indicator"
      className="flex items-start gap-3 max-w-2xl animate-fade-in"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-red-500/40 shadow-sm flex items-center justify-center bg-neutral-900">
        <img
          src="/brickmind_logo.jpg"
          alt="BrickMind"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-neutral-800/90 border border-neutral-700/60 shadow-sm">
        <div className="flex items-center gap-1.5 h-4">
          <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce" />
        </div>
      </div>
    </div>
  );
};
