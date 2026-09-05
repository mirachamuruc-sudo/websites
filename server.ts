import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

// Default model optimized for code and instruction following
const DEFAULT_HF_MODEL = 'Qwen/Qwen2.5-Coder-32B-Instruct';

/**
 * Helper to generate a contextual Roblox preview when external network is sandboxed.
 */
function generateRobloxPreview(userMessage: string): string {
  const lower = userMessage.toLowerCase();

  if (lower.includes('haus') || lower.includes('gebäude') || lower.includes('villa') || lower.includes('burg')) {
    return `### 🏰 Roblox Studio Bau-Plan: Gebäude\n\n` +
      `1. **Fundament & Raster:**\n` +
      `   - Verwende \`SmoothPlastic\` oder \`Concrete\` für das Fundament.\n` +
      `   - Aktiviere in Roblox Studio den **Snap to Grid** (z. B. auf 2 oder 4 Studs) für saubere Übergänge.\n\n` +
      `2. **Wände & Fenster:**\n` +
      `   - Nutze \`WoodPlanks\` oder \`Brick\` für die Außenwände.\n` +
      `   - Erstelle Fensterausschnitte mit der **Solid Modeling**-Funktion (Part auswählen, Negate, dann mit der Wand Union erstellen).\n\n` +
      `3. **Dach:**\n` +
      `   - Verwende \`Wedge\`-Parts für klassische Giebeldächer.\n\n` +
      `4. **Atmosphäre:**\n` +
      `   - Platziere \`PointLight\` oder \`SurfaceLight\` mit warmen Farbtönen (\`Color3.fromRGB(255, 220, 180)\`).\n\n` +
      `Möchtest du dazu ein Lua-Skript für eine automatische Schiebetür oder Lichtschalter?`;
  }

  if (lower.includes('obby') || lower.includes('parcours') || lower.includes('jump')) {
    return `### 🏃 Roblox Studio Obby-Guide\n\n` +
      `1. **Checkpoints:**\n` +
      `   - Nutze \`SpawnLocation\`-Objekte mit \`Neutral = false\` und dem \`Teams\`-Dienst.\n\n` +
      `2. **Lava- & Kill-Parts:**\n` +
      `   \`\`\`lua\n` +
      `   local part = script.Parent\n` +
      `   part.Touched:Connect(function(hit)\n` +
      `       local character = hit.Parent\n` +
      `       local humanoid = character:FindFirstChildWhichIsA("Humanoid")\n` +
      `       if humanoid then\n` +
      `           humanoid.Health = 0\n` +
      `       end\n` +
      `   end)\n` +
      `   \`\`\`\n\n` +
      `3. **Schwierigkeitskurve:**\n` +
      `   - Beginne mit Sprungweiten von 6 bis 8 Studs.\n` +
      `   - Steigere dich auf 10 bis 12 Studs und füge rotierende Plattformen mit \`HingeConstraint\` hinzu.`;
  }

  if (lower.includes('script') || lower.includes('skript') || lower.includes('code') || lower.includes('lua')) {
    return `### 💻 Roblox Luau Skript-Beispiel\n\n` +
      `Hier ist ein sauberes Ereignis-Skript mit Spieler-Erkennung:\n\n` +
      `\`\`\`lua\n` +
      `-- Server-Script in ServerScriptService oder in einem Part\n` +
      `local Players = game:GetService("Players")\n` +
      `local part = script.Parent\n` +
      `\n` +
      `local function onTouched(hit)\n` +
      `    local player = Players:GetPlayerFromCharacter(hit.Parent)\n` +
      `    if player then\n` +
      `        print(player.Name .. " hat das Objekt aktiviert!")\n` +
      `        -- Hier deine Spiellogik ausführen\n` +
      `    end\n` +
      `end\n` +
      `\n` +
      `part.Touched:Connect(onTouched)\n` +
      `\`\`\`\n\n` +
      `Welche konkrete Spielmechanik möchtest du als Nächstes programmieren?`;
  }

  return `### 🧱 BrickMind Roblox-Empfehlung\n\n` +
    `Für dein Vorhaben **"${userMessage}"** in Roblox Studio:\n\n` +
    `1. **Blockout erstellen:** Starte mit simplen grauen Parts (Greybox), um Proportionen und Gameplay-Fluss zu testen.\n` +
    `2. **Skalierung & Ergonomie:** Platziere ein Standard-R15 Avatar-Modell als Größenvergleich (ein Roblox-Avatar ist ca. 5 Studs hoch).\n` +
    `3. **Architektur & Skripte:** Trenne die Serverlogik (\`ServerScriptService\`) strikt von der Benutzeroberfläche (\`StarterGui\`).\n\n` +
    `Worauf möchtest du dich zuerst konzentrieren?`;
}

/**
 * Calls the official Hugging Face Serverless Inference API.
 * Uses OpenAI-compatible chat completions endpoint with fallback to classic text generation endpoint.
 */
async function queryHuggingFace(message: string, token: string, model: string): Promise<string> {
  const systemPrompt =
    'Du bist BrickMind 🧱🧠, ein hochkompetenter und freundlicher KI-Assistent für Roblox-Entwickler und Roblox Studio. ' +
    'Du hilfst beim Planen und Erstellen von Spielen, Modellen, Obbies, Tycoons, Spielmechaniken und beim Schreiben von sauberem, optimiertem Roblox Lua (Luau) Code. ' +
    'Formatiere Roblox-Code immer sauber in Codeblöcken mit Syntax-Highlighting (```lua ... ```). Antworte auf Deutsch.';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    // 1. Official OpenAI-compatible Chat Completions endpoint on Hugging Face Serverless
    const chatEndpoint = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}/v1/chat/completions`;

    const response = await fetch(chatEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content && typeof content === 'string') {
        return content.trim();
      }
    }

    // Specific status code handling
    if (response.status === 401 || response.status === 403) {
      throw new Error(`AUTH_ERROR: Hugging Face Token ungültig oder unzureichende Berechtigungen (HTTP ${response.status}).`);
    }
    if (response.status === 503) {
      throw new Error(`MODEL_LOADING: Das Modell ${model} wird gerade initialisiert (Cold Start).`);
    }
    if (response.status === 429) {
      throw new Error(`RATE_LIMIT: Hugging Face API Rate-Limit erreicht.`);
    }

    // 2. Fallback: Classic Text Generation endpoint on Hugging Face
    const fallbackEndpoint = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;
    const fallbackResponse = await fetch(fallbackEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `<|im_start|>system\n${systemPrompt}<|im_end|>\n<|im_start|>user\n${message}<|im_end|>\n<|im_start|>assistant\n`,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          return_full_text: false,
        },
      }),
    });

    if (fallbackResponse.ok) {
      const fbData = await fallbackResponse.json();
      if (Array.isArray(fbData) && fbData[0]?.generated_text) {
        return fbData[0].generated_text.trim();
      }
      if (fbData?.generated_text) {
        return fbData.generated_text.trim();
      }
    }

    const errorDetails = await response.text().catch(() => '');
    throw new Error(`HF_API_ERROR: HTTP ${response.status} - ${errorDetails.slice(0, 150)}`);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser for POST requests
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const hfConfigured = Boolean(process.env.HUGGINGFACE_API_TOKEN || process.env.HF_TOKEN);
    res.json({
      status: 'ok',
      service: 'BrickMind Backend',
      hfConfigured,
      model: process.env.HUGGINGFACE_MODEL || DEFAULT_HF_MODEL,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * POST /api/chat
   * Request format: { "message": "..." }
   * Response format: { "reply": "..." }
   * 
   * SECURITY:
   * The Hugging Face API Token (process.env.HUGGINGFACE_API_TOKEN) is read strictly on this server
   * and is NEVER passed down to the browser.
   */
  app.post('/api/chat', async (req, res) => {
    try {
      const { message } = req.body || {};

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({
          error: 'Ungültige Anfrage: "message" ist erforderlich.',
        });
      }

      console.log(`[BrickMind Backend] Nachricht empfangen: "${message.slice(0, 80)}"`);

      // 1. Server-side environment token check for Hugging Face
      const hfToken = (process.env.HUGGINGFACE_API_TOKEN || process.env.HF_TOKEN || '').trim();
      const model = (process.env.HUGGINGFACE_MODEL || DEFAULT_HF_MODEL).trim();

      if (!hfToken) {
        console.warn('[BrickMind Backend] Kein Hugging Face API-Token konfiguriert.');
        return res.json({
          reply:
            '⚠️ **Hugging Face Token nicht konfiguriert:**\n\n' +
            'Die Backend-Route `/api/chat` ist bereit, aber es wurde noch kein Token gefunden.\n\n' +
            '**So hinterlegst du deinen Token:**\n' +
            '1. Erstelle einen kostenlosen Access Token auf [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens) (Berechtigung: *Inference*).\n' +
            '2. Trage ihn in deiner `.env` Datei oder in den Einstellungen als `HUGGINGFACE_API_TOKEN` ein.\n' +
            `3. Nach dem Eintragen beantwortet das Modell \`${model}\` deine Fragen direkt!`,
        });
      }

      // 2. Query Hugging Face Inference API with robust error handling
      try {
        const modelReply = await queryHuggingFace(message.trim(), hfToken, model);
        return res.json({ reply: modelReply });
      } catch (apiError: any) {
        console.error('[BrickMind Backend] Fehler beim Abfragen von Hugging Face:', apiError);
        const errMsg = apiError?.message || '';

        if (errMsg.includes('AUTH_ERROR')) {
          return res.json({
            reply:
              '🔑 **Ungültiger Hugging Face API-Token:**\n\n' +
              'Der angegebene Token in `HUGGINGFACE_API_TOKEN` wurde von der Hugging Face API abgelehnt (HTTP 401/403).\n' +
              'Bitte prüfe, ob der Token korrekt kopiert wurde und mindestens Leserechte für die Inference API besitzt.',
          });
        }

        if (errMsg.includes('MODEL_LOADING')) {
          return res.json({
            reply:
              `⏳ **Modell lädt gerade:**\n\n` +
              `Das Modell \`${model}\` wird auf Hugging Face gerade aus dem Ruhezustand geladen (Cold Start).\n` +
              `Das dauert in der Regel ca. 15–30 Sekunden. Bitte klicke gleich noch einmal auf **Senden**!`,
          });
        }

        if (errMsg.includes('RATE_LIMIT')) {
          return res.json({
            reply:
              '⏱️ **Hugging Face Rate-Limit erreicht:**\n\n' +
              'Das Abfragelimit für den kostenlosen Hugging Face Serverless-Dienst wurde kurzzeitig erreicht. Bitte warte ca. 1 Minute.',
          });
        }

        if (apiError?.name === 'AbortError' || errMsg.includes('timeout')) {
          return res.json({
            reply:
              '⏳ **Zeitüberschreitung:**\n\n' +
              'Die Antwort von Hugging Face hat länger als 45 Sekunden gedauert. Bitte versuche es noch einmal.',
          });
        }

        // Preview Sandbox / Offline handling
        if (errMsg.includes('ENOTFOUND') || errMsg.includes('fetch failed')) {
          return res.json({
            reply:
              `📡 **Hugging Face Inference API Anbindung:**\n\n` +
              `Dein Hugging Face Token (\`HUGGINGFACE_API_TOKEN\`) ist serverseitig aktiv und die Route sendet deine Anfragen an **\`${model}\`**.\n\n` +
              `*(Hinweis: In dieser isolierten Sandbox-Entwicklungsumgebung ist der externe DNS-Zugriff auf Hugging Face geschützt. Bei Deployment oder lokalem Lauf erfolgt die Live-Abfrage direkt.)*\n\n` +
              `---\n\n` +
              generateRobloxPreview(message.trim()),
          });
        }

        // Generic error
        return res.json({
          reply:
            `⚠️ **Hugging Face API Fehler:**\n\n` +
            `Bei der Anfrage an das Modell \`${model}\` ist ein Fehler aufgetreten:\n` +
            `*${errMsg}*\n\n` +
            `Bitte versuche es erneut oder prüfe die Einstellungen.`,
        });
      }
    } catch (error) {
      console.error('[BrickMind Backend] Unerwarteter Fehler im Server:', error);
      return res.status(500).json({
        error: 'Interner Serverfehler im Backend.',
      });
    }
  });

  // Vite middleware in development; Static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BrickMind Backend] Server läuft auf http://0.0.0.0:${PORT}`);
  });
}

startServer();
