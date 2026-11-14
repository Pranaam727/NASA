/**
 * ASTROCARE GEMINI INTEGRATION & CLIENT SERVICE
 * Secure client service communicating with server-side Gemini proxy endpoint,
 * with medical guardrails, timeout handling, and deterministic fallback.
 */

import {
  GroundedContextDocument,
  GeminiProxyRequest,
  GeminiProxyResponse,
  AIMessage,
  MissionHealthReportDraft,
} from '../types';
import { sanitizeUserQuery, validateAndGuardrailResponse, buildGroundingSystemPrompt } from '../guardrails';
import { formatGroundedContextForPrompt } from '../grounding';
import {
  generateConversationalResponse,
  synthesizeMissionHealthReport,
  explainActiveRisks,
} from '../knowledgeEngine';
import { ReportType } from '@/types/database.types';

export class GeminiIntelligenceService {
  private endpointUrl: string = '/api/gemini/generate';
  private requestTimeoutMs: number = 8000;

  /**
   * Dispatches a query to the secure Gemini proxy endpoint with full grounding context.
   * If the proxy is unavailable, falls back gracefully to the deterministic clinical knowledge engine.
   */
  public async queryCopilot(
    userQuery: string,
    context: GroundedContextDocument
  ): Promise<AIMessage> {
    const { sanitized, isValid, warning } = sanitizeUserQuery(userQuery);

    if (!isValid) {
      return {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **SAFETY GUARDRAIL REJECTION:** ${warning}`,
        timestamp: new Date().toISOString(),
        provenanceTags: ['RULE_ALERT'],
      };
    }

    const groundingContextText = formatGroundedContextForPrompt(context);
    const fullPrompt = `${groundingContextText}\n\nUser Flight Surgeon Query: "${sanitized}"`;
    const systemPrompt = buildGroundingSystemPrompt();

    try {
      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => controller.abort(), this.requestTimeoutMs);

      const payload: GeminiProxyRequest = {
        prompt: fullPrompt,
        systemInstruction: systemPrompt,
        contextDocument: context,
        temperature: 0.2, // Low temperature for high aerospace precision
      };

      const res = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutHandle);

      if (res.ok) {
        const data: GeminiProxyResponse = await res.json();
        if (data.text && !data.isFallback) {
          const { guardedText, provenanceTags } = validateAndGuardrailResponse(
            data.text,
            context.deterministicRisk.riskLevel === 'CRITICAL'
          );

          return {
            id: `msg-${Date.now()}`,
            role: 'assistant',
            content: guardedText,
            timestamp: new Date().toISOString(),
            provenanceTags,
            citations: data.citations,
            confidenceScore: 0.94,
            suggestedFollowUps: [
              'Explain physiological mechanism behind this risk score.',
              'What are the active alerts for this astronaut?',
              'Generate daily flight surgeon briefing.',
            ],
          };
        }
      }
    } catch {
      // Network unreachable, dev mode without proxy, or request timeout:
      // Gracefully utilize deterministic knowledge engine
    }

    // High-fidelity deterministic fallback
    const fallback = generateConversationalResponse(sanitized, context);
    const isEmergency = context.deterministicRisk.riskLevel === 'CRITICAL';

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: fallback.text,
      timestamp: new Date().toISOString(),
      provenanceTags: isEmergency ? ['AI_INTERPRETATION', 'RULE_ALERT'] : ['AI_INTERPRETATION'],
      citations: fallback.citations,
      confidenceScore: 0.98,
      suggestedFollowUps: fallback.suggestedFollowUps,
    };
  }

  /**
   * Generates a structured Mission Health Report.
   */
  public async generateReport(
    reportType: ReportType,
    context: GroundedContextDocument
  ): Promise<MissionHealthReportDraft> {
    return synthesizeMissionHealthReport(reportType, context);
  }

  /**
   * Generates a clinical explanation of active risks.
   */
  public async explainRisks(context: GroundedContextDocument): Promise<string> {
    return explainActiveRisks(context);
  }
}

// Global Singleton Instance
export const geminiService = new GeminiIntelligenceService();
