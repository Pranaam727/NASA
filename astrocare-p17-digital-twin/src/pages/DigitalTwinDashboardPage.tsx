import React from 'react';
import { AstronautProfile, PhysiologicalMeasurement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { MetricCard } from '../components/common/MetricCard';
import { AnatomicalTwinView } from '../components/digital-twin/AnatomicalTwinView';
import { MeasurementTrendChart } from '../components/digital-twin/MeasurementTrendChart';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import {
  Users,
  Activity,
  Heart,
  AlertTriangle,
  TrendingUp,
  Clock,
  Shield,
  Layers,
} from 'lucide-react';
import { evaluateDataQuality } from '../utils/dataQuality';
import { AnomalyRecord } from '../types';

interface DigitalTwinDashboardPageProps {
  activeProfile: AstronautProfile;
  allProfiles: AstronautProfile[];
  measurements: PhysiologicalMeasurement[];
  anomalies: AnomalyRecord[];
  onSelectSystem?: (system: any) => void;
}

export const DigitalTwinDashboardPage: React.FC<DigitalTwinDashboardPageProps> = ({
  activeProfile,
  allProfiles,
  measurements,
  anomalies,
  onSelectSystem,
}) => {
  const quality = evaluateDataQuality(measurements, activeProfile?.missionDurationDays || 180);
  const pendingAnomalies = anomalies.filter((a) => a.status === 'Pending');

  // Filter measurements for active profile
  const profileMeasurements = measurements.filter((m) => m.astronautId === activeProfile?.id);
  const heartRateMeasurements = profileMeasurements.filter((m) => m.variable === 'resting_heart_rate');
  const bmdMeasurements = profileMeasurements.filter((m) => m.variable === 'bone_mineral_density_femoral');

  const hrBaseline = activeProfile?.baselineMeasurements?.resting_heart_rate?.baselineValue ?? 58;

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Astronaut Digital Twin Intelligence
            </h1>
            <Badge variant="cyan">AEROSPACE BIOMEDICAL TWIN</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time digital twin synthesis for {activeProfile?.displayName} ({activeProfile?.missionId}) • Longitudinal microgravity physiological adaptation tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal" size="md">
            <Shield className="w-3.5 h-3.5 mr-1" />
            SYNTHETIC BIOMODEL READY
          </Badge>
        </div>
      </div>

      <DisclaimerNotice />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <MetricCard
          label="Active Profiles"
          value={allProfiles.length}
          icon={<Users className="w-4 h-4" />}
          subtext="Flight crew cohort"
        />
        <MetricCard
          label="Telemetry Obs."
          value={profileMeasurements.length}
          icon={<Activity className="w-4 h-4" />}
          subtext={`${quality.completenessPercentage}% Complete`}
        />
        <MetricCard
          label="Systems Tracked"
          value={6}
          icon={<Layers className="w-4 h-4" />}
          subtext="Physiological domains"
        />
        <MetricCard
          label="Quality Score"
          value={`${quality.averageQualityScore}/100`}
          icon={<Shield className="w-4 h-4" />}
          subtext="Telemetry index"
        />
        <MetricCard
          label="Detected Anomalies"
          value={pendingAnomalies.length}
          icon={<AlertTriangle className="w-4 h-4" />}
          subtext="Awaiting review"
          systemColor="text-amber-400"
        />
        <MetricCard
          label="Flight Day"
          value={activeProfile?.missionDay >= 0 ? `FD ${activeProfile?.missionDay}` : `L${activeProfile?.missionDay}`}
          icon={<Clock className="w-4 h-4" />}
          subtext={activeProfile?.missionPhase || 'Inflight'}
        />
        <MetricCard
          label="Resting HR"
          value={heartRateMeasurements.length > 0 ? heartRateMeasurements[heartRateMeasurements.length - 1]?.value : 64}
          unit="bpm"
          baseline={hrBaseline}
          icon={<Heart className="w-4 h-4" />}
          systemColor="text-rose-400"
        />
      </div>

      {/* Central Anatomical Digital Twin View */}
      <AnatomicalTwinView
        measurements={profileMeasurements}
        onSelectSystem={onSelectSystem}
      />

      {/* Key Physiological Trend Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MeasurementTrendChart
          title="Cardiovascular Dynamic Adaptation"
          variableName="Resting Heart Rate"
          unit="bpm"
          measurements={heartRateMeasurements}
          baselineValue={hrBaseline}
          expectedMin={50}
          expectedMax={75}
          color="#f43f5e"
        />

        <MeasurementTrendChart
          title="Musculoskeletal Bone Demineralization Profile"
          variableName="Femoral Neck BMD T-Score"
          unit="T-score"
          measurements={bmdMeasurements}
          baselineValue={activeProfile?.baselineMeasurements?.bone_mineral_density_femoral?.baselineValue ?? 0.85}
          expectedMin={-1.0}
          expectedMax={1.5}
          color="#3b82f6"
        />
      </div>

      {/* Recent Observations & Anomaly Quick Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Recent Telemetry Observation Stream
            </h4>
            <span className="text-[11px] font-mono text-slate-500">
              Last {Math.min(5, profileMeasurements.length)} records
            </span>
          </div>

          <div className="space-y-2">
            {profileMeasurements.slice(-5).reverse().map((m) => (
              <div
                key={m.id}
                className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-medium text-slate-200">{m.variableName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    FD {m.missionDay} ({m.missionPhase}) • {m.sourceType}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-slate-100">
                    {m.value !== null ? `${m.value} ${m.unit}` : <span className="text-amber-400 italic">Unavailable</span>}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono">
                    Quality: {m.qualityScore}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Active Anomaly & Review Alerts
            </h4>
            <Badge variant="amber">{pendingAnomalies.length} PENDING</Badge>
          </div>

          <div className="space-y-2">
            {anomalies.slice(0, 4).map((a) => (
              <div
                key={a.id}
                className="p-2.5 bg-slate-950/60 rounded-lg border border-slate-800/60 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={a.severity === 'Elevated (Review)' ? 'rose' : 'amber'} size="sm">
                      {a.severity}
                    </Badge>
                    <span className="font-medium text-slate-200">{a.variableName}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{a.explanation}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  FD {a.missionDay}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
