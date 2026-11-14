/**
 * AstroCare AI Response & Grounding Validator
 * Validates AI safety, anti-hallucination, evidence grounding,
 * deterministic alert preservation, and medical boundary enforcement.
 */

import {
  HealthContextInput,
  AIResponsePayload,
  AIGroundingValidationResult,
} from '../../types/ai';

export class AIResponseValidator {
  private static PROHIBITED_DIAGNOSTIC_PATTERNS = [
    /\b(i\s+diagnose|patient\s+has\s+been\s+diagnosed\s+with|confirmed\s+diagnosis\s+of)\b/i,
    /\b(prescribe|administer\s+\d+\s*(mg|ml|mcg)|take\s+\d+\s*(tablets|pills))\b/i,
    /\b(cure|definitively\s+rules\s+out)\b/i,
  ];

  /**
   * Validate AI response against input context
   */
  public static validateResponse(
    inputContext: HealthContextInput,
    response: AIResponsePayload
  ): AIGroundingValidationResult {
    const unsupportedClaims: string[] = [];
    const hallucinatedValues: Array<{ field: string; inventedValue: unknown }> = [];
    const downgradedAlerts: string[] = [];
    const prohibitedDiagnosticLanguageDetected: string[] = [];

    // 1. Provenance & Fallback Integrity Check
    let provenanceValid = true;
    if (response.provenance.deterministicFallbackInvoked) {
      if (response.sourceModel !== 'DETERMINISTIC_FALLBACK') {
        provenanceValid = false;
        unsupportedClaims.push(
          'CRITICAL SAFETY VIOLATION: Deterministic fallback was triggered, but response sourceModel was labelled as Gemini.'
        );
      }
    } else {
      if (response.sourceModel === 'DETERMINISTIC_FALLBACK') {
        provenanceValid = false;
        unsupportedClaims.push('Response marked as fallback, but fallback flag was false.');
      }
    }

    // 2. Check for Hallucinated Numbers / Values in Clinical Summary
    const textBlob = `${response.clinicalReasoningSummary} ${response.highlightedObservations.join(' ')}`;

    // Extract numbers followed by biomedical units
    const measurementRegex = /(\d+(?:\.\d+)?)\s*(bpm|mmHg|%|degC|degF|breaths\/min|mGy|Gy|mSv|Sv|ug\/dL|ng\/mL|U\/L)/gi;
    let match: RegExpExecArray | null;

    while ((match = measurementRegex.exec(textBlob)) !== null) {
      const numVal = parseFloat(match[1]);
      const unit = match[2];

      // Verify this number exists in the input context
      let foundInContext = false;

      // Check telemetrySummary
      if (inputContext.telemetrySummary) {
        for (const metricData of Object.values(inputContext.telemetrySummary)) {
          if (
            Math.abs(metricData.value - numVal) < 0.05 &&
            metricData.unit.toLowerCase() === unit.toLowerCase()
          ) {
            foundInContext = true;
            break;
          }
        }
      }

      // Check lab biomarkers
      if (!foundInContext && inputContext.recentLabBiomarkers) {
        for (const labData of Object.values(inputContext.recentLabBiomarkers)) {
          if (
            Math.abs(labData.value - numVal) < 0.05 &&
            labData.unit.toLowerCase() === unit.toLowerCase()
          ) {
            foundInContext = true;
            break;
          }
        }
      }

      if (!foundInContext) {
        hallucinatedValues.push({
          field: `${unit} measurement`,
          inventedValue: `${numVal} ${unit}`,
        });
      }
    }

    // 3. Alert Downgrade & Preservation Check
    // If input had active alerts, AI must not claim everything is nominal or drop them
    const inputAlerts = inputContext.activeDeterministicAlerts || [];
    if (inputAlerts.length > 0) {
      const lowerText = textBlob.toLowerCase();
      if (
        lowerText.includes('all nominal') ||
        lowerText.includes('no anomalies detected') ||
        response.riskSeverityAssessment === 'LOW'
      ) {
        downgradedAlerts.push(
          `Input context had ${inputAlerts.length} active alert(s) [${inputAlerts.join(', ')}], but AI assessed risk as LOW or asserted all nominal.`
        );
      }
    }

    // 4. Prohibited Diagnostic & Prescription Language Check
    for (const pattern of this.PROHIBITED_DIAGNOSTIC_PATTERNS) {
      if (pattern.test(textBlob)) {
        const matchedStr = textBlob.match(pattern)?.[0] || 'diagnostic phrase';
        prohibitedDiagnosticLanguageDetected.push(
          `Detected autonomous medical diagnostic/prescribing phrasing: "${matchedStr}". AstroCare AI must act as operational support only.`
        );
      }
    }

    // 5. Missing Measurements Identification
    // If input had no telemetry or missing metrics, check if AI acknowledged it
    const telemetryKeys = Object.keys(inputContext.telemetrySummary || {});
    let missingMeasurementsIdentified = true;
    if (telemetryKeys.length === 0) {
      const lower = textBlob.toLowerCase();
      if (!lower.includes('missing') && !lower.includes('no telemetry') && !lower.includes('unavailable')) {
        missingMeasurementsIdentified = false;
        unsupportedClaims.push('Input had zero telemetry metrics, but AI did not identify missing measurements.');
      }
    }

    // 6. Citations Validation
    if (response.citations) {
      for (const citation of response.citations) {
        if (!citation.identifier || citation.identifier.trim() === '') {
          unsupportedClaims.push('Citation provided without authoritative identifier.');
        }
        if (citation.confidenceScore < 0.5) {
          unsupportedClaims.push(`Low-confidence citation: ${citation.identifier} (${citation.confidenceScore}).`);
        }
      }
    }

    // Calculate Grounding Score
    let score = 100;
    if (!provenanceValid) score -= 30;
    score -= hallucinatedValues.length * 20;
    score -= downgradedAlerts.length * 25;
    score -= prohibitedDiagnosticLanguageDetected.length * 25;
    score -= unsupportedClaims.length * 15;
    if (!missingMeasurementsIdentified) score -= 15;

    score = Math.max(0, Math.min(100, score));
    const isFullyGrounded =
      provenanceValid &&
      hallucinatedValues.length === 0 &&
      downgradedAlerts.length === 0 &&
      prohibitedDiagnosticLanguageDetected.length === 0 &&
      unsupportedClaims.length === 0 &&
      missingMeasurementsIdentified;

    return {
      isFullyGrounded,
      unsupportedClaims,
      hallucinatedValues,
      missingMeasurementsIdentified,
      downgradedAlerts,
      prohibitedDiagnosticLanguageDetected,
      provenanceValid,
      score,
    };
  }
}
