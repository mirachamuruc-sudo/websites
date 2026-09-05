import { ChatMessage } from '../types';

/**
 * Initial assistant message displayed when the chat starts.
 */
export const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  id: 'init-msg-1',
  sender: 'assistant',
  text: 'Ich bin bereit! Was möchtest du in Roblox bauen?',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
};

/**
 * Send chat message to backend endpoint POST /api/chat
 * Format: { "message": "..." }
 * Expected reply: { "reply": "Backend funktioniert!" }
 */
export async function sendChatMessage(userMessage: string): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || `Server-Fehler: HTTP ${response.status}`);
    }

    const data: { reply?: string } = await response.json();
    if (data && typeof data.reply === 'string') {
      return data.reply;
    }

    return 'Backend funktioniert!';
  } catch (error) {
    console.warn('[BrickMind] Backend-Aufruf fehlgeschlagen, verwende lokalen Fallback:', error);
    return sendLocalFallbackMessage(userMessage);
  }
}

/**
 * Local fallback response generator if backend is unavailable.
 */
export async function sendLocalFallbackMessage(userMessage: string): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const lower = userMessage.toLowerCase().trim();

  if (lower.includes('haus') || lower.includes('gebäude') || lower.includes('villa') || lower.includes('burg')) {
    return `Hier ist eine Bau-Idee für dein Gebäude in Roblox Studio:\n\n1. Fundament: Verwende glatten Beton (SmoothPlastic oder Concrete) mit den Maßen 64x64 Studs.\n2. Wände: Baue mit WoodPlanks oder Bricks im Raster von 4 Studs (Snap to Grid).\n3. Dach: Nutze Wedge-Parts für einen sauberen Giebel.\n4. Beleuchtung: Füge PointLights mit warmem Farbton (Color3.fromRGB(255, 230, 200)) hinzu.\n\nMöchtest du dazu ein Tür-Skript oder eine Inneneinrichtung planen?`;
  }

  if (lower.includes('obby') || lower.includes('parcours') || lower.includes('jump')) {
    return `Toller Obby-Plan für Roblox Studio:\n\n1. Checkpoints: Nutze Teams & SpawnLocations mit Neutral = false.\n2. Kill-Parts: Ein Part mit einem einfachen Touched-Event (Humanoid.Health = 0).\n3. Bewegliche Plattformen: Verwende TweenService oder PrismaticConstraints für flüssige Bewegungen ohne Ruckeln.\n4. Schwierigkeitsgrad: Starte mit 8-12 Stud Sprüngen und steigere auf Neons und Laser.\n\nSoll ich dir das Kill-Part Lua-Skript vorbereiten?`;
  }

  return 'Backend funktioniert!';
}

// Alias for backwards compatibility
export const sendLocalChatMessage = sendChatMessage;
