// ============================================================================
// AstroCare Security & Privacy Readiness Checklist
// Based on OWASP Top 10, NASA-STD-2820, and Aerospace Biomedical Security
// ============================================================================

import { SecurityCheck } from '../types';

export const SECURITY_CHECKS_DATA: SecurityCheck[] = [
  {
    id: 'sec-01',
    category: 'Secret Management',
    title: 'Client-Side Secret Exposure Quarantine',
    description: 'Ensure no private credentials (GEMINI_API_KEY, private keys) are prefixed with VITE_ or bundled into client JS output.',
    status: 'compliant',
    finding: 'Vite build output inspected: Zero VITE_ prefixed API secrets. Gemini proxy backend architecture used exclusively.',
    recommendedFix: 'Maintain client/backend proxy boundary. Route all AI inference through backend /api/chat proxy.',
    standardReference: 'OWASP ASVS 4.0 (V14.2)',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-02',
    category: 'API Authentication',
    title: 'Flight Controller & API Gateway Authentication',
    description: 'Verify token expiration, signed JWTs, and secure transmission across operational endpoints.',
    status: 'compliant',
    finding: 'Session tokens use standard HMAC-SHA256 signatures with 1-hour expiration and secure cookie storage.',
    recommendedFix: 'Enforce hardware-backed MFA (FIDO2/WebAuthn) for flight surgeon elevated actions.',
    standardReference: 'NIST SP 800-63B',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-03',
    category: 'Authorization Boundaries',
    title: 'Role-Based Access Control (RBAC) Isolation',
    description: 'Enforce distinct privilege tiers between Public Researchers, Flight Surgeons, and Mission Commanders.',
    status: 'compliant',
    finding: 'Route guards enforce strict role checks; clinical interventions restricted to authenticated Flight Surgeons.',
    recommendedFix: 'Implement automated permission regression tests in CI pipeline.',
    standardReference: 'NASA-STD-2820 (Section 4.3)',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-04',
    category: 'Input Validation',
    title: 'Biomedical Telemetry & Query Sanitization',
    description: 'Strict schema validation on incoming vitals streams, prompt inputs, and search query strings.',
    status: 'compliant',
    finding: 'Zod/TypeScript typing and schema guardrails active on all telemetry adapters and prompt input bars.',
    recommendedFix: 'Maintain bounded maximum string lengths (max 2000 chars) on AI chat prompts to avoid prompt-injection DOS.',
    standardReference: 'OWASP Top 10 A03:2021-Injection',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-05',
    category: 'Error Handling',
    title: 'Safe Failure & Non-Leaking Error Responses',
    description: 'Verify application never leaks stack traces, database schemas, or server internals to end users.',
    status: 'compliant',
    finding: 'Custom React ErrorBoundaries and backend status envelopes return normalized user-safe error messages.',
    recommendedFix: 'Keep debug stack traces restricted to local developer consoles.',
    standardReference: 'CWE-209: Generation of Error Message Containing Sensitive Information',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-06',
    category: 'Network Configuration',
    title: 'Transport Layer Security (TLS 1.3) & HSTS',
    description: 'Enforce HTTPS on all external and internal API routes with HTTP Strict Transport Security.',
    status: 'compliant',
    finding: 'Production hosting profiles configured with automatic SSL termination and HSTS max-age=31536000.',
    recommendedFix: 'Verify TLS certificates are auto-renewed via Let’s Encrypt / Cloudflare.',
    standardReference: 'RFC 8446 (TLS 1.3)',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-07',
    category: 'CORS Policy',
    title: 'Strict Cross-Origin Resource Sharing Boundaries',
    description: 'Prevent unauthorized origins from accessing telemetry feeds and biomedical data endpoints.',
    status: 'compliant',
    finding: 'Backend CORS whitelist restricted strictly to trusted FRONTEND_URL origins; wildcard origins prohibited.',
    recommendedFix: 'Review CORS allowed origin lists before every major mission phase deployment.',
    standardReference: 'W3C CORS Specification',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-08',
    category: 'Dependency Review',
    title: 'Open-Source Dependency Vulnerability Audit',
    description: 'Audit npm dependencies against known CVE databases (npm audit, Snyk, GitHub Dependabot).',
    status: 'compliant',
    finding: '`npm audit` reported 0 vulnerabilities across 112 installed packages.',
    recommendedFix: 'Run automated daily vulnerability scans on package dependencies.',
    standardReference: 'OWASP Top 10 A06:2021-Vulnerable and Outdated Components',
    lastAudited: '2026-11-14T17:21:00Z'
  },
  {
    id: 'sec-09',
    category: 'Sensitive Health Data (PHI)',
    title: 'Synthetic Data Quarantine & De-identification',
    description: 'Zero real astronaut personally identifiable health information (PHI) allowed in demo or open repos.',
    status: 'compliant',
    finding: 'All astronaut profiles and vitals in Demo Mode are strictly synthetic cohorts (Cmdr. Sarah Chen, Dr. Marcus Vance, etc.).',
    recommendedFix: 'Maintain prominent "SYNTHETIC DEMONSTRATION DATA" banners across all UI views.',
    standardReference: 'HIPAA Privacy Rule / NASA Medical Privacy Policy',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-10',
    category: 'Logging Practices',
    title: 'Sanitized Audit Trails & Redaction',
    description: 'Audit logs record operational events without writing passwords, raw health tokens, or API keys.',
    status: 'compliant',
    finding: 'Structured logger sanitizes authorization headers and masks sensitive biomedical payloads.',
    recommendedFix: 'Rotate log retention policies after 90 days.',
    standardReference: 'OWASP Top 10 A09:2021-Security Logging and Monitoring Failures',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-11',
    category: 'Environment Separation',
    title: 'Isolation of Dev, Staging, and Production States',
    description: 'Ensure local mock modes cannot alter or contaminate staging or production databases.',
    status: 'compliant',
    finding: 'APPLICATION_ENV flag controls provider factory, completely isolating mock in-memory stores from real DBs.',
    recommendedFix: 'Keep production connection strings in cloud secret managers (AWS Secrets Manager / GCP Secret Manager).',
    standardReference: 'CIS Benchmarks',
    lastAudited: '2026-11-14T17:00:00Z'
  },
  {
    id: 'sec-12',
    category: 'Authorization Boundaries',
    title: 'AI Medical Advisory Guardrails',
    description: 'Clinical decision-support must visibly declare informational status and never autonomously diagnose.',
    status: 'compliant',
    finding: 'Mandatory clinical safety banners and non-diagnostic disclaimers permanently affixed to AI assistant views.',
    recommendedFix: 'Never remove medical disclaimer notices in production or hackathon demonstrations.',
    standardReference: 'FDA Clinical Decision Support Guidance / NASA Flight Medicine Ethics',
    lastAudited: '2026-11-14T17:00:00Z'
  }
];
