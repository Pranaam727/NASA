import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import MissionOverview from './pages/MissionOverview';
import ScenarioLibrary from './pages/ScenarioLibrary';
import ScenarioBuilder from './pages/ScenarioBuilder';
import LiveSimulation from './pages/LiveSimulation';
import RiskAssessment from './pages/RiskAssessment';
import CrewReadiness from './pages/CrewReadiness';
import ResourceManagement from './pages/ResourceManagement';
import EventTimeline from './pages/EventTimeline';
import MissionReports from './pages/MissionReports';
import SystemSettings from './pages/SystemSettings';

export default function App() {
  return (
    <div className="flex h-full flex-col">
      <NavBar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route path="/overview" element={<MissionOverview />} />
          <Route path="/library" element={<ScenarioLibrary />} />
          <Route path="/builder" element={<ScenarioBuilder />} />
          <Route path="/simulation" element={<LiveSimulation />} />
          <Route path="/risk" element={<RiskAssessment />} />
          <Route path="/crew" element={<CrewReadiness />} />
          <Route path="/resources" element={<ResourceManagement />} />
          <Route path="/timeline" element={<EventTimeline />} />
          <Route path="/reports" element={<MissionReports />} />
          <Route path="/settings" element={<SystemSettings />} />
        </Routes>
      </main>
    </div>
  );
}
