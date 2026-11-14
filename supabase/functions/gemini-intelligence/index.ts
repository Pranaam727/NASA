// Supabase Edge Function: gemini-intelligence
// Secure server-side proxy for Google Gemini 1.5 API integration
// Keeps GEMINI_API_KEY protected in server environment secrets

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY_NOT_CONFIGURED",
          message: "Server environment missing GEMINI_API_KEY secret. Fallback mode activated.",
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { model = "gemini-1.5-flash", action, payload } = await req.json();

    if (!payload || !payload.context) {
      return new Response(
        JSON.stringify({ error: "INVALID_REQUEST", message: "Missing payload context." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build system prompt enforcing aerospace medical decision support rules
    const systemPrompt = `You are AstroCare AI Clinical Intelligence, an aerospace biomedical decision support assistant.
CRITICAL SAFETY & MEDICAL DIRECTIVES:
1. You provide informational decision support for qualified Flight Surgeons. You NEVER issue autonomous medical diagnoses.
2. Ground all answers strictly in the provided astronaut telemetry records and individual baselines.
3. NEVER fabricate measurements, baselines, or clinical standards.
4. Preserved P06 deterministic anomaly classifications are authoritative; do NOT contradict or alter them.
5. All telemetry is simulated (isSimulated = true).
6. Output concise, structured JSON when requested.`;

    const userPrompt = `Action: ${action}\nPayload: ${JSON.stringify(payload)}\nProduce the requested analysis based strictly on the telemetry context.`;

    // Dispatch request to Google Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const geminiRes = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
          },
        ],
        generationConfig: {
          temperature: 0.2, // Low temperature for deterministic, clinically grounded responses
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return new Response(
        JSON.stringify({ error: `GEMINI_UPSTREAM_ERROR_${geminiRes.status}`, details: errText }),
        { status: geminiRes.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiData = await geminiRes.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "";

    return new Response(
      JSON.stringify({
        data: {
          text: generatedText,
          provenance: "GEMINI_LIVE",
          model,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "INTERNAL_PROXY_ERROR", message: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
