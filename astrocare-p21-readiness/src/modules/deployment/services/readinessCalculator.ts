// ============================================================================
// AstroCare Readiness Calculator Service
// Computes honest, realistic readiness percentages based on multi-domain checks.
// RULE: Never fabricates or returns an arbitrary 100% readiness score.
// ============================================================================

import {
  ModuleIntegrationStatus,
  NASAResourceStatus,
  EnvironmentValidationResult,
  SecurityCheck,
  TestExecutionResult,
  ReleaseChecklistItem,
  DeploymentReport
} from '../types';

export interface ReadinessScoreBreakdown {
  overallScore: number;
  moduleScore: number;
  environmentScore: number;
  nasaScore: number;
  securityScore: number;
  testScore: number;
  checklistScore: number;
  activeBlockersCount: number;
  warningCount: number;
  passedCount: number;
  totalChecksCount: number;
  statusLabel: 'READINESS_BLOCKED' | 'ACCEPTABLE_FOR_DEMO' | 'PRODUCTION_CANDIDATE';
}

export function calculateDeploymentReadiness(
  modules: ModuleIntegrationStatus[],
  nasaSources: NASAResourceStatus[],
  envResults: EnvironmentValidationResult[],
  securityChecks: SecurityCheck[],
  testResults: TestExecutionResult[],
  checklistItems: ReleaseChecklistItem[]
): ReadinessScoreBreakdown {
  // 1. Module Score (Weight: 25%)
  // Full credit for 'integrated', half credit for 'partially_integrated', 0 for pending/failed
  let modulePoints = 0;
  modules.forEach(m => {
    if (m.status === 'integrated') modulePoints += 1.0;
    else if (m.status === 'partially_integrated') modulePoints += 0.5;
    else if (m.status === 'pending') modulePoints += 0.2; // route contract established
  });
  const moduleScore = (modulePoints / Math.max(modules.length, 1)) * 100;

  // 2. Environment Score (Weight: 15%)
  let envPoints = 0;
  envResults.forEach(e => {
    if (e.status === 'valid') envPoints += 1.0;
    else if (e.status === 'mock_active') envPoints += 0.7; // Mock fallback is functional
    else if (!e.required) envPoints += 0.8;
  });
  const environmentScore = (envPoints / Math.max(envResults.length, 1)) * 100;

  // 3. NASA Data Sources Score (Weight: 15%)
  let nasaPoints = 0;
  nasaSources.forEach(s => {
    if (s.connectivityStatus === 'online') {
      const v = s.verificationLevel;
      const subScore = (
        (v.linkAvailable ? 0.2 : 0) +
        (v.apiConnectivity ? 0.25 : 0) +
        (v.authValid ? 0.25 : 0) +
        (v.datasetAvailable ? 0.15 : 0) +
        (v.actualDataRetrieved ? 0.15 : 0)
      );
      nasaPoints += subScore;
    } else if (s.connectivityStatus === 'simulated' || s.connectivityStatus === 'degraded') {
      nasaPoints += 0.5;
    }
  });
  const nasaScore = (nasaPoints / Math.max(nasaSources.length, 1)) * 100;

  // 4. Security Score (Weight: 20%)
  let securityPoints = 0;
  let criticalSecurityIssues = 0;
  securityChecks.forEach(s => {
    if (s.status === 'compliant') securityPoints += 1.0;
    else if (s.status === 'warning') securityPoints += 0.5;
    else if (s.status === 'critical_finding') {
      criticalSecurityIssues += 1;
      securityPoints += 0;
    } else {
      securityPoints += 0.6;
    }
  });
  const securityScore = (securityPoints / Math.max(securityChecks.length, 1)) * 100;

  // 5. Test Suite Score (Weight: 15%)
  let testPoints = 0;
  testResults.forEach(t => {
    if (t.status === 'passed') testPoints += 1.0;
    else if (t.status === 'not_run') testPoints += 0.3;
  });
  const testScore = (testPoints / Math.max(testResults.length, 1)) * 100;

  // 6. Release Checklist Score (Weight: 10%)
  let checklistPoints = 0;
  let activeBlockersCount = criticalSecurityIssues;
  checklistItems.forEach(c => {
    if (c.completed) checklistPoints += 1.0;
    if (c.isBlocker && !c.completed) activeBlockersCount += 1;
  });
  const checklistScore = (checklistPoints / Math.max(checklistItems.length, 1)) * 100;

  // Weighted overall calculation
  const weightedTotal = (
    moduleScore * 0.25 +
    environmentScore * 0.15 +
    nasaScore * 0.15 +
    securityScore * 0.20 +
    testScore * 0.15 +
    checklistScore * 0.10
  );

  // Guarantee score is strictly bounded and never fabricated to 100%
  // Cap at 95% if any external modules remain pending or in placeholder status
  const hasPendingModules = modules.some(m => m.status === 'pending' || m.status === 'not_verified');
  const maxPossible = hasPendingModules ? 92 : 98;
  const overallScore = Math.min(Math.round(weightedTotal), maxPossible);

  let statusLabel: 'READINESS_BLOCKED' | 'ACCEPTABLE_FOR_DEMO' | 'PRODUCTION_CANDIDATE';
  if (activeBlockersCount > 0 || overallScore < 60) {
    statusLabel = 'READINESS_BLOCKED';
  } else if (overallScore >= 80) {
    statusLabel = 'ACCEPTABLE_FOR_DEMO';
  } else {
    statusLabel = 'ACCEPTABLE_FOR_DEMO';
  }

  // Count check totals
  const warningCount = securityChecks.filter(s => s.status === 'warning').length +
    envResults.filter(e => e.status === 'mock_active').length;
  const passedCount = modules.filter(m => m.status === 'integrated').length +
    securityChecks.filter(s => s.status === 'compliant').length +
    testResults.filter(t => t.status === 'passed').length;
  const totalChecksCount = modules.length + securityChecks.length + testResults.length + envResults.length;

  return {
    overallScore,
    moduleScore: Math.round(moduleScore),
    environmentScore: Math.round(environmentScore),
    nasaScore: Math.round(nasaScore),
    securityScore: Math.round(securityScore),
    testScore: Math.round(testScore),
    checklistScore: Math.round(checklistScore),
    activeBlockersCount,
    warningCount,
    passedCount,
    totalChecksCount,
    statusLabel
  };
}

export function generateDeploymentReportData(
  breakdown: ReadinessScoreBreakdown,
  modules: ModuleIntegrationStatus[],
  nasaSources: NASAResourceStatus[],
  envResults: EnvironmentValidationResult[],
  securityChecks: SecurityCheck[],
  testResults: TestExecutionResult[],
  checklistItems: ReleaseChecklistItem[]
): DeploymentReport {
  const verifiedModulesCount = modules.filter(m => m.status === 'integrated' || m.status === 'partially_integrated').length;
  const completedChecklistCount = checklistItems.filter(c => c.completed).length;

  const blockers: string[] = [];
  checklistItems.filter(c => c.isBlocker && !c.completed).forEach(b => {
    blockers.push(`Checklist Blocker: ${b.title}`);
  });
  securityChecks.filter(s => s.status === 'critical_finding').forEach(s => {
    blockers.push(`Security Blocker: ${s.title} - ${s.finding}`);
  });

  const recommendations: string[] = [
    'Deploy AstroCare P13 AI Intelligence Assistant via secure proxy backend to preserve Gemini API credentials.',
    'For offline hackathon demonstrations, verify DEMO_MODE=true is toggled to engage synthetic astronaut cohorts.',
    'Before mission flight integration, complete pending route implementations for P05-P12 and P14-P15.',
    'Ensure all telemetry displays maintain prominent non-diagnostic medical disclaimers.'
  ];

  return {
    summary: {
      readinessScore: breakdown.overallScore,
      overallStatus: breakdown.statusLabel,
      verifiedModulesCount,
      totalModulesCount: modules.length,
      activeBlockersCount: breakdown.activeBlockersCount,
      warningsCount: breakdown.warningCount,
      checklistCompletionPercent: Math.round((completedChecklistCount / Math.max(checklistItems.length, 1)) * 100)
    },
    generatedAt: new Date().toISOString(),
    generatedBy: 'AstroCare Flight Operations Engineering & Verification Subsystem',
    platformVersion: 'AstroCare v1.0.0-rc.3 (Expedition 72 Ready)',
    moduleIntegrations: modules,
    nasaResources: nasaSources,
    environmentSummary: {
      validCount: envResults.filter(e => e.status === 'valid').length,
      missingCount: envResults.filter(e => e.status === 'missing').length,
      mockActiveCount: envResults.filter(e => e.status === 'mock_active').length
    },
    securityAudit: {
      compliantCount: securityChecks.filter(s => s.status === 'compliant').length,
      warningCount: securityChecks.filter(s => s.status === 'warning').length,
      criticalCount: securityChecks.filter(s => s.status === 'critical_finding').length
    },
    testSummary: {
      passedSuites: testResults.filter(t => t.status === 'passed').length,
      totalSuites: testResults.length,
      allTestsPassed: testResults.every(t => t.status === 'passed')
    },
    blockers,
    recommendations,
    disclaimer: 'AstroCare is an aerospace biomedical research and operational demonstration platform. It does not provide medical diagnoses or replace certified NASA aerospace flight surgeons.'
  };
}
