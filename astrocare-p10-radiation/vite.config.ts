import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Secure server-side Gemini proxy plugin.
 * Handles /api/gemini/generate in the Node.js dev server, ensuring
 * Gemini API credentials are never exposed to client browser bundles.
 */
function geminiServerPlugin(): Plugin {
  return {
    name: 'gemini-server-proxy',
    configureServer(server) {
      server.middlewares.use('/api/gemini/generate', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const data = JSON.parse(body || '{}');
            const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

            if (!apiKey || apiKey === 'your-gemini-api-key') {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ isFallback: true, text: '', error: 'NO_API_KEY' }));
              return;
            }

            // Execute server-side request to Google Gemini API
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const geminiRes = await fetch(geminiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: [{ parts: [{ text: data.prompt }] }],
                systemInstruction: data.systemInstruction
                  ? { parts: [{ text: data.systemInstruction }] }
                  : undefined,
                generationConfig: {
                  temperature: data.temperature ?? 0.2,
                  maxOutputTokens: 1024,
                },
              }),
            });

            if (!geminiRes.ok) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ isFallback: true, text: '', error: `HTTP_${geminiRes.status}` }));
              return;
            }

            const geminiData = (await geminiRes.json()) as {
              candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
            };
            const textOutput = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                text: textOutput,
                modelVersion: 'gemini-1.5-flash',
                isFallback: false,
              })
            );
          } catch (err: any) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ isFallback: true, text: '', error: err?.message || 'Proxy error' }));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), geminiServerPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
});
