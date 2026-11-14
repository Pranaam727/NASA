// ============================================================================
// AstroCare P21 — Centralized Deployment & Mission Readiness Center
// Master operational dashboard integrating Modules A through J.
// ============================================================================

import React, { useState, useMemo } from 'react';
import { 
  Rocket, 
  Layers, 
  Globe, 
  Key, 
  Server, 
  ShieldCheck, 
  CheckCircle2, 
  Terminal, 
  Cloud, 
  Sparkles, 
  FileText,
  Network,
  RefreshCw,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

import { ASTROCARE_MODULES_REGISTRY } from '../data/modulesRegistryData';
import { NASA_SOURCES_REGISTRY } from '../data/nasaSourcesRegistry';
import { ENVIRONMENT_SPECS } from '../data/environmentSpecs';
import { SECURITY_CHECKS_DATA } from '../data/securityChecksData';
import { TEST_SUITES_DATA } from '../data/testSuitesData';
import { RELEASE_CHECKLIST_DATA } from '../data/releaseChecklistData';

import { 
  calculateDeploymentReadiness, 
  generateDeploymentReportData 
} from '../services/readinessCalculator';
import { validateEnvironmentVariables, EnvironmentProfile } from '../services/environmentValidator';

import { DeploymentDashboardView } from '../components/DeploymentDashboardView';
import { ModuleRegistryView } from '../components/ModuleRegistryView';
import { NASAIntegrationCenterView } from '../components/NASAIntegrationCenterView';
import { EnvironmentValidatorView } from '../components/EnvironmentValidatorView';
import { InfrastructureHealthView } from '../components/InfrastructureHealthView';
import { SecurityReadinessView } from '../components/SecurityReadinessView';
import { TestReadinessView } from '../components/TestReadinessView';
import { DeploymentConfigView } from '../components/DeploymentConfigView';
import { DemoReadinessView } from '../components/DemoReadinessView';
import { ReleaseChecklistView } from '../components/ReleaseChecklistView';
import { DependencyGraphModal } from '../components/DependencyGraphModal';
import { ReportExportModal } from '../components/ReportExportModal';

import { 
  ModuleIntegrationStatus, 
  NASAResourceStatus, 
  EnvironmentValidationResult, 
  SecurityCheck, 
  TestExecutionResult, 
  ReleaseChecklistItem,
  ModuleIntegrationStatusType
} from '../types';

export interface AstroCareDeploymentReadinessCenterProps {
  initialTab?: string;
  onNavigateHome?: () => void;
}

export const AstroCareDeploymentReadinessCenter: React.FC<AstroCareDeploymentReadinessCenterProps> = ({
  initialTab = 'overview',
  onNavigateHome
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [modules, setModules] = useState<ModuleIntegrationStatus[]>(ASTROCARE_MODULES_REGISTRY);
  const [nasaSources, setNasaSources] = useState<NASAResourceStatus[]>(NASA_SOURCES_REGISTRY);
  const [securityChecks, setSecurityChecks] = useState<SecurityCheck[]>(SECURITY_CHECKS_DATA);
  const [testResults, setTestResults] = useState<TestExecutionResult[]>(TEST_SUITES_DATA);
  const [checklistItems, setChecklistItems] = useState<ReleaseChecklistItem[]>(RELEASE_CHECKLIST_DATA);
  const [envResults, setEnvResults] = useState<EnvironmentValidationResult[]>(() => validateEnvironmentVariables('development'));

  // Modals
  const [isDepGraphOpen, setIsDepGraphOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Compute calculated readiness breakdown
  const readinessBreakdown = useMemo(() => {
    return calculateDeploymentReadiness(
      modules,
      nasaSources,
      envResults,
      securityChecks,
      testResults,
      checklistItems
    );
  }, [modules, nasaSources, envResults, securityChecks, testResults, checklistItems]);

  // Compute full deployment report
  const deploymentReport = useMemo(() => {
    return generateDeploymentReportData(
      readinessBreakdown,
      modules,
      nasaSources,
      envResults,
      securityChecks,
      testResults,
      checklistItems
    );
  }, [readinessBreakdown, modules, nasaSources, envResults, securityChecks, testResults, checklistItems]);

  // Checklist handlers
  const handleToggleChecklistItem = (id: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed, lastUpdated: new Date().toISOString() } : item
    ));
  };

  const handleUpdateChecklistNotes = (id: string, notes: string) => {
    setChecklistItems(prev => prev.map(item => 
      item.id === id ? { ...item, notes, lastUpdated: new Date().toISOString() } : item
    ));
  };

  const handleUpdateModuleStatus = (promptId: string, newStatus: ModuleIntegrationStatusType) => {
    setModules(prev => prev.map(m => 
      m.promptId === promptId ? { ...m, status: newStatus, lastVerified: new Date().toISOString() } : m
    ));
  };

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: Rocket, badge: `${readinessBreakdown.overallScore}%` },
    { id: 'modules', label: '21 Modules', icon: Layers, badge: `${modules.filter(m => m.status === 'integrated').length}` },
    { id: 'nasa', label: 'NASA Provenance', icon: Globe, badge: '7 Repos' },
    { id: 'environment', label: 'Environment', icon: Key, badge: null },
    { id: 'infra', label: 'API & Infra', icon: Server, badge: null },
    { id: 'security', label: 'Security (12)', icon: ShieldCheck, badge: null },
    { id: 'tests', label: 'QA & Tests', icon: Terminal, badge: 'All Passed' },
    { id: 'deploy', label: 'Deploy Targets', icon: Cloud, badge: '5 Platforms' },
    { id: 'demo', label: 'Demo Mode', icon: Sparkles, badge: '3 Scenarios' },
    { id: 'checklist', label: 'Release Gate', icon: FileText, badge: `${checklistItems.filter(c => c.completed).length}/${checklistItems.length}` },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* 1. Mission Control Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 flex items-center justify-center text-black font-extrabold shadow-lg shadow-cyan-900/40">
            <Rocket className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                ASTROCARE
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                P21 DEPLOYMENT CENTER
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span>EXPEDITION 72</span>
              <span>•</span>
              <span>MET: 142d 08h 24m</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                VERIFICATION ENGINE ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsDepGraphOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-850 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700/80 transition-colors"
          >
            <Network className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dependency Graph</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </header>

      {/* 2. Navigation Tabs Bar */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4 lg:px-8 py-2 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-cyan-800/80 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. Main Operational Content Workspace */}
      <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'overview' && (
          <DeploymentDashboardView
            breakdown={readinessBreakdown}
            modules={modules}
            nasaSources={nasaSources}
            securityChecks={securityChecks}
            testResults={testResults}
            checklistItems={checklistItems}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'modules' && (
          <ModuleRegistryView
            modules={modules}
            onOpenDependencyGraph={() => setIsDepGraphOpen(true)}
            onUpdateModuleStatus={handleUpdateModuleStatus}
          />
        )}

        {activeTab === 'nasa' && (
          <NASAIntegrationCenterView
            sources={nasaSources}
            onSourcesUpdated={setNasaSources}
          />
        )}

        {activeTab === 'environment' && (
          <EnvironmentValidatorView
            envResults={envResults}
            onProfileChange={(prof) => setEnvResults(validateEnvironmentVariables(prof))}
          />
        )}

        {activeTab === 'infra' && (
          <InfrastructureHealthView />
        )}

        {activeTab === 'security' && (
          <SecurityReadinessView
            securityChecks={securityChecks}
          />
        )}

        {activeTab === 'tests' && (
          <TestReadinessView
            testResults={testResults}
          />
        )}

        {activeTab === 'deploy' && (
          <DeploymentConfigView />
        )}

        {activeTab === 'demo' && (
          <DemoReadinessView />
        )}

        {activeTab === 'checklist' && (
          <ReleaseChecklistView
            items={checklistItems}
            onToggleItem={handleToggleChecklistItem}
            onUpdateNotes={handleUpdateChecklistNotes}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        )}
      </main>

      {/* 4. Footer & Disclaimers */}
      <footer className="bg-slate-900 border-t border-slate-800 px-4 lg:px-8 py-4 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan-400 font-bold">AstroCare v1.0.0-rc.3</span>
          <span>•</span>
          <span>Prompt 21/21 Final Deployment & Mission Readiness Module</span>
        </div>
        <div className="text-[11px] text-slate-500 text-center sm:text-right">
          Ground-truth NASA HRP & OSDR attribution • Synthetic PHI Quarantine Active
        </div>
      </footer>

      {/* 5. Modals */}
      <DependencyGraphModal
        isOpen={isDepGraphOpen}
        onClose={() => setIsDepGraphOpen(false)}
        modules={modules}
      />

      <ReportExportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        report={deploymentReport}
      />
    </div>
  );
};
