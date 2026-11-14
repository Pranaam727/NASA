/**
 * AstroCare Secret Scanner
 * Scans text, source code files, configurations, and logs for leaked credentials,
 * API tokens, private keys, and sensitive PII.
 *
 * CRITICAL RULE: Never prints raw secrets into reports or output logs.
 */

export interface SecretFinding {
  patternName: string;
  maskedSnippet: string;
  line?: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
}

export class SecretScanner {
  // Regex definitions for secrets
  private static SECRET_PATTERNS: Array<{
    name: string;
    regex: RegExp;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    desc: string;
  }> = [
    {
      name: 'GOOGLE_GEMINI_API_KEY',
      regex: /AIza[0-9A-Za-z-_]{35}/g,
      severity: 'CRITICAL',
      desc: 'Google AI / Gemini API key detected.',
    },
    {
      name: 'GENERIC_API_KEY_OR_SECRET',
      regex: /(?:api_key|apikey|secret|token|password|auth_token)\s*[:=]\s*["']([A-Za-z0-9_\-]{16,})["']/gi,
      severity: 'HIGH',
      desc: 'Potential hardcoded API token or password assignment.',
    },
    {
      name: 'RSA_PRIVATE_KEY',
      regex: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/g,
      severity: 'CRITICAL',
      desc: 'Private RSA/Cryptographic key block detected.',
    },
    {
      name: 'JWT_BEARER_TOKEN',
      regex: /eyJ[A-Za-z0-9-_]{10,}\.eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]+/g,
      severity: 'HIGH',
      desc: 'JSON Web Token (JWT) detected in source or payload.',
    },
    {
      name: 'AWS_ACCESS_KEY_ID',
      regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/g,
      severity: 'CRITICAL',
      desc: 'Amazon Web Services Access Key ID detected.',
    },
    {
      name: 'SENSITIVE_MEDICAL_PII',
      regex: /(?:ssn|social_security|medical_record_number|mrn)\s*[:=]\s*["']?\d{3}-\d{2}-\d{4}["']?/gi,
      severity: 'HIGH',
      desc: 'Sensitive astronaut medical identification number or SSN detected.',
    },
  ];

  /**
   * Scan text content and return findings with masked secrets
   */
  public static scanContent(content: string): SecretFinding[] {
    const findings: SecretFinding[] = [];
    const lines = content.split('\n');

    for (const rule of this.SECRET_PATTERNS) {
      lines.forEach((lineText, idx) => {
        // Reset regex state
        rule.regex.lastIndex = 0;
        let match: RegExpExecArray | null;

        while ((match = rule.regex.exec(lineText)) !== null) {
          const rawSecret = match[0];
          const masked = this.maskSecret(rawSecret);

          findings.push({
            patternName: rule.name,
            maskedSnippet: `Line ${idx + 1}: ${lineText.replace(rawSecret, masked).trim()}`,
            line: idx + 1,
            severity: rule.severity,
            description: rule.desc,
          });
        }
      });
    }

    return findings;
  }

  /**
   * Safe masking function: shows only first 3 and last 2 characters
   */
  public static maskSecret(secret: string): string {
    if (secret.length <= 6) return '******';
    const start = secret.substring(0, 3);
    const end = secret.substring(secret.length - 2);
    const middle = '*'.repeat(Math.min(10, secret.length - 5));
    return `${start}${middle}${end}`;
  }
}
