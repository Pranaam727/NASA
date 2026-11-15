import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { ROUTES } from '@/constants/routes';

import { AuthProvider } from '@/context/AuthContext';
import { RoleProvider } from '@/context/RoleContext';
import { OfflineSyncProvider } from '@/context/OfflineSyncContext';
import { ProtectedRoute, DashboardRedirect } from '@/components/auth/ProtectedRoute';

// Public Auth Pages
import { LandingPage } from '@/pages/LandingPage';
import { RoleSelectionPage } from '@/pages/auth/RoleSelectionPage';
import { AstronautSignInPage } from '@/pages/auth/AstronautSignInPage';
import { AstronautSignUpPage } from '@/pages/auth/AstronautSignUpPage';
import { MedicalSignInPage } from '@/pages/auth/MedicalSignInPage';
import { MedicalSignUpPage } from '@/pages/auth/MedicalSignUpPage';
import { CommanderSignInPage } from '@/pages/auth/CommanderSignInPage';
import { CommanderSignUpPage } from '@/pages/auth/CommanderSignUpPage';
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage';
import { AccessDeniedPage } from '@/pages/auth/AccessDeniedPage';

// Role Dashboards
import { AstronautDashboardPage } from '@/pages/dashboards/AstronautDashboardPage';
import { MedicalDashboardPage } from '@/pages/dashboards/MedicalDashboardPage';
import { CommanderDashboardPage } from '@/pages/dashboards/CommanderDashboardPage';

// Platform Module Pages
import { OverviewPage } from '@/pages/OverviewPage';
import { AstronautsPage } from '@/pages/AstronautsPage';
import { AstronautDetailPage } from '@/pages/AstronautDetailPage';
import { VitalsPage } from '@/pages/VitalsPage';
import { SpaceHealthPage } from '@/pages/SpaceHealthPage';
import { WellnessPage } from '@/pages/WellnessPage';
import { RadiationPage } from '@/pages/RadiationPage';
import { IntelligencePage } from '@/pages/IntelligencePage';
import { AlertsPage } from '@/pages/AlertsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { SimulationPage } from '@/pages/SimulationPage';
import { HealthTwinPage } from '@/pages/HealthTwinPage';
import { SelfAssessmentPage } from '@/pages/SelfAssessmentPage';
import { EmergencyPage } from '@/pages/EmergencyPage';
import { LaboratoryPage } from '@/pages/LaboratoryPage';
import { ResearchPage } from '@/pages/ResearchPage';
import { ProfilePage } from '@/pages/auth/ProfilePage';
import { SettingsPage } from '@/pages/auth/SettingsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <RoleProvider>
        <OfflineSyncProvider>
          <BrowserRouter>
            <Routes>
              {/* 1. Cinematic 3D Experience (Public) */}
              <Route path={ROUTES.HOME} element={<LandingPage />} />

              {/* 2. Authentication Experience (Public) */}
              <Route path={ROUTES.AUTH} element={<RoleSelectionPage />} />
              <Route path={ROUTES.ASTRONAUT_SIGNIN} element={<AstronautSignInPage />} />
              <Route path={ROUTES.ASTRONAUT_SIGNUP} element={<AstronautSignUpPage />} />
              <Route path={ROUTES.MEDICAL_SIGNIN} element={<MedicalSignInPage />} />
              <Route path={ROUTES.MEDICAL_SIGNUP} element={<MedicalSignUpPage />} />
              <Route path={ROUTES.COMMANDER_SIGNIN} element={<CommanderSignInPage />} />
              <Route path={ROUTES.COMMANDER_SIGNUP} element={<CommanderSignUpPage />} />
              <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
              <Route path={ROUTES.ACCESS_DENIED} element={<AccessDeniedPage />} />

              {/* 3. Role-Based Dashboard Auto-Redirect */}
              <Route path={ROUTES.DASHBOARD} element={<DashboardRedirect />} />

              {/* 4. Core Mission Control Application Shell (Protected) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppShell />}>
                  {/* Role-Specific Dashboards */}
                  <Route
                    path={ROUTES.ASTRONAUT_DASHBOARD}
                    element={
                      <ProtectedRoute allowedRoles={['ASTRONAUT']}>
                        <AstronautDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.MEDICAL_DASHBOARD}
                    element={
                      <ProtectedRoute allowedRoles={['MEDICAL_OFFICER']}>
                        <MedicalDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.COMMANDER_DASHBOARD}
                    element={
                      <ProtectedRoute allowedRoles={['MISSION_COMMANDER', 'MISSION_CONTROLLER']}>
                        <CommanderDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Core Platform Modules */}
                  <Route path={ROUTES.OVERVIEW} element={<OverviewPage />} />
                  <Route path={ROUTES.ASTRONAUTS} element={<AstronautsPage />} />
                  <Route path={ROUTES.ASTRONAUT_DETAIL} element={<AstronautDetailPage />} />
                  <Route path={ROUTES.VITALS} element={<VitalsPage />} />
                  <Route path={ROUTES.SPACE_HEALTH} element={<SpaceHealthPage />} />
                  <Route path={ROUTES.WELLNESS} element={<WellnessPage />} />
                  <Route path={ROUTES.RADIATION} element={<RadiationPage />} />
                  <Route path={ROUTES.INTELLIGENCE} element={<IntelligencePage />} />
                  <Route path={ROUTES.ALERTS} element={<AlertsPage />} />
                  <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
                  <Route path={ROUTES.SIMULATION} element={<SimulationPage />} />
                  <Route path={ROUTES.HEALTH_TWIN} element={<HealthTwinPage />} />
                  <Route path={ROUTES.SELF_ASSESSMENT} element={<SelfAssessmentPage />} />
                  <Route path={ROUTES.EMERGENCY} element={<EmergencyPage />} />
                  <Route path={ROUTES.LABORATORY} element={<LaboratoryPage />} />
                  <Route path={ROUTES.RESEARCH} element={<ResearchPage />} />
                  <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
                  <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </OfflineSyncProvider>
      </RoleProvider>
    </AuthProvider>
  );
};

export default App;
