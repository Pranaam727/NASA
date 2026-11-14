// ============================================================================
// AstroCare P21 — Deployment & Mission Readiness Module Export Index
// Clean standalone package exports for drop-in integration into master AstroCare.
// ============================================================================

export { AstroCareDeploymentReadinessCenter } from './pages/AstroCareDeploymentReadinessCenter';
export type { AstroCareDeploymentReadinessCenterProps } from './pages/AstroCareDeploymentReadinessCenter';

// Components
export { DeploymentDashboardView } from './components/DeploymentDashboardView';
export { ModuleRegistryView } from './components/ModuleRegistryView';
export { NASAIntegrationCenterView } from './components/NASAIntegrationCenterView';
export { EnvironmentValidatorView } from './components/EnvironmentValidatorView';
export { InfrastructureHealthView } from './components/InfrastructureHealthView';
export { SecurityReadinessView } from './components/SecurityReadinessView';
export { TestReadinessView } from './components/TestReadinessView';
export { DeploymentConfigView } from './components/DeploymentConfigView';
export { DemoReadinessView } from './components/DemoReadinessView';
export { ReleaseChecklistView } from './components/ReleaseChecklistView';
export { DependencyGraphModal } from './components/DependencyGraphModal';
export { ReportExportModal } from './components/ReportExportModal';
export { ReadinessGauge } from './components/ReadinessGauge';
export { StatusBadge, ProvenanceTag } from './components/StatusBadge';

// Services
export { 
  calculateDeploymentReadiness, 
  generateDeploymentReportData 
} from './services/readinessCalculator';
export type { ReadinessScoreBreakdown } from './services/readinessCalculator';

export { 
  validateEnvironmentVariables, 
  maskSecretValue 
} from './services/environmentValidator';
export type { EnvironmentProfile } from './services/environmentValidator';

export { 
  verifyNASAResourceConnectivity, 
  verifyAllNASAResources 
} from './services/nasaVerifier';

export { 
  pingServiceEndpoint, 
  INITIAL_INFRASTRUCTURE_HEALTH 
} from './services/infrastructureHealthService';

export { 
  formatReportAsMarkdown, 
  formatReportAsJSON, 
  formatReportAsCSV, 
  downloadFile 
} from './services/reportExporter';

// Datasets
export { ASTROCARE_MODULES_REGISTRY } from './data/modulesRegistryData';
export { NASA_SOURCES_REGISTRY } from './data/nasaSourcesRegistry';
export { ENVIRONMENT_SPECS } from './data/environmentSpecs';
export { SECURITY_CHECKS_DATA } from './data/securityChecksData';
export { TEST_SUITES_DATA } from './data/testSuitesData';
export { DEPLOYMENT_TARGETS_DATA } from './data/deploymentTargetsData';
export { DEMO_SCENARIOS_DATA } from './data/demoScenariosData';
export { RELEASE_CHECKLIST_DATA } from './data/releaseChecklistData';

// Types
export * from './types';
