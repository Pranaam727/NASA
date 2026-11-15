import React from 'react';
import { AstronautProfile, SystemStatusSummary, PhysiologicalMeasurement } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { PhysiologicalSystemCard } from '../components/digital-twin/PhysiologicalSystemCard';
import { DisclaimerNotice } from '../components/common/DisclaimerNotice';
import {
  Heart,
  Bone,
  ShieldCheck,
  Brain,
  Moon,
  Radiation,
  Activity,
  Layers,
} from 'lucide-react';

interface PhysiologicalHealthPageProps {
  activeProfile: AstronautProfile;
  systemSummaries: SystemStatusSummary[];
  measurements: PhysiologicalMeasurement[];
}

export const PhysiologicalHealthPage: React.FC<PhysiologicalHealthPageProps> = ({
  activeProfile,
  systemSummaries,
  measurements,
}) => {
  const getIconForSystem = (system: string) => {
    switch (system) {
      case 'cardiovascular':
        return <Heart className="w-5 h-5 text-rose-400" />;
      case 'musculoskeletal':
        return <Bone className="w-5 h-5 text-blue-400" />;
      case 'immune':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      case 'neurological':
        return <Brain className="w-5 h-5 text-violet-400" />;
      case 'sleep_circadian':
        return <Moon className="w-5 h-5 text-cyan-400" />;
      case 'radiation_context':
        return <Radiation className="w-5 h-5 text-amber-400" />;
      default:
        return <Activity className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-100">
              Physiological Systems Dashboard
            </h1>
            <Badge variant="cyan">6 MULTI-SYSTEM DOMAINS</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Systemic biomedical monitoring across cardiovascular, musculoskeletal, neuro-vestibular, immune, sleep, and radiation domains for {activeProfile?.displayName}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="teal">
            <Layers className="w-3.5 h-3.5 mr-1" />
            STANDALONE BIO-MODULE
          </Badge>
        </div>
      </div>

      <DisclaimerNotice />

      {/* Systems Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {systemSummaries.map((summary) => (
          <PhysiologicalSystemCard
            key={summary.system}
            summary={summary}
            icon={getIconForSystem(summary.system)}
            routePath={`/digital-twin/${
              summary.system === 'sleep_circadian'
                ? 'sleep'
                : summary.system === 'radiation_context'
                ? 'radiation'
                : summary.system
            }`}
          />
        ))}
      </div>

      {/* Scientific Domain Cross-Coupling Notes */}
      <Card className="p-5 space-y-3">
        <h4 className="text-sm font-semibold text-slate-200">
          Physiological System Interactions in Weightlessness
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 space-y-1">
            <strong className="text-rose-400">Cardiovascular & Musculoskeletal:</strong>
            <p>
              Cephalad fluid shifting reduces systemic orthostatic challenge, accelerating vascular deconditioning, while lower-body unweighting reduces biomechanical strain on skeletal trabeculae.
            </p>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 space-y-1">
            <strong className="text-cyan-400">Sleep, Circadian & Immune:</strong>
            <p>
              Altered orbital diurnal cycles (16 sunsets per 24h) depress melatonin rhythmicity and suppress slow-wave sleep, amplifying circulating pro-inflammatory markers (IL-6, TNF-alpha).
            </p>
          </div>
          <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/60 space-y-1">
            <strong className="text-amber-400">Radiation & Cellular Integrity:</strong>
            <p>
              Galactic cosmic ray HZE tracks induce clustered DNA double-strand breaks that interact synergistically with microgravity-induced oxidative stress and diminished immune surveillance.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
