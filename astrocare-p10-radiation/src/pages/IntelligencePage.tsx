import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { useAIHealthAssistant } from '@/features/intelligence/hooks/useAIHealthAssistant';
import { ChatInterface } from '@/features/intelligence/components/ChatInterface';
import { IntelligenceSummaryCard } from '@/features/intelligence/components/IntelligenceSummaryCard';
import { PredictiveInsightsCard } from '@/features/intelligence/components/PredictiveInsightsCard';
import { RiskExplanationCard } from '@/features/intelligence/components/RiskExplanationCard';
import { ReportGeneratorModal } from '@/features/intelligence/components/ReportGeneratorModal';
import { SEED_ASTRONAUTS } from '@/data/seedData';
import { FileText, ShieldCheck, User } from 'lucide-react';

export const IntelligencePage: React.FC = () => {
  const {
    astronautId,
    currentAstronaut,
    groundedContext,
    messages,
    isLoading,
    predictiveInsights,
    riskExplanation,
    activeReport,
    setAstronaut,
    sendMessage,
    generateMissionReport,
    clearConversation,
    isSimulating,
  } = useAIHealthAssistant();

  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'CHAT' | 'MECHANISMS' | 'PREDICTIONS'>('CHAT');

  return (
    <PageContainer maxWidth="wide">
      {/* 1. Header with Metadata, Crew Selector, and Report Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="AI Health Intelligence Copilot"
          subtitle="Google Gemini 1.5 aerospace clinical intelligence, deterministic risk explanations, and predictive modeling"
          badge={
            <StatusIndicator
              status={groundedContext.deterministicRisk.riskLevel === 'CRITICAL' ? 'CRITICAL' : 'NOMINAL'}
              label={isSimulating ? 'LIVE GROUNDED COPILOT' : 'STANDBY GROUNDED'}
              pulse={isSimulating}
            />
          }
          metadata={[
            { label: 'Mission', value: 'ARES-VI' },
            { label: 'Subject', value: `${currentAstronaut.profile?.callsign}: ${currentAstronaut.profile?.full_name}` },
            { label: 'Intelligence Model', value: 'Gemini-1.5 Grounded' },
            { label: 'Non-Diagnostic', value: 'Safety Enforced' },
          ]}
        />

        {/* Action Controls: Crew Selector & Generate Dossier Button */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
          <div className="flex items-center space-x-2 bg-white border border-astro-border-hairline rounded-sm px-3 py-1.5 shadow-xs">
            <User className="w-4 h-4 text-astro-text-secondary" />
            <span className="font-mono text-[10px] text-astro-text-tertiary uppercase">SUBJECT:</span>
            <select
              value={astronautId}
              onChange={(e) => setAstronaut(e.target.value)}
              className="font-mono text-xs font-semibold bg-transparent text-astro-text-primary outline-none cursor-pointer"
            >
              {SEED_ASTRONAUTS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.profile?.callsign}: {a.profile?.full_name}
                </option>
              ))}
            </select>
          </div>

          <PrimaryButton
            size="md"
            icon={FileText}
            onClick={() => setIsReportModalOpen(true)}
          >
            GENERATE DOSSIER
          </PrimaryButton>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex border-b border-astro-border-hairline font-mono text-xs space-x-4">
        <button
          type="button"
          onClick={() => setActiveTab('CHAT')}
          className={`pb-2 transition-colors relative font-semibold ${
            activeTab === 'CHAT'
              ? 'text-astro-text-primary border-b-2 border-astro-text-primary'
              : 'text-astro-text-secondary hover:text-astro-text-primary'
          }`}
        >
          CONVERSATIONAL WORKBENCH
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PREDICTIONS')}
          className={`pb-2 transition-colors relative font-semibold ${
            activeTab === 'PREDICTIONS'
              ? 'text-astro-text-primary border-b-2 border-astro-text-primary'
              : 'text-astro-text-secondary hover:text-astro-text-primary'
          }`}
        >
          PREDICTIVE INSIGHTS ({predictiveInsights.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('MECHANISMS')}
          className={`pb-2 transition-colors relative font-semibold ${
            activeTab === 'MECHANISMS'
              ? 'text-astro-text-primary border-b-2 border-astro-text-primary'
              : 'text-astro-text-secondary hover:text-astro-text-primary'
          }`}
        >
          PATHOLOGICAL MECHANISMS
        </button>
      </div>

      {/* 3. Main Dashboard Layout (Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Conversational Workbench or Focused Views */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'CHAT' && (
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
              onClear={clearConversation}
              astronautCallsign={currentAstronaut.profile?.callsign || 'ASTRONAUT'}
            />
          )}

          {activeTab === 'PREDICTIONS' && (
            <PredictiveInsightsCard
              insights={predictiveInsights}
              callsign={currentAstronaut.profile?.callsign || 'ASTRONAUT'}
            />
          )}

          {activeTab === 'MECHANISMS' && (
            <RiskExplanationCard
              explanationMarkdown={riskExplanation}
              callsign={currentAstronaut.profile?.callsign || 'ASTRONAUT'}
            />
          )}
        </div>

        {/* Right Column: Grounded Clinical Summary & Safety Directives */}
        <div className="lg:col-span-4 space-y-6">
          <IntelligenceSummaryCard context={groundedContext} />

          {/* Clinical Directives & Guardrails Card */}
          <DossierCard
            title="SAFETY DIRECTIVES & GUARDRAILS"
            subtitle="NASA / FLIGHT SURGEON GOVERNANCE"
            badge={<span className="font-mono text-[9px] text-astro-status-healthy">ENFORCED</span>}
          >
            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start space-x-2 text-[11px] text-astro-text-secondary">
                <ShieldCheck className="w-3.5 h-3.5 text-astro-status-healthy shrink-0 mt-0.5" />
                <span>Deterministic Layer 4 risk scores and alerts cannot be overridden by AI.</span>
              </div>
              <div className="flex items-start space-x-2 text-[11px] text-astro-text-secondary">
                <ShieldCheck className="w-3.5 h-3.5 text-astro-status-healthy shrink-0 mt-0.5" />
                <span>100% telemetry citations grounded in verified packets; zero hallucination tolerance.</span>
              </div>
              <div className="flex items-start space-x-2 text-[11px] text-astro-text-secondary">
                <ShieldCheck className="w-3.5 h-3.5 text-astro-status-healthy shrink-0 mt-0.5" />
                <span>Non-diagnostic clinical advisory; final medical authority remains with Flight Surgeon.</span>
              </div>
              <div className="flex items-start space-x-2 text-[11px] text-astro-text-secondary">
                <ShieldCheck className="w-3.5 h-3.5 text-astro-status-healthy shrink-0 mt-0.5" />
                <span>Predictive insights clearly labeled to prevent confusion with measured vitals.</span>
              </div>
            </div>
          </DossierCard>

          {/* Quick Action: Generate Anomaly Report */}
          <div className="p-4 bg-astro-bg-subtle border border-astro-border-hairline rounded-sm space-y-2">
            <span className="font-mono text-[10px] font-bold text-astro-text-tertiary uppercase block">
              CLINICAL ARCHIVE SHORTCUT:
            </span>
            <p className="font-body text-xs text-astro-text-secondary">
              Generate an immutable vector-ready clinical report for mission telemetry records.
            </p>
            <SecondaryButton
              size="sm"
              icon={FileText}
              className="w-full justify-center"
              onClick={() => setIsReportModalOpen(true)}
            >
              LAUNCH REPORT DOSSIER MODAL
            </SecondaryButton>
          </div>
        </div>
      </div>

      {/* 4. Report Generator Modal */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onGenerate={generateMissionReport}
        activeReport={activeReport}
        callsign={currentAstronaut.profile?.callsign || 'ASTRONAUT'}
      />
    </PageContainer>
  );
};
