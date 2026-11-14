/**
 * AstroCare Security Auditor
 * Performs static security checks on environment variables,
 * input sanitization, XSS/HTML rendering safeguards, and error disclosure prevention.
 */

export interface SecurityAuditResult {
  passed: boolean;
  issuesCount: number;
  criticalIssues: string[];
  highIssues: string[];
  mediumIssues: string[];
  recommendations: string[];
}

export class SecurityAuditor {
  /**
   * Check environment configuration for insecure exposure of backend secrets in client bundles
   */
  public static auditEnvironmentVariables(envObj: Record<string, string | undefined>): {
    hasExposedSecrets: boolean;
    leaks: string[];
  } {
    const leaks: string[] = [];
    const sensitiveNames = [
      'GEMINI_API_KEY',
      'SUPABASE_SERVICE_ROLE_KEY',
      'AWS_SECRET_ACCESS_KEY',
      'DATABASE_URL',
      'PRIVATE_KEY',
      'JWT_SECRET',
    ];

    for (const [key, val] of Object.entries(envObj)) {
      if (!val) continue;

      // In Vite, variables prefixed with VITE_ are bundled into client-side JS!
      for (const sensitive of sensitiveNames) {
        if (key.includes(sensitive) && key.startsWith('VITE_')) {
          leaks.push(
            `CRITICAL VULNERABILITY: Sensitive secret "${key}" is exposed to the browser bundle via VITE_ prefix. Move to secure backend.`
          );
        }
      }
    }

    return {
      hasExposedSecrets: leaks.length > 0,
      leaks,
    };
  }

  /**
   * Verify text input does not contain malicious Cross-Site Scripting (XSS) payloads
   */
  public static validateInputSanitization(input: string): { isSafe: boolean; detectedThreats: string[] } {
    const threats: string[] = [];
    const xssPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript\s*:/gi,
      /onerror\s*=/gi,
      /onload\s*=/gi,
      /<iframe\b/gi,
      /eval\s*\(/gi,
    ];

    for (const pat of xssPatterns) {
      if (pat.test(input)) {
        threats.push(`Malicious injection pattern detected: ${pat.source}`);
      }
    }

    // SQL / Query injection heuristics
    const sqlPatterns = [/(\b(UNION\s+ALL|SELECT\s+.*\s+FROM|DROP\s+TABLE|INSERT\s+INTO)\b)/gi];
    for (const pat of sqlPatterns) {
      if (pat.test(input)) {
        threats.push(`Potential SQL injection token detected: ${pat.source}`);
      }
    }

    return {
      isSafe: threats.length === 0,
      detectedThreats: threats,
    };
  }

  /**
   * Check error message for sensitive path disclosure or credential leakage
   */
  public static sanitizeErrorMessage(error: Error | string): { isSafe: boolean; sanitized: string } {
    const raw = typeof error === 'string' ? error : `${error.message}\n${error.stack || ''}`;
    let isSafe = true;

    // Redact Bearer tokens
    let sanitized = raw.replace(/Bearer\s+[A-Za-z0-9\-_.]+/gi, () => {
      isSafe = false;
      return 'Bearer [REDACTED]';
    });

    // Redact password queries
    sanitized = sanitized.replace(/(password|secret|apikey)=[^&\s]+/gi, () => {
      isSafe = false;
      return '$1=[REDACTED]';
    });

    return {
      isSafe,
      sanitized,
    };
  }
}
