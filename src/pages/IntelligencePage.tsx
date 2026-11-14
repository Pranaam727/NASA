import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { useAIIntelligence } from '@/features/ai/hooks/useAIIntelligence';
import { MedicalSafetyBanner } from '@/features/ai/components/MedicalSafetyBanner';
import { AIStatusBanner } from '@/features/ai/components/AIStatusBanner';
import { AstronautHealthSummaryCard } from '@/features/ai/components/AstronautHealthSummaryCard';
import { AnomalyExplanationPanel } from '@/features/ai/components/AnomalyExplanationPanel';
import { HealthTrendInterpreter } from '@/features/ai/components/HealthTrendInterpreter';
import { AIConversationConsole } from '@/features/ai/components/AIConversationConsole';
import { CopilotOverview } from '@/features/ai/components/CopilotOverview';
import { HealthSituationBrief } from '@/features/ai/components/HealthSituationBrief';
import { ClinicalInvestigation } from '@/features/ai/components/ClinicalInvestigation';
import { MultiMetricAnalysis } from '@/features/ai/components/MultiMetricAnalysis';
import { InvestigationReportView } from '@/features/ai/components/InvestigationReport';
import { FollowUpChecklist } from '@/features/ai/components/FollowUpChecklist';
import { CompositeRiskGauge } from '@/features/analytics/components/CompositeRiskGauge';
import { BaselineComparisonMatrix } from '@/features/analytics/components/BaselineComparisonMatrix';
import { ActiveAlertsList } from '@/features/analytics/components/ActiveAlertsList';
import {
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  User,
  LayoutDashboard,
  FileCheck2,
  FolderKanban,
  GitCompare,
  FileText,
  ListTodo,
} from 'lucide-react';

type TabType =
  | 'OVERVIEW'
  | 'SITUATION_BRIEF'
  | 'INVESTIGATIONS'
  | 'MULTI_METRIC'
  | 'REPORTS'
  | 'FOLLOW_UP'
  | 'CONVERSATION'
  | 'LEGACY_ANOMALIES'
  | 'LEGACY_TRENDS';

export const IntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('OVERVIEW');

  const {
    astronauts,
    selectedAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    timeRange,
    setTimeRange,
    summary,
    trends,
    anomalyExplanation,
    selectedAlertId,
    messages,
    isLoadingSummary,
    isLoadingChat,
    systemOverview,
    setProviderMode,
    refreshSummary,
    refreshTrends,
    explainAnomaly,
    askQuestion,
    clearChat,
    isStreaming,
    activeAlerts,
    assessment,

    // Prompt 08 Extensions
    copilotOverview,
    situationBrief,
    investigations,
    selectedInvestigation,
    setSelectedInvestigation,
    reports,
    checklistItems,
    multiMetricResult,
    isLoadingCopilot,
    refreshCopilotOverview,
    createInvestigation,
    runMultiMetricAnalysis,
    toggleChecklistItem,
    addChecklistItem,
  } = useAIIntelligence('ASTRO-01');

  const astroName = selectedAstronaut?.profile?.full_name || selectedAstronautId;
  const isFallback = systemOverview.currentMode === 'DETERMINISTIC_FALLBACK';

  const handleRefreshAll = () => {
    refreshSummary(true);
    refreshTrends(true);
    refreshCopilotOverview(true);
  };

  return (
    <PageContainer maxWidth="wide">
      {/* 1. Header */}
      <PageHeader
        title="AI Biomedical Intelligence & Clinical Copilot"
        subtitle="Mission medical decision-support, deep multi-metric reasoning, structured investigations, and authoritative checklists"
        badge={
          <div className="flex items-center space-x-2">
            <StatusIndicator
              status={isStreaming ? 'NOMINAL' : 'INFO'}
              label={isStreaming ? '1HZ TELEMETRY LINKED' : 'STREAM STANDBY'}
              pulse={isStreaming}
            />
            <span
              className={`font-mono text-[9px] px-2 py-0.5 rounded-sm border uppercase font-bold ${
                isFallback
                  ? 'bg-[#B89A58]/15 text-[#7A6643] border-[#B89A58]/40'
                  : 'bg-astro-status-healthy/15 text-astro-status-healthy border-astro-status-healthy/40'
              }`}
            >
              {isFallback ? 'DETERMINISTIC FALLBACK' : 'GEMINI PROXY'}
            </span>
          </div>
        }
        metadata={[
          { label: 'Mission', value: 'ARES-VI' },
          { label: 'Subject', value: `${selectedAstronaut?.profile?.callsign || 'CREW'} (${astroName})` },
          { label: 'AI Mode', value: isFallback ? 'Deterministic Rule Engine' : 'Gemini Live Proxy' },
          { label: 'Decision Role', value: 'Physician Support (Non-Autonomous)' },
        ]}
      />

      {/* 2. Medical Safety Directives Banner */}
      <MedicalSafetyBanner />

      {/* 3. AI System Overview & Mode Banner */}
      <AIStatusBanner
        overview={systemOverview}
        onModeChange={setProviderMode}
        onRefresh={handleRefreshAll}
        isLoading={isLoadingSummary || isLoadingCopilot}
      />

      {/* 4. Crew Selector Strip */}
      <div className="bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <User className="w-4 h-4 text-astro-text-secondary" />
          <span className="text-astro-text-secondary uppercase">Monitored Subject:</span>
          <span className="font-bold text-astro-text-primary">{astroName}</span>
          <span className="text-[10px] text-astro-text-secondary">({selectedAstronautId})</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {astronauts.map((astro) => {
            const isSelected = astro.id === selectedAstronautId;
            return (
              <button
                key={astro.id}
                onClick={() => setSelectedAstronautId(astro.id)}
                className={`font-mono text-[10px] px-2.5 py-1 rounded-sm border transition-all ${
                  isSelected
                    ? 'bg-astro-sage/20 border-astro-sage text-astro-text-primary font-bold'
                    : 'border-astro-border-hairline text-astro-text-secondary hover:border-astro-sage/30 hover:bg-astro-bg-subtle'
                }`}
              >
                {astro.profile?.callsign || astro.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Navigation Tab Strip — Strict P08 Order: Overview → Situation Brief → Investigations → Multi-Metric Analysis → Reports → Follow-up Checklist → Conversation */}
      <div className="flex border-b border-astro-border-hairline font-mono text-xs overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'COPILOT OVERVIEW', icon: LayoutDashboard },
          { id: 'SITUATION_BRIEF', label: 'SITUATION BRIEF', icon: FileCheck2 },
          { id: 'INVESTIGATIONS', label: `INVESTIGATIONS (${investigations.length})`, icon: FolderKanban },
          { id: 'MULTI_METRIC', label: 'MULTI-METRIC ANALYSIS', icon: GitCompare },
          { id: 'REPORTS', label: `REPORTS (${reports.length})`, icon: FileText },
          { id: 'FOLLOW_UP', label: `CHECKLIST (${checklistItems.length})`, icon: ListTodo },
          { id: 'CONVERSATION', label: 'CLINICAL COPILOT CHAT', icon: MessageSquare },
          { id: 'LEGACY_ANOMALIES', label: `ANOMALIES (${activeAlerts.length})`, icon: AlertTriangle },
          { id: 'LEGACY_TRENDS', label: 'TRENDS', icon: TrendingUp },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as TabType)}
            className={`flex items-center space-x-2 px-3.5 py-2.5 font-bold border-b-2 -mb-px transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-astro-sage text-astro-text-primary bg-astro-bg-subtle/50'
                : 'border-transparent text-astro-text-secondary hover:text-astro-text-primary'
            }`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* 6. Active Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CopilotOverview overview={copilotOverview} isLoading={isLoadingCopilot} />
            <AstronautHealthSummaryCard summary={summary} isLoading={isLoadingSummary} />
          </div>
          <div className="space-y-6">
            <CompositeRiskGauge assessment={assessment} />
            <FollowUpChecklist
              items={checklistItems.slice(0, 4)}
              onToggleItem={toggleChecklistItem}
              onAddItem={addChecklistItem}
            />
          </div>
        </div>
      )}

      {activeTab === 'SITUATION_BRIEF' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HealthSituationBrief
              brief={situationBrief}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              isLoading={isLoadingCopilot}
            />
            <BaselineComparisonMatrix comparisons={assessment?.baselineComparisons} />
          </div>
          <div className="space-y-6">
            <CompositeRiskGauge assessment={assessment} />
            <AnomalyExplanationPanel
              alerts={activeAlerts}
              selectedAlertId={selectedAlertId}
              onSelectAlert={explainAnomaly}
              explanation={anomalyExplanation}
            />
          </div>
        </div>
      )}

      {activeTab === 'INVESTIGATIONS' && (
        <div>
          <ClinicalInvestigation
            investigations={investigations}
            selectedInvestigation={selectedInvestigation}
            onSelectInvestigation={setSelectedInvestigation}
            onCreateInvestigation={createInvestigation}
          />
        </div>
      )}

      {activeTab === 'MULTI_METRIC' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MultiMetricAnalysis
              result={multiMetricResult}
              onRunAnalysis={runMultiMetricAnalysis}
            />
          </div>
          <div className="space-y-6">
            <CompositeRiskGauge assessment={assessment} />
            <AstronautHealthSummaryCard summary={summary} isLoading={isLoadingSummary} />
          </div>
        </div>
      )}

      {activeTab === 'REPORTS' && (
        <div className="space-y-6">
          <InvestigationReportView reports={reports} />
        </div>
      )}

      {activeTab === 'FOLLOW_UP' && (
        <div className="space-y-6">
          <FollowUpChecklist
            items={checklistItems}
            onToggleItem={toggleChecklistItem}
            onAddItem={addChecklistItem}
          />
        </div>
      )}

      {activeTab === 'CONVERSATION' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AIConversationConsole
              messages={messages}
              onSendMessage={askQuestion}
              onClearChat={clearChat}
              isLoading={isLoadingChat}
              astronautName={astroName}
            />
          </div>
          <div className="space-y-6">
            <CompositeRiskGauge assessment={assessment} />
            <AstronautHealthSummaryCard summary={summary} isLoading={isLoadingSummary} />
          </div>
        </div>
      )}

      {activeTab === 'LEGACY_ANOMALIES' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AnomalyExplanationPanel
              alerts={activeAlerts}
              selectedAlertId={selectedAlertId}
              onSelectAlert={explainAnomaly}
              explanation={anomalyExplanation}
            />
            <BaselineComparisonMatrix comparisons={assessment?.baselineComparisons} />
          </div>
          <div className="space-y-6">
            <CompositeRiskGauge assessment={assessment} />
            <ActiveAlertsList
              alerts={activeAlerts}
              onAcknowledge={async () => {}}
              onResolve={async () => {}}
            />
          </div>
        </div>
      )}

      {activeTab === 'LEGACY_TRENDS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <HealthTrendInterpreter
              trends={trends}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
            />
          </div>
          <div className="space-y-6">
            <CompositeRiskGauge assessment={assessment} />
            <AstronautHealthSummaryCard summary={summary} isLoading={isLoadingSummary} />
          </div>
        </div>
      )}
    </PageContainer>
  );
};
