import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { useAstronautProfiles } from './hooks/useAstronautProfiles';
import { usePhysiologicalMeasurements } from './hooks/usePhysiologicalMeasurements';
import { useAnomalyDetection } from './hooks/useAnomalyDetection';

// Pages
import { DigitalTwinDashboardPage } from './pages/DigitalTwinDashboardPage';
import { AstronautProfilesPage } from './pages/AstronautProfilesPage';
import { PhysiologicalHealthPage } from './pages/PhysiologicalHealthPage';
import { VitalSignsPage } from './pages/VitalSignsPage';
import { HealthTimelinePage } from './pages/HealthTimelinePage';
import { CardiovascularTwinPage } from './pages/CardiovascularTwinPage';
import { MusculoskeletalTwinPage } from './pages/MusculoskeletalTwinPage';
import { ImmuneTwinPage } from './pages/ImmuneTwinPage';
import { NeurologicalTwinPage } from './pages/NeurologicalTwinPage';
import { SleepCircadianTwinPage } from './pages/SleepCircadianTwinPage';
import { RadiationContextPage } from './pages/RadiationContextPage';
import { PredictiveAnalyticsPage } from './pages/PredictiveAnalyticsPage';
import { AnomalyDetectionPage } from './pages/AnomalyDetectionPage';
import { MissionSimulatorPage } from './pages/MissionSimulatorPage';
import { HealthComparisonPage } from './pages/HealthComparisonPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';

export function AppContent() {
  const navigate = useNavigate();
  const {
    profiles,
    activeProfile,
    activeProfileId,
    setActiveProfileId,
    createProfile,
    updateProfile,
    deleteProfile,
    resetProfiles,
  } = useAstronautProfiles();

  const {
    measurements,
    systemSummaries,
    refreshMeasurements,
  } = usePhysiologicalMeasurements(activeProfile?.id);

  const { anomalies, refreshAnomalies } = useAnomalyDetection(activeProfile?.id);

  const handleResetAll = () => {
    resetProfiles();
    refreshMeasurements();
    refreshAnomalies();
  };

  const handleSelectSystem = (system: string) => {
    const route =
      system === 'sleep_circadian'
        ? '/digital-twin/sleep'
        : system === 'radiation_context'
        ? '/digital-twin/radiation'
        : `/digital-twin/${system}`;
    navigate(route);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout
            profiles={profiles}
            activeProfile={activeProfile}
            onSelectProfile={setActiveProfileId}
          />
        }
      >
        <Route index element={<Navigate to="/digital-twin" replace />} />
        <Route
          path="digital-twin"
          element={
            <DigitalTwinDashboardPage
              activeProfile={activeProfile}
              allProfiles={profiles}
              measurements={measurements}
              anomalies={anomalies}
              onSelectSystem={handleSelectSystem}
            />
          }
        />
        <Route
          path="digital-twin/profiles"
          element={
            <AstronautProfilesPage
              profiles={profiles}
              activeProfileId={activeProfileId}
              onSelectProfile={setActiveProfileId}
              onCreateProfile={createProfile}
              onUpdateProfile={updateProfile}
              onDeleteProfile={deleteProfile}
              onResetProfiles={resetProfiles}
            />
          }
        />
        <Route
          path="digital-twin/physiology"
          element={
            <PhysiologicalHealthPage
              activeProfile={activeProfile}
              systemSummaries={systemSummaries}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/vitals"
          element={
            <VitalSignsPage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/timeline"
          element={
            <HealthTimelinePage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/cardiovascular"
          element={
            <CardiovascularTwinPage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/musculoskeletal"
          element={
            <MusculoskeletalTwinPage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/immune"
          element={
            <ImmuneTwinPage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/neurological"
          element={
            <NeurologicalTwinPage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/sleep"
          element={
            <SleepCircadianTwinPage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/radiation"
          element={
            <RadiationContextPage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/predictions"
          element={
            <PredictiveAnalyticsPage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/anomalies"
          element={<AnomalyDetectionPage activeProfile={activeProfile} />}
        />
        <Route path="digital-twin/simulator" element={<MissionSimulatorPage />} />
        <Route
          path="digital-twin/comparison"
          element={
            <HealthComparisonPage
              profiles={profiles}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/reports"
          element={
            <ReportsPage
              activeProfile={activeProfile}
              measurements={measurements}
            />
          }
        />
        <Route
          path="digital-twin/settings"
          element={<SettingsPage onResetAllData={handleResetAll} />}
        />
        <Route path="*" element={<Navigate to="/digital-twin" replace />} />
      </Route>
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
