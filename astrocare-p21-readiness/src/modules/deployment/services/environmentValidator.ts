// ============================================================================
// AstroCare Environment Configuration & Secret Validator Service
// Safe client/server environment checks with zero credential leakage.
// ============================================================================

import { EnvironmentValidationResult } from '../types';
import { ENVIRONMENT_SPECS } from '../data/environmentSpecs';

export type EnvironmentProfile = 'development' | 'staging' | 'production';

export function maskSecretValue(value: string | undefined): string {
  if (!value) return '(not set)';
  if (value.length <= 8) return '****';
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export function validateEnvironmentVariables(
  profile: EnvironmentProfile = 'development',
  customValues?: Record<string, string>
): EnvironmentValidationResult[] {
  // Read from Vite environment or provided overrides
  const envSource = customValues || (typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {});

  return ENVIRONMENT_SPECS.map(spec => {
    // Look up directly or with VITE_ prefix for frontend-safe vars
    const rawVal = envSource[spec.key] || envSource[`VITE_${spec.key}`];
    const isPresent = Boolean(rawVal && String(rawVal).trim().length > 0);
    const valString = isPresent ? String(rawVal).trim() : '';

    let formatValid = false;
    let detectedFormat = isPresent ? 'Detected' : 'Missing';

    if (isPresent) {
      if (spec.expectedPattern) {
        formatValid = spec.expectedPattern.test(valString);
        detectedFormat = formatValid ? 'Matches expected pattern' : 'Pattern mismatch';
      } else {
        formatValid = true;
        detectedFormat = 'Valid string';
      }
    }

    let status: 'valid' | 'missing' | 'invalid_format' | 'mock_active';
    let recommendation = '';

    if (isPresent && formatValid) {
      status = 'valid';
      recommendation = 'Configuration is active and properly structured.';
    } else if (isPresent && !formatValid) {
      status = 'invalid_format';
      recommendation = `Format does not match required structure: ${spec.formatDescription}.`;
    } else {
      // Not present
      if (spec.defaultMockAllowed) {
        status = 'mock_active';
        recommendation = `Variable absent. Built-in mock provider / simulation mode active. Safe for demonstration.`;
      } else if (spec.required) {
        status = 'missing';
        recommendation = `Required configuration missing for ${profile} profile. Must be supplied before live flight operations.`;
      } else {
        status = 'missing';
        recommendation = `Optional variable not configured. Default internal fallback utilized.`;
      }
    }

    return {
      key: spec.key,
      description: spec.description,
      required: spec.required,
      isSecret: spec.isSecret,
      present: isPresent,
      formatValid,
      detectedFormat,
      expectedFormat: spec.formatDescription,
      profile,
      status,
      recommendation
    };
  });
}
