import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ImmuneDashboardPage } from '../features/immune-monitoring/ImmuneDashboardPage';
import { ImmuneCellsPage } from '../features/immune-cells/ImmuneCellsPage';
import { BiomarkersPage } from '../features/cytokine-analysis/BiomarkersPage';
import { SampleManagementPage } from '../features/laboratory-management/SampleManagementPage';
import { LaboratoryResultsPage } from '../features/laboratory-management/LaboratoryResultsPage';
import { LongitudinalAnalysisPage } from '../features/longitudinal-analysis/LongitudinalAnalysisPage';
import { AlertEnginePage } from '../features/immune-monitoring/AlertEnginePage';
import { ResearchInsightsPage } from '../features/nasa-research/ResearchInsightsPage';
import { NasaResearchExplorerPage } from '../features/nasa-research/NasaResearchExplorerPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Default redirect to /immune */}
        <Route index element={<Navigate to="/immune" replace />} />

        {/* P12 Immune & Laboratory Intelligence Core Routes */}
        <Route path="immune" element={<ImmuneDashboardPage />} />
        <Route path="immune/cells" element={<ImmuneCellsPage />} />
        <Route path="immune/biomarkers" element={<BiomarkersPage />} />
        <Route path="immune/laboratory" element={<SampleManagementPage />} />
        <Route path="immune/results" element={<LaboratoryResultsPage />} />
        <Route path="immune/longitudinal" element={<LongitudinalAnalysisPage />} />
        <Route path="immune/alerts" element={<AlertEnginePage />} />
        <Route path="immune/insights" element={<ResearchInsightsPage />} />
        <Route path="immune/research" element={<NasaResearchExplorerPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/immune" replace />} />
      </Route>
    </Routes>
  );
};
