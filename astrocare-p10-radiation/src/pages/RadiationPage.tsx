import React, { useMemo } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { useRadiationTelemetry } from '@/features/radiation/hooks/useRadiationTelemetry';
import { useNasaRadiationResearch } from '@/features/radiation/hooks/useNasaRadiationResearch';
import { RadiationMetricCards } from '@/features/radiation/components/RadiationMetricCards';
import { RadiationExposureChart } from '@/features/radiation/components/RadiationExposureChart';
import { RadiationAlertPanel } from '@/features/radiation/components/RadiationAlertPanel';
import { MissionExposurePanel } from '@/features/radiation/components/MissionExposurePanel';
import { NasaRadLabExplorer } from '@/features/radiation/components/NasaRadLabExplorer';
import { NasaOsdrResearchExplorer } from '@/features/radiation/components/NasaOsdrResearchExplorer';
import { NasaHrpEvidencePanel } from '@/features/radiation/components/NasaHrpEvidencePanel';
import { RadiationProvenancePanel } from '@/features/radiation/components/RadiationProvenancePanel';

export const RadiationPage: React.FC = () => {
  // Telemetry & Alerts Hook
  const {
    fluxUsVh,
    accumulatedDoseMSv,
    isSpeActive,
    history,
    activeAlert,
    recentAlerts,
    acknowledgeAlert,
  } = useRadiationTelemetry('ASTRO-01');

  // NASA Research Hook
  const {
    radLabMeasurements,
    isRadLabLive,
    isRadLabLoading,
    radLabError,
    radLabParams,
    updateRadLabFilter,
    refreshRadLab,
    osdrStudies,
    isOsdrLoading,
    searchTerm,
    selectedCategory,
    handleSearch,
    handleCategorySelect,
    hrpEvidence,
    selectedStudy,
    setSelectedStudy,
  } = useNasaRadiationResearch();

  // Peak flux calculation
  const peakFluxUsVh = useMemo(() => {
    if (history.length === 0) return fluxUsVh;
    return Math.max(fluxUsVh, ...history.map((h) => h.fluxUsVh));
  }, [history, fluxUsVh]);

  const latestRadLabReading = radLabMeasurements[0] || null;

  const headerStatus = isSpeActive ? 'CRITICAL' : fluxUsVh >= 0.5 ? 'CAUTION' : 'NOMINAL';
  const headerLabel = isSpeActive
    ? 'SOLAR PARTICLE EVENT ACTIVE'
    : fluxUsVh >= 0.5
    ? 'ELEVATED FLUX WARNING'
    : 'AMBIENT GCR NOMINAL';

  return (
    <PageContainer maxWidth="wide">
      {/* 1. Page Header */}
      <PageHeader
        title="Space Radiation Health Intelligence"
        subtitle="Simulated deep-space personal dosimetry, NASA RadLab telemetry integration, and OSDR research intelligence"
        badge={<StatusIndicator status={headerStatus} label={headerLabel} pulse={isSpeActive} />}
        metadata={[
          { label: 'Crew Subject', value: 'CDR. MARCUS CHEN (ASTRO-01)' },
          { label: 'Mission', value: 'ARES-VI // DEEP-SPACE TRANSIT' },
          {
            label: 'NASA RadLab Link',
            value: isRadLabLive ? 'LIVE OSDR API ACTIVE' : 'AUTHENTIC RADLAB ARCHIVE',
          },
          { label: 'Last Sweep', value: new Date().toLocaleTimeString() },
        ]}
      />

      <div className="space-y-6 mt-6">
        {/* 2. Key Metric Cards */}
        <RadiationMetricCards
          currentFluxUsVh={fluxUsVh}
          cumulativeDoseMsv={accumulatedDoseMSv}
          peakFluxUsVh={peakFluxUsVh}
          isSpeActive={isSpeActive}
          latestRadLabReading={latestRadLabReading}
          isRadLabLive={isRadLabLive}
        />

        {/* 3. Exposure Chart & Threat Assessment (Side by Side on Large Screens) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RadiationExposureChart
              history={history}
              currentFluxUsVh={fluxUsVh}
              cumulativeDoseMsv={accumulatedDoseMSv}
            />
          </div>

          <div className="lg:col-span-1">
            <RadiationAlertPanel
              activeAlert={activeAlert}
              recentAlerts={recentAlerts}
              currentFluxUsVh={fluxUsVh}
              onAcknowledge={acknowledgeAlert}
            />
          </div>
        </div>

        {/* 4. Mission Exposure Context Panel */}
        <MissionExposurePanel
          cumulativeDoseMsv={accumulatedDoseMSv}
          missionDay={48}
          totalMissionDays={900}
          careerLimitMsv={500}
        />

        {/* 5. NASA RadLab Telemetry Explorer */}
        <NasaRadLabExplorer
          measurements={radLabMeasurements}
          isLive={isRadLabLive}
          isLoading={isRadLabLoading}
          error={radLabError}
          params={radLabParams}
          onUpdateFilter={updateRadLabFilter}
          onRefresh={refreshRadLab}
        />

        {/* 6. NASA OSDR Space-Biology Research Explorer */}
        <NasaOsdrResearchExplorer
          studies={osdrStudies}
          isLoading={isOsdrLoading}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          selectedStudy={selectedStudy}
          onSearchChange={handleSearch}
          onCategoryChange={handleCategorySelect}
          onSelectStudy={setSelectedStudy}
        />

        {/* 7. NASA HRP Evidence & Space Radiation Risks */}
        <NasaHrpEvidencePanel evidenceRecords={hrpEvidence} />

        {/* 8. Data Provenance & Scientific Integrity Matrix */}
        <RadiationProvenancePanel />
      </div>
    </PageContainer>
  );
};

export default RadiationPage;
