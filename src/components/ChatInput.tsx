import React, { useState, useRef, useEffect } from 'react';
import { Send, Blocks, Lightbulb } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const QUICK_SUGGESTIONS = [
  'Mittelalterliche Festung mit Zugbrücke',
  'Schwieriger Lava-Obby Parcours',
  'Sci-Fi Tycoon mit Förderbändern',
  'Interaktives Tür-Skript in Lua',
];

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto focus on load
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
  };

  // Adjust textarea height dynamically
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
  };

  return (
    <div id="chat-input-container" className="w-full bg-neutral-900/95 border-t border-neutral-800 p-3 sm:p-4 backdrop-blur-md">
      <div className="max-w-5xl mx-auto space-y-3">
        {/* Quick Suggestions */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
          <span className="text-neutral-500 flex items-center gap-1 shrink-0 font-medium">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Ideen:
          </span>
          {QUICK_SUGGESTIONS.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSuggestionClick(suggestion)}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 transition-colors disabled:opacity-50 text-[11px]"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Bar Form */}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-neutral-950/80 border border-neutral-800 focus-within:border-red-600/70 focus-within:ring-1 focus-within:ring-red-600/30 rounded-xl p-2 transition-all shadow-inner">
          <div className="flex items-center pl-2 pb-2 text-neutral-500">
            <Blocks className="w-5 h-5 text-neutral-500" />
          </div>

          <textarea
            id="chat-textarea"
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Was soll ich in Roblox bauen?"
            className="flex-1 max-h-32 bg-transparent text-sm text-neutral-100 placeholder-neutral-500 resize-none focus:outline-none py-1.5 px-2 leading-relaxed"
          />

          <button
            id="send-message-btn"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-red-950/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all shrink-0"
          >
            <span>Senden</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-neutral-500 px-1">
          <span>Drücke <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-[10px]">Enter ↵</kbd> zum Senden</span>
          <span className="hidden sm:inline">BrickMind 🧱🧠 • Backend API aktiv</span>
        </div>
      </div>
    </div>
  );
};
