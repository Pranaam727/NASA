import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { useRadiationIntelligence } from '@/features/radiation/hooks/useRadiationIntelligence';
import { RadiationOverview } from '@/features/radiation/components/RadiationOverview';
import { BiologicalRiskPanel } from '@/features/radiation/components/BiologicalRiskPanel';
import { EventMonitor } from '@/features/radiation/components/EventMonitor';
import { ShieldingScenarioTool } from '@/features/radiation/components/ShieldingScenarioTool';
import { ResearchPanel } from '@/features/radiation/components/ResearchPanel';
import { Radio, ShieldAlert, SunMedium, Sliders, BookOpen, User } from 'lucide-react';

type RadiationTab = 'OVERVIEW' | 'BIOLOGICAL_RISK' | 'EVENT_MONITOR' | 'SHIELDING_LAB' | 'NASA_RESEARCH';

export const RadiationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<RadiationTab>('OVERVIEW');

  const {
    astronauts,
    selectedAstronaut,
    selectedAstronautId,
    setSelectedAstronautId,
    currentReading,
    biologicalRisk,
    events,
    scenarioConfig,
    setScenarioConfig,
    scenarioResult,
    researchReferences,
    isStreaming,
  } = useRadiationIntelligence('ASTRO-01');

  const isSpe = currentReading.fluxSpeUsVh > 0.5;

  return (
    <PageContainer maxWidth="wide">
      {/* 1. Header */}
      <PageHeader
        title="Space Radiation Intelligence & Biological Risk Analytics"
        subtitle="Galactic cosmic ray monitoring, solar particle event telemetry, NASA HRP biological risk modeling, and shielding scenario evaluation"
        badge={
          <div className="flex items-center space-x-2">
            <StatusIndicator
              status={isSpe ? 'CRITICAL' : isStreaming ? 'NOMINAL' : 'INFO'}
              label={isSpe ? 'SOLAR STORM IN PROGRESS' : 'IONIZING FLUX NOMINAL'}
              pulse={isSpe || isStreaming}
            />
            <span className="font-mono text-[9px] px-2 py-0.5 rounded-sm border uppercase font-bold bg-astro-sage/15 text-astro-sage border-astro-sage/40">
              NASA STD-3001
            </span>
          </div>
        }
        metadata={[
          { label: 'Environment', value: 'Cislunar Artemis Flight' },
          { label: 'Subject', value: `${selectedAstronaut?.profile?.callsign || 'CREW'} (${selectedAstronautId})` },
          { label: 'Ambient Flux', value: `${currentReading.ambientFluxUsVh.toFixed(3)} µSv/h` },
          { label: 'Career Dose', value: `${currentReading.careerDoseMsv.toFixed(1)} mSv` },
        ]}
      />

      {/* 2. Crew Selector Strip */}
      <div className="bg-astro-bg-surface border border-astro-border-hairline rounded-sm p-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <User className="w-4 h-4 text-astro-text-secondary" />
          <span className="text-astro-text-secondary uppercase">Monitored Crew Member:</span>
          <span className="font-bold text-astro-text-primary">
            {selectedAstronaut?.profile?.full_name || selectedAstronautId}
          </span>
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

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-astro-border-hairline font-mono text-xs overflow-x-auto">
        {[
          { id: 'OVERVIEW', label: 'RADIATION DOSIMETRY', icon: Radio },
          { id: 'BIOLOGICAL_RISK', label: 'BIOLOGICAL RISK & DNA', icon: ShieldAlert },
          { id: 'EVENT_MONITOR', label: `SPE EVENTS (${events.length})`, icon: SunMedium },
          { id: 'SHIELDING_LAB', label: 'SHIELDING SCENARIO LAB', icon: Sliders },
          { id: 'NASA_RESEARCH', label: 'NASA HRP EVIDENCE', icon: BookOpen },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as RadiationTab)}
            className={`flex items-center space-x-2 px-4 py-2.5 font-bold border-b-2 -mb-px transition-colors whitespace-nowrap ${
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

      {/* 4. Active Tab Content */}
      {activeTab === 'OVERVIEW' && (
        <RadiationOverview reading={currentReading} risk={biologicalRisk} />
      )}

      {activeTab === 'BIOLOGICAL_RISK' && (
        <BiologicalRiskPanel risk={biologicalRisk} reading={currentReading} />
      )}

      {activeTab === 'EVENT_MONITOR' && (
        <EventMonitor
          events={events}
          isSpeActive={isSpe}
          currentFluxUsVh={currentReading.ambientFluxUsVh}
        />
      )}

      {activeTab === 'SHIELDING_LAB' && (
        <ShieldingScenarioTool
          config={scenarioConfig}
          onChangeConfig={setScenarioConfig}
          result={scenarioResult}
        />
      )}

      {activeTab === 'NASA_RESEARCH' && (
        <ResearchPanel references={researchReferences} />
      )}
    </PageContainer>
  );
};
