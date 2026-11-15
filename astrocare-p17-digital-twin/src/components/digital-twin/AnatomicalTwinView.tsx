import React, { useState } from 'react';
import { PhysiologicalSystemType, PhysiologicalMeasurement } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { UnitTag } from '../common/UnitTag';
import { Heart, Brain, Bone, ShieldCheck, Wind, Moon, Activity, ExternalLink, Info } from 'lucide-react';
import { nasaResearchService } from '../../services/nasaResearchService';

interface AnatomicalTwinViewProps {
  measurements: PhysiologicalMeasurement[];
  onSelectSystem?: (system: PhysiologicalSystemType) => void;
  selectedSystem?: PhysiologicalSystemType;
}

export const AnatomicalTwinView: React.FC<AnatomicalTwinViewProps> = ({
  measurements,
  onSelectSystem,
  selectedSystem: controlledSystem,
}) => {
  const [internalSelected, setInternalSelected] = useState<PhysiologicalSystemType>('cardiovascular');
  const activeSystem = controlledSystem || internalSelected;

  const handleSelect = (sys: PhysiologicalSystemType) => {
    setInternalSelected(sys);
    if (onSelectSystem) {
      onSelectSystem(sys);
    }
  };

  const systemMeasurements = measurements.filter((m) => m.system === activeSystem);
  const validMeasurements = systemMeasurements.filter((m) => m.value !== null);
  const researchStudies = nasaResearchService.getBySystem(activeSystem);

  const systemsConfig = [
    {
      id: 'neurological' as PhysiologicalSystemType,
      label: 'Neurological & Vestibular',
      shortLabel: 'Brain & Vestibular',
      icon: <Brain className="w-4 h-4" />,
      color: '#8b5cf6',
      badgeVariant: 'violet' as const,
      cy: 65,
      cx: 150,
      description: 'Sensorimotor coordination, cognitive reaction time (PVT), otolith adaptation.',
    },
    {
      id: 'respiratory' as PhysiologicalSystemType,
      label: 'Respiratory System',
      shortLabel: 'Respiratory',
      icon: <Wind className="w-4 h-4" />,
      color: '#14b8a6',
      badgeVariant: 'teal' as const,
      cy: 140,
      cx: 150,
      description: 'Pulmonary function, minute ventilation, cabin oxygen/CO2 environmental gas exchange.',
    },
    {
      id: 'cardiovascular' as PhysiologicalSystemType,
      label: 'Cardiovascular System',
      shortLabel: 'Cardiovascular',
      icon: <Heart className="w-4 h-4" />,
      color: '#f43f5e',
      badgeVariant: 'rose' as const,
      cy: 165,
      cx: 140,
      description: 'Resting cardiac rhythm, blood pressure shifts, microgravity fluid cephalad redistribution, VO2 max.',
    },
    {
      id: 'immune' as PhysiologicalSystemType,
      label: 'Immune & Lymphatic',
      shortLabel: 'Immune',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: '#10b981',
      badgeVariant: 'emerald' as const,
      cy: 200,
      cx: 165,
      description: 'Circulating cytokines (TNF-a, IL-6), T-cell activation, viral reactivation markers.',
    },
    {
      id: 'musculoskeletal' as PhysiologicalSystemType,
      label: 'Musculoskeletal & Skeletal',
      shortLabel: 'Musculoskeletal',
      icon: <Bone className="w-4 h-4" />,
      color: '#3b82f6',
      badgeVariant: 'blue' as const,
      cy: 280,
      cx: 150,
      description: 'Femoral neck BMD, isometric quadriceps strength, lean muscle mass preservation.',
    },
    {
      id: 'sleep_circadian' as PhysiologicalSystemType,
      label: 'Sleep & Circadian Rhythms',
      shortLabel: 'Sleep / Circadian',
      icon: <Moon className="w-4 h-4" />,
      color: '#06b6d4',
      badgeVariant: 'cyan' as const,
      cy: 105,
      cx: 150,
      description: 'Actigraphy duration, melatonin DLMO onset phase shift, sleep architecture efficiency.',
    },
  ];

  const currentSysConfig = systemsConfig.find((s) => s.id === activeSystem) || systemsConfig[2];

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" />
              Interactive Anatomical Digital Twin Silhouette
            </h3>
            <Badge variant="cyan">VECTOR BIOMODEL</Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Select a physiological system to inspect real-time observations, data availability, and linked NASA research evidence.
          </p>
        </div>

        {/* Quick selector buttons */}
        <div className="flex flex-wrap gap-1.5">
          {systemsConfig.map((sys) => (
            <button
              key={sys.id}
              onClick={() => handleSelect(sys.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeSystem === sys.id
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <span style={{ color: sys.color }}>{sys.icon}</span>
              <span>{sys.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Anatomical Silhouette SVG Column */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4 bg-[#0a0f1d]/80 rounded-xl border border-slate-800/80 relative">
          <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            ANATOMICAL SCHEMATIC // AXIAL PROJECTION
          </div>

          <div className="w-full max-w-[280px] h-[420px] relative flex items-center justify-center">
            <svg
              viewBox="0 0 300 480"
              className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.1)]"
            >
              <defs>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#0f172a" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0f172a" stopOpacity="0.7" />
                </linearGradient>

                <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Stylized Body Silhouette Contour */}
              {/* Head */}
              <circle
                cx="150"
                cy="60"
                r="30"
                fill="url(#bodyGrad)"
                stroke="#334155"
                strokeWidth="1.5"
                className="transition-colors duration-300"
              />

              {/* Neck */}
              <path
                d="M 142 88 L 142 105 L 158 105 L 158 88 Z"
                fill="url(#bodyGrad)"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Torso & Arms Silhouette */}
              <path
                d="M 125 108 C 105 115 85 140 75 190 C 70 215 65 250 60 280 C 58 290 68 295 72 285 C 80 255 90 220 95 200 C 98 180 105 170 115 160 L 115 285 C 115 300 120 310 135 315 L 142 315 L 142 430 C 142 445 148 450 150 450 C 152 450 158 445 158 430 L 158 315 L 165 315 C 180 310 185 300 185 285 L 185 160 C 195 170 202 180 205 200 C 210 220 220 255 228 285 C 232 295 242 290 240 280 C 235 250 230 215 225 190 C 215 140 195 115 175 108 Z"
                fill="url(#bodyGrad)"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Lower Legs separation */}
              <path
                d="M 125 315 L 110 440 C 108 455 125 455 128 440 L 140 330 Z"
                fill="url(#bodyGrad)"
                stroke="#334155"
                strokeWidth="1.5"
              />
              <path
                d="M 175 315 L 190 440 C 192 455 175 455 172 440 L 160 330 Z"
                fill="url(#bodyGrad)"
                stroke="#334155"
                strokeWidth="1.5"
              />

              {/* Grid / Laser Scan Line Overlay */}
              <line x1="80" y1="120" x2="220" y2="120" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="90" y1="200" x2="210" y2="200" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />
              <line x1="100" y1="300" x2="200" y2="300" stroke="#06b6d4" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.4" />

              {/* Interactive System Hotspot Nodes */}
              {systemsConfig.map((sys) => {
                const isSelected = activeSystem === sys.id;
                return (
                  <g
                    key={sys.id}
                    onClick={() => handleSelect(sys.id)}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing halo if selected */}
                    {isSelected && (
                      <circle
                        cx={sys.cx}
                        cy={sys.cy}
                        r="18"
                        fill="none"
                        stroke={sys.color}
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="animate-spin"
                        style={{ transformOrigin: `${sys.cx}px ${sys.cy}px` }}
                      />
                    )}
                    <circle
                      cx={sys.cx}
                      cy={sys.cy}
                      r={isSelected ? 10 : 7}
                      fill={sys.color}
                      fillOpacity={isSelected ? 0.9 : 0.4}
                      stroke={isSelected ? '#ffffff' : sys.color}
                      strokeWidth={isSelected ? 2 : 1}
                      filter={isSelected ? 'url(#glowFilter)' : undefined}
                      className="transition-all duration-200 group-hover:scale-125"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Active Data
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Selected Focus
            </span>
          </div>
        </div>

        {/* Selected System Intelligence Panel Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    backgroundColor: `${currentSysConfig.color}15`,
                    color: currentSysConfig.color,
                  }}
                >
                  {currentSysConfig.icon}
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-100">
                    {currentSysConfig.label}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {currentSysConfig.description}
                  </p>
                </div>
              </div>
              <Badge variant={currentSysConfig.badgeVariant}>
                {validMeasurements.length > 0 ? `${validMeasurements.length} TELEMETRY RECORDS` : 'INSUFFICIENT DATA'}
              </Badge>
            </div>

            {/* Current Measurements Table / Cards */}
            <div className="mt-4 space-y-2.5">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Telemetry & Laboratory Observations
              </div>

              {systemMeasurements.length === 0 ? (
                <div className="p-4 bg-slate-950/50 rounded-lg text-xs text-slate-400 italic">
                  No observations currently ingested for this physiological domain.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {systemMeasurements.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 bg-slate-950/60 border border-slate-800/60 rounded-lg flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-xs font-medium text-slate-300">
                          {m.variableName}
                        </span>
                        <UnitTag unit={m.unit} />
                      </div>
                      <div className="my-1.5 flex items-baseline justify-between">
                        {m.value === null ? (
                          <span className="text-xs text-amber-400/90 font-mono italic">
                            Measurement Unavailable
                          </span>
                        ) : (
                          <span className="text-xl font-bold font-mono text-slate-100">
                            {m.value}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-slate-400">
                          FD {m.missionDay} ({m.missionPhase})
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate" title={m.sourceReference}>
                        Src: {m.sourceType}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Linked NASA Research Context */}
          <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                Linked NASA Evidence & Repository Research
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                {researchStudies.length} Evidence Records
              </span>
            </div>

            {researchStudies.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No direct NASA HRP risk document matched to this specific query. Refer to NASA Human Research Roadmap.
              </p>
            ) : (
              <div className="space-y-2.5">
                {researchStudies.map((study) => (
                  <div
                    key={study.id}
                    className="p-3 bg-slate-950/40 border border-slate-800/60 rounded-lg text-xs space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-slate-200">
                        {study.title}
                      </span>
                      <a
                        href={study.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 shrink-0 inline-flex items-center gap-1 font-mono text-[11px]"
                      >
                        {study.accessionNumber}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      {study.keyFindings[0]}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500 font-mono">
                      <span>Repository: {study.sourceRepository}</span>
                      <span>•</span>
                      <span>Organism: {study.organism}</span>
                      <span>•</span>
                      <span>Study Type: {study.studyType}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
