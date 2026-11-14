import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client if key exists
let aiClient: GoogleGenAI | null = null;
if (GEMINI_API_KEY && GEMINI_API_KEY.trim() !== '' && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
  try {
    aiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    console.log('[AstroCare Backend] Google Gen AI initialized with model:', GEMINI_MODEL);
  } catch (err) {
    console.warn('[AstroCare Backend] Error initializing Google Gen AI client:', err);
  }
} else {
  console.log('[AstroCare Backend] GEMINI_API_KEY not configured. Running in high-fidelity mock simulation mode.');
}

const SYSTEM_INSTRUCTION = `You are AstroCare Gemini AI Intelligence Assistant, an aerospace biomedical specialist platform for NASA and astronaut flight surgeons.
Your mission is to interpret astronaut health metrics, explain microgravity physiology, summarize NASA scientific research, and provide contextual aerospace medical insights.

STRICT OPERATIONAL RULES:
1. INFORMATIONAL ONLY: Always clarify that AI outputs are informational decision support, NOT formal clinical diagnoses.
2. OBSERVATIONS VS HYPOTHESES: Always strictly distinguish between factual telemetry observations (measured numbers) and physiological hypotheses (etiological/mechanistic interpretations).
3. NEVER FABRICATE CITATIONS: Cite only genuine NASA Human Research Program (HRP) Evidence Books, NTRS papers, or peer-reviewed aerospace medicine literature (e.g. NASA Twin Study 2019, SANS Evidence Book 2021, Bone Demineralization Evidence Report 2016). If a paper is not in your verified ground truth, state so clearly.
4. NO MISSING MEASUREMENT FABRICATION: Never invent missing sensor data. If a metric is absent or noisy, explicitly state that it is unavailable.
5. DOMAIN INTEGRATION: Synthesize across cardiovascular, musculoskeletal, radiation, sleep/circadian, and immune systems.
6. ASTRONAUT CONTEXT: Always factor in mission phase (e.g. LEO orbital, lunar transit, Mars simulation), flight day elapsed, EVA history, and cabin environment (CO2 levels, GCR dosimeter rates).
7. ACTIONABLE FOR FLIGHT SURGEONS: Suggest concrete, protocolized questions and countermeasure considerations for qualified aerospace physicians and biomedical engineers.`;

// 1. Health Check
app.get('/api/health-check', (_req: Request, res: Response) => {
  const isKeyConfigured = Boolean(aiClient);
  res.json({
    status: 'ok',
    module: 'ai-intelligence',
    configured: isKeyConfigured,
    mode: isKeyConfigured ? 'gemini-live' : 'mock-simulation',
    model: GEMINI_MODEL,
    timestamp: new Date().toISOString()
  });
});

// 2. Chat Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, healthContext, missionContext, model } = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Messages array is required.' });
    return;
  }

  const activeModel = model || GEMINI_MODEL;

  // If no Gemini client, return formatted mock response
  if (!aiClient) {
    const lastMessage = messages[messages.length - 1];
    const query = lastMessage.content || '';
    
    res.json({
      role: 'assistant',
      content: `### AstroCare Telemetry Analysis (Mock Simulation Engine)\n\n` +
        `> [!NOTE] Offline Operational Mode\n` +
        `> Running via AstroCare Biomedical Simulator. Configure \`GEMINI_API_KEY\` in \`.env\` for live Gemini API integration.\n\n` +
        `**Telemetry Context for ${healthContext?.astronautName || 'Crewmember'}:**\n` +
        `- **Mission Phase:** ${missionContext?.currentPhase || 'Long-duration orbital'} (Flight Day ${missionContext?.flightDay || 142})\n` +
        `- **Cardiovascular Status:** Headward fluid redistribution with altered cardiovagal tone.\n` +
        `- **Bone/Musculoskeletal:** Elevated collagen breakdown markers under microgravity unloading.\n` +
        `- **Sleep/Immune:** Sleep debt logged; subclinical herpesvirus (EBV) shedding detected.\n\n` +
        `**Query Response:**\n` +
        `In reference to *"**${query}**"*, microgravity adaptation causes profound systemic remodeling. Observations show compensatory autonomic adjustments to microgravity hypovolemia, while current hypotheses point to cephalad venous congestion altering intracranial and ocular hemodynamics.\n\n` +
        `*Disclaimer: Informational aerospace decision support only. Not a medical diagnosis.*`,
      timestamp: new Date().toISOString(),
      metadata: {
        mode: 'mock-simulation',
        modelUsed: 'AstroCare-BioSim-v2.5'
      }
    });
    return;
  }

  try {
    const contextPrompt = [
      `Active Astronaut Profile: ${JSON.stringify(healthContext || {}, null, 2)}`,
      `Mission Environmental Context: ${JSON.stringify(missionContext || {}, null, 2)}`,
      `Conversation History:`
    ].join('\n\n');

    // Build contents for GoogleGenAI
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Prepend context to the first user message or as a system turn
    const response = await aiClient.models.generateContent({
      model: activeModel,
      contents: [
        {
          role: 'user',
          parts: [{ text: `[MISSION & BIOMEDICAL CONTEXT]\n${contextPrompt}\n\n[USER INQUIRY]\n${messages[messages.length - 1].content}` }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3
      }
    });

    const outputText = response.text || 'No response generated from Gemini API.';

    res.json({
      role: 'assistant',
      content: outputText,
      timestamp: new Date().toISOString(),
      metadata: {
        mode: 'gemini-live',
        modelUsed: activeModel
      }
    });
  } catch (error: any) {
    console.error('[AstroCare Backend] Gemini API Error:', error);
    res.status(502).json({
      error: 'Gemini API Error: ' + (error?.message || 'Unknown upstream failure.'),
      fallbackAvailable: true
    });
  }
});

// 3. Health Interpretation Endpoint
app.post('/api/interpret-health', async (req: Request, res: Response) => {
  const { healthPayload, missionContext } = req.body;

  if (!healthPayload) {
    res.status(400).json({ error: 'healthPayload is required.' });
    return;
  }

  if (!aiClient) {
    res.status(200).json({
      mode: 'mock-fallback',
      message: 'Running mock interpretation'
    });
    return;
  }

  try {
    const prompt = `Analyze the following astronaut health telemetry payload and mission context.
Return a structured Markdown report with:
1. Executive Summary
2. Observations (strictly measured telemetry)
3. Hypotheses (physiological mechanisms)
4. Cross-domain correlations
5. Questions for Flight Surgeon / BME

Data Payload:
${JSON.stringify({ healthPayload, missionContext }, null, 2)}`;

    const response = await aiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2
      }
    });

    res.json({
      interpretation: response.text,
      mode: 'gemini-live',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[AstroCare Backend] Interpretation Error:', error);
    res.status(502).json({ error: error.message });
  }
});

// 4. Research Summary Endpoint
app.post('/api/research-summary', async (req: Request, res: Response) => {
  const { docId, docTitle, abstract, query } = req.body;

  if (!aiClient) {
    res.status(200).json({
      mode: 'mock-fallback',
      summary: `Research summary for "${docTitle}" synthesized by offline engine.`
    });
    return;
  }

  try {
    const prompt = `Summarize this NASA research publication and explain scientific implications for astronaut health:
Document ID: ${docId}
Title: ${docTitle}
Abstract: ${abstract}
${query ? `User specific inquiry: ${query}` : ''}

Include:
- Core Findings
- Operational Impact
- Clinical Takeaways for long-duration missions
- Never fabricate citations.`;

    const response = await aiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2
      }
    });

    res.json({
      summary: response.text,
      mode: 'gemini-live',
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('[AstroCare Backend] Research Summary Error:', error);
    res.status(502).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[AstroCare Backend] Secure AI proxy listening on port ${PORT}`);
});
