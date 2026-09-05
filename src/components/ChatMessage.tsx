import React, { useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessageItem: React.FC<ChatMessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  // Helper to render code blocks and text nicely
  const renderFormattedContent = (content: string) => {
    // If it contains ``` code block
    if (content.includes('```')) {
      const parts = content.split(/(```[\s\S]*?```)/g);
      return parts.map((part, index) => {
        if (part.startsWith('```') && part.endsWith('```')) {
          const lines = part.slice(3, -3).trim().split('\n');
          const lang = lines[0].trim();
          const code = lines.slice(1).join('\n');
          return (
            <div key={index} className="my-2.5 rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950">
              <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-900 border-b border-neutral-800 text-[11px] font-mono text-neutral-400">
                <span>{lang || 'code'}</span>
                <span className="text-[10px] text-neutral-500">Roblox Studio</span>
              </div>
              <pre className="p-3 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
                <code>{code || lines.join('\n')}</code>
              </pre>
            </div>
          );
        }
        return (
          <span key={index} className="whitespace-pre-line leading-relaxed">
            {part}
          </span>
        );
      });
    }

    return <span className="whitespace-pre-line leading-relaxed">{content}</span>;
  };

  return (
    <div
      id={`chat-message-${message.id}`}
      className={`flex items-start gap-3 w-full transition-all ${
        isUser ? 'flex-row-reverse justify-start' : 'justify-start'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-sm text-xs font-bold ${
          isUser
            ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
            : 'bg-neutral-900 border border-red-500/40 text-red-400'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <img
            src="/brickmind_logo.jpg"
            alt="BrickMind"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Message Container */}
      <div
        className={`group relative max-w-[85%] sm:max-w-xl md:max-w-2xl rounded-2xl p-4 shadow-sm transition-shadow ${
          isUser
            ? 'bg-red-950/40 border border-red-800/40 text-neutral-100 rounded-tr-sm'
            : 'bg-neutral-850/90 border border-neutral-800 text-neutral-200 rounded-tl-sm hover:border-neutral-750'
        }`}
      >
        {/* Header inside bubble: Role & Time */}
        <div className={`flex items-center gap-2 mb-1.5 text-[11px] text-neutral-400 ${isUser ? 'justify-end' : 'justify-between'}`}>
          <span className="font-semibold text-neutral-300">
            {isUser ? 'Du' : 'BrickMind 🧱🧠'}
          </span>
          <span className="text-[10px] font-mono text-neutral-500">{message.timestamp}</span>
        </div>

        {/* Text Content */}
        <div className="text-sm text-neutral-200 selection:bg-red-900 selection:text-white">
          {renderFormattedContent(message.text)}
        </div>

        {/* Copy Button for Assistant responses */}
        {!isUser && (
          <div className="mt-2.5 pt-2 border-t border-neutral-800/70 flex items-center justify-end">
            <button
              id={`copy-btn-${message.id}`}
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
              title="Nachricht kopieren"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Kopieren</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
