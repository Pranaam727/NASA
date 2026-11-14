/**
 * ASTROCARE MEDICAL SAFETY & AI GUARDRAILS
 * Enforces non-diagnostic clinical boundaries, prompt injection mitigation,
 * output validation, and mandatory aerospace disclaimers.
 */

import { AIProvenanceTag } from './types';

export const AEROSPACE_MEDICAL_DISCLAIMER =
  'AEROSPACE MEDICAL DISCLAIMER: AstroCare AI operates exclusively as an autonomous clinical intelligence and decision-support assistant for deep-space flight surgeons. Outputs reflect probabilistic interpretations of simulated telemetry and do not constitute independent clinical diagnoses. Deterministic risk scores and alert rules are authoritative and cannot be overridden by AI.';

// Forbidden prompt injection patterns
const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous\s+)?instructions/i,
  /override\s+(risk|baseline|severity|threshold)/i,
  /you\s+are\s+now\s+a/i,
  /system\s+prompt/i,
  /delete\s+(all\s+)?alerts/i,
  /modify\s+database/i,
  /bypass\s+guardrails/i,
  /pretend\s+you\s+are/i,
];

// Forbidden diagnostic assertion patterns (AI must not declare conclusive independent medical diagnoses)
const DIAGNOSTIC_OVERREACH_PATTERNS = [
  /i\s+diagnose\s+you\s+with/i,
  /my\s+definitive\s+diagnosis\s+is/i,
  /you\s+definitely\s+have\s+a\s+confirmed\s+case\s+of/i,
  /i\s+hereby\s+override\s+the\s+alert/i,
];

/**
 * Sanitizes and validates user input queries to prevent prompt injection and unauthorized overrides.
 */
export function sanitizeUserQuery(input: string): { sanitized: string; isValid: boolean; warning?: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return { sanitized: '', isValid: false, warning: 'Query cannot be empty.' };
  }

  if (trimmed.length > 2000) {
    return {
      sanitized: trimmed.slice(0, 2000),
      isValid: false,
      warning: 'Query exceeds maximum allowed length of 2000 characters.',
    };
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        sanitized: trimmed,
        isValid: false,
        warning: 'Query contains unauthorized system override or injection syntax. Request rejected by safety guardrails.',
      };
    }
  }

  return { sanitized: trimmed, isValid: true };
}

/**
 * Validates and sanitizes Gemini / LLM responses before delivery to client components.
 */
export function validateAndGuardrailResponse(
  rawText: string,
  isEmergencyAlert: boolean = false
): {
  guardedText: string;
  provenanceTags: AIProvenanceTag[];
  passedAudit: boolean;
} {
  let text = rawText.trim();
  let passedAudit = true;

  // 1. Audit for diagnostic overreach
  for (const pattern of DIAGNOSTIC_OVERREACH_PATTERNS) {
    if (pattern.test(text)) {
      passedAudit = false;
      text = text.replace(pattern, 'Analytical telemetry patterns suggest possible');
    }
  }

  // 2. Ensure mandatory disclaimer is attached if not already present
  if (!text.includes('AEROSPACE MEDICAL DISCLAIMER')) {
    text = `${text}\n\n---\n*${AEROSPACE_MEDICAL_DISCLAIMER}*`;
  }

  // 3. Assign appropriate provenance tags
  const provenanceTags: AIProvenanceTag[] = ['AI_INTERPRETATION'];
  if (isEmergencyAlert) {
    provenanceTags.push('RULE_ALERT');
  }

  return {
    guardedText: text,
    provenanceTags,
    passedAudit,
  };
}

/**
 * Formats a system prompt with strict grounding and aerospace role constraints.
 */
export function buildGroundingSystemPrompt(): string {
  return `You are the AstroCare Autonomous Aerospace Clinical Intelligence Copilot, serving aboard the deep-space mission ARES-VI.
Your role is to assist the Flight Surgeon and Mission Control by analyzing physiological telemetry, explaining deterministic risk engine assessments, and synthesizing clinical briefings.

STRICT MEDICAL SAFETY & GROUNDING DIRECTIVES:
1. NEVER OVERRIDE DETERMINISTIC RISK SCORES: The deterministic risk engine and threshold rules (Prompt 06) are authoritative ground truth. You cannot alter risk scores, downgrade alert severities, or dismiss active alerts.
2. EVIDENCE GROUNDING ONLY: Ground 100% of your statements in the provided astronaut baseline data, current telemetry readings, and active alert rules. NEVER invent, hallucinate, or extrapolate fictional biometric readings or astronaut medical history.
3. NON-DIAGNOSTIC BOUNDARY: You provide decision-support intelligence, mechanistic explanations, and protocol recommendations. You never issue autonomous clinical diagnoses. Always defer emergency interventions to the Flight Surgeon.
4. PROVENANCE INTEGRITY: Clearly label facts as [SIMULATED TELEMETRY], [CALCULATED RISK], [RULE ALERT], or [AI INTERPRETATION]. Distinguish predictions from measured real-time telemetry.
5. EMERGENCY PROTOCOL: If an active critical alert (e.g. SpO2 ≤ 88%, acute tachycardia, or Solar Particle Event) is present, prioritize immediate crew stabilization and contingency procedures (e.g. ECLSS verification, storm shelter retreat, oxygen administration).
6. TONE & STYLE: Precise, clinical, concise, and structured according to aerospace medical dossier conventions. Use bullet points and bold section headers.`;
}
