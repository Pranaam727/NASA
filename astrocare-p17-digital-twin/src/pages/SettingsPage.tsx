import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import { Settings, RefreshCw, Database, Shield, Check, Info } from 'lucide-react';
import { astronautProfileService } from '../services/astronautProfileService';
import { measurementService } from '../services/measurementService';
import { missionScenarioService } from '../services/missionScenarioService';

interface SettingsPageProps {
  onResetAllData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onResetAllData }) => {
  const [resetStatus, setResetStatus] = useState<string | null>(null);

  const handleFullReset = () => {
    localStorage.clear();
    astronautProfileService.resetToDemo();
    measurementService.resetToDemo();
    missionScenarioService.resetToDemo();
    onResetAllData();
    setResetStatus('Demo data successfully re-seeded to initial state.');
    setTimeout(() => setResetStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Module Configuration & System Settings
            </h1>
            <Badge variant="cyan">P17 STANDALONE SETTINGS</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure local persistence storage, default prediction models, analytical sensitivity thresholds, and AstroCare master integration flags.
          </p>
        </div>
      </div>

      <DisclaimerNotice />

      {resetStatus && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{resetStatus}</span>
        </div>
      )}

      {/* Storage & Demo Seed Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Database className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100">
                Local State & Data Persistence
              </h3>
              <p className="text-xs text-slate-400">
                All astronaut profiles, ingested observations, anomaly reviews, and custom mission scenarios are stored in browser LocalStorage.
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            size="sm"
            icon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={handleFullReset}
          >
            Re-seed Initial Demo Data
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">Profiles Key</span>
            <span className="text-cyan-400">astrocare_p17_astronaut_profiles</span>
          </div>
          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">Telemetry Key</span>
            <span className="text-cyan-400">astrocare_p17_measurements</span>
          </div>
          <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800">
            <span className="text-slate-500 block">Anomalies Key</span>
            <span className="text-cyan-400">astrocare_p17_anomalies</span>
          </div>
        </div>
      </Card>

      {/* Architectural Integration Info Card */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
          <Shield className="w-5 h-5 text-teal-400" />
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              AstroCare Master Application Integration Architecture
            </h3>
            <p className="text-xs text-slate-400">
              Autonomous micro-frontend designed for selective merging without overwriting master AstroCare modules P01–P16.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
          <p>
            This module (P17) is completely isolated within its self-contained feature boundary. When integrating into the master AstroCare application:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li>
              Copy the <code className="text-cyan-400 font-mono">src/features/astronaut-digital-twin/</code> or <code className="text-cyan-400 font-mono">src/</code> directory into your target master project.
            </li>
            <li>
              Mount the subroutes under <code className="text-cyan-400 font-mono">/digital-twin/*</code> using React Router v6.
            </li>
            <li>
              No global state pollution: All state is encapsulated via independent hooks (<code className="text-cyan-400 font-mono">useAstronautProfiles</code>, <code className="text-cyan-400 font-mono">usePredictiveAnalytics</code>, etc.).
            </li>
            <li>
              No API key requirements: Runs 100% offline with zero external network dependencies.
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};
