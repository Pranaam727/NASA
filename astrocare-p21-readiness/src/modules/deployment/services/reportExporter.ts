// ============================================================================
// AstroCare Deployment Report Exporter Service
// Formats deployment readiness reports into Markdown, JSON, and CSV formats.
// ============================================================================

import { DeploymentReport } from '../types';

export function formatReportAsMarkdown(report: DeploymentReport): string {
  const { summary } = report;
  const timestamp = new Date(report.generatedAt).toUTCString();

  return `# AstroCare Aerospace Biomedical Intelligence Platform
## Final Mission Deployment & Readiness Audit Report

- **Report Generated:** ${timestamp}
- **Platform Version:** ${report.platformVersion}
- **Authority:** ${report.generatedBy}
- **Overall Readiness Score:** ${summary.readinessScore}%
- **Operational Status:** ${summary.overallStatus}
- **Verified Modules:** ${summary.verifiedModulesCount} / ${summary.totalModulesCount}
- **Active Blockers:** ${summary.activeBlockersCount}
- **Advisory Warnings:** ${summary.warningsCount}
- **Release Checklist Progress:** ${summary.checklistCompletionPercent}%

---

### Executive Summary & Operational State
${summary.activeBlockersCount === 0 
  ? `> [!IMPORTANT]\n> Platform verification passed with a composite readiness score of **${summary.readinessScore}%**. The application is approved for **Hackathon Demonstration and Operational Staging**. External clinical modules (P05-P12, P14-P15) remain cleanly isolated as documented route contracts.`
  : `> [!WARNING]\n> Deployment blocked by ${summary.activeBlockersCount} unresolved critical issue(s). Resolve all checklist and security blockers before mission staging.`}

---

### 1. AstroCare Modules Integration Status (21 Modules)
| Prompt ID | Module Name | Category | Status | Route | Test Status |
|:---|:---|:---|:---|:---|:---|
${report.moduleIntegrations.map(m => `| \`${m.promptId}\` | ${m.name} | ${m.category} | **${m.status.toUpperCase()}** | \`${m.route}\` | ${m.testStatus} |`).join('\n')}

---

### 2. NASA Scientific Data Sources Connectivity
| Resource | Official URL | Category | Status | Auth | Provenance Tag |
|:---|:---|:---|:---|:---|:---|
${report.nasaResources.map(r => `| **${r.name}** | [Link](${r.officialUrl}) | ${r.category} | \`${r.connectivityStatus.toUpperCase()}\` | ${r.authRequirement} | \`${r.provenanceTag}\` |`).join('\n')}

---

### 3. Environment & Secrets Quarantine
- **Valid Variables:** ${report.environmentSummary.validCount}
- **Missing Variables:** ${report.environmentSummary.missingCount}
- **Mock Fallback Active:** ${report.environmentSummary.mockActiveCount}
- *Verification Rule:* Client-side bundle strictly quarantined against private API key leakage.

---

### 4. Security & Privacy Audit (OWASP / NASA-STD-2820)
- **Compliant Checks:** ${report.securityAudit.compliantCount}
- **Advisory Warnings:** ${report.securityAudit.warningCount}
- **Critical Findings:** ${report.securityAudit.criticalCount}

---

### 5. Automated Testing & Verification
- **Test Suites Passed:** ${report.testSummary.passedSuites} / ${report.testSummary.totalSuites}
- **All Tests Clean:** ${report.testSummary.allTestsPassed ? 'YES' : 'NO'}

---

### 6. Active Blockers & Remediation Actions
${report.blockers.length === 0 
  ? '_No active blockers detected._' 
  : report.blockers.map((b, i) => `${i + 1}. **BLOCKER:** ${b}`).join('\n')}

---

### 7. Recommendations for Flight Surgeons & DevOps
${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

---

> **NASA Scientific Disclaimer:**
> ${report.disclaimer}
`;
}

export function formatReportAsJSON(report: DeploymentReport): string {
  return JSON.stringify(report, null, 2);
}

export function formatReportAsCSV(report: DeploymentReport): string {
  const headers = ['Category', 'Identifier', 'Name', 'Status', 'Details'];
  const rows: string[][] = [headers];

  report.moduleIntegrations.forEach(m => {
    rows.push(['Module', m.promptId, `"${m.name.replace(/"/g, '""')}"`, m.status, `"${m.route}"`]);
  });

  report.nasaResources.forEach(r => {
    rows.push(['NASA Source', r.id, `"${r.name.replace(/"/g, '""')}"`, r.connectivityStatus, `"${r.officialUrl}"`]);
  });

  return rows.map(r => r.join(',')).join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
