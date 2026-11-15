// AstroCare P11 — Application Routes

import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { WellnessDashboard } from '../pages/WellnessDashboard';
import { SleepPage } from '../pages/SleepPage';
import { CircadianPage } from '../pages/CircadianPage';
import { MentalWellnessPage } from '../pages/MentalWellnessPage';
import { CognitivePage } from '../pages/CognitivePage';
import { TeamPage } from '../pages/TeamPage';
import { WellnessRecommendationsPage } from '../pages/WellnessRecommendationsPage';
import { NasaResearchPage } from '../pages/NasaResearchPage';
import { LandingPage } from '../pages/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/wellness',
    element: <AppLayout />,
    children: [
      { index: true, element: <WellnessDashboard /> },
      { path: 'sleep', element: <SleepPage /> },
      { path: 'circadian', element: <CircadianPage /> },
      { path: 'mental', element: <MentalWellnessPage /> },
      { path: 'cognitive', element: <CognitivePage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'recommendations', element: <WellnessRecommendationsPage /> },
      { path: 'research', element: <NasaResearchPage /> },
      { path: '*', element: <Navigate to="/wellness" replace /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
