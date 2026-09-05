import { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ChatMessageItem } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { TypingIndicator } from './components/TypingIndicator';
import { ChatMessage } from './types';
import { INITIAL_ASSISTANT_MESSAGE, sendChatMessage } from './services/chatService';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_ASSISTANT_MESSAGE]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(text);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating assistant response:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'assistant',
        text: 'Entschuldigung, es gab ein Problem bei der Server-Kommunikation. Bitte versuche es noch einmal.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        ...INITIAL_ASSISTANT_MESSAGE,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div id="roblox-ai-assistant-app" className="min-h-screen h-screen flex flex-col bg-neutral-950 text-neutral-100 antialiased overflow-hidden select-text">
      {/* Header */}
      <Header onResetChat={handleResetChat} messageCount={messages.length} />

      {/* Main Chat Area */}
      <main
        id="chat-messages-container"
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 scroll-smooth"
      >
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Welcome Banner / Context */}
          <div className="text-center py-5 px-4 rounded-2xl bg-neutral-900/50 border border-neutral-800/80 mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-red-950/50 border border-red-500/40 mb-3 bg-neutral-900">
              <img
                src="/brickmind_logo.jpg"
                alt="BrickMind 🧱🧠"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center justify-center gap-1.5">
              Willkommen bei BrickMind 🧱🧠
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-md mx-auto">
              Dein Roblox AI Assistant für Bau-Konzepte, Obbies, Tycoons und Lua-Skripte in Roblox Studio.
            </p>
          </div>

          {/* Messages List */}
          {messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}

          {/* Loading / Typing Indicator */}
          {isLoading && <TypingIndicator />}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} className="h-2" />
        </div>
      </main>

      {/* Input Form at Bottom */}
      <footer className="shrink-0">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </footer>
    </div>
  );
}
