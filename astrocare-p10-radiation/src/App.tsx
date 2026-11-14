import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from '@/constants/routes';

// Page Views
import { OverviewPage } from '@/pages/OverviewPage';
import { AstronautsPage } from '@/pages/AstronautsPage';
import { AstronautDetailPage } from '@/pages/AstronautDetailPage';
import { VitalsPage } from '@/pages/VitalsPage';
import { SpaceHealthPage } from '@/pages/SpaceHealthPage';
import { CardioHealthPage } from '@/pages/CardioHealthPage';
import { BoneHealthPage } from '@/pages/BoneHealthPage';
import { MuscleHealthPage } from '@/pages/MuscleHealthPage';
import { WellnessPage } from '@/pages/WellnessPage';
import { RadiationPage } from '@/pages/RadiationPage';
import { IntelligencePage } from '@/pages/IntelligencePage';
import { AlertsPage } from '@/pages/AlertsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SimulationPage } from '@/pages/SimulationPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<Navigate to={ROUTES.OVERVIEW} replace />} />
          <Route path={ROUTES.OVERVIEW} element={<OverviewPage />} />
          <Route path={ROUTES.ASTRONAUTS} element={<AstronautsPage />} />
          <Route path={ROUTES.ASTRONAUT_DETAIL} element={<AstronautDetailPage />} />
          <Route path={ROUTES.VITALS} element={<VitalsPage />} />
          <Route path={ROUTES.SPACE_HEALTH} element={<SpaceHealthPage />} />
          <Route path={ROUTES.CARDIO} element={<CardioHealthPage />} />
          <Route path={ROUTES.BONE} element={<BoneHealthPage />} />
          <Route path={ROUTES.MUSCLE} element={<MuscleHealthPage />} />
          <Route path={ROUTES.WELLNESS} element={<WellnessPage />} />
          <Route path={ROUTES.RADIATION} element={<RadiationPage />} />
          <Route path={ROUTES.INTELLIGENCE} element={<IntelligencePage />} />
          <Route path={ROUTES.ALERTS} element={<AlertsPage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.SIMULATION} element={<SimulationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
