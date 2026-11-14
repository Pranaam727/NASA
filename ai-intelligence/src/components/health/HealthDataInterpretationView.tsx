import React, { useState } from 'react';
import { useAstroCareAI } from '../../providers/ProviderContext';
import {
  AstronautHealthPayload,
  MissionContext,
  HealthDomain,
  MetricItem,
  HealthInterpretationResult
} from '../../types';
import { DataOriginBadge } from '../common/DataOriginBadge';
import { ObservationsVsHypothesesPanel } from './ObservationsVsHypothesesPanel';
import {
  HeartPulse,
  Bone,
  Radiation,
  Moon,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  Sliders,
  HelpCircle,
  FileText
} from 'lucide-react';

interface HealthDataInterpretationViewProps {
  currentAstronaut: AstronautHealthPayload;
  missionContext: MissionContext;
  onUpdateAstronaut: (updated: AstronautHealthPayload) => void;
  onOpenResearchDoc?: (docId: string) => void;
}

const DOMAIN_CONFIG: Record<
  HealthDomain,
  { label: string; icon: any; color: string; bgBadge: string }
> = {
  cardiovascular: {
    label: 'Cardiovascular & Hemodynamics',
    icon: HeartPulse,
    color: 'text-rose-400 border-rose-500/30',
    bgBadge: 'bg-rose-950/40 text-rose-300 border-rose-500/30'
  },
  musculoskeletal: {
    label: 'Bone & Musculoskeletal',
    icon: Bone,
    color: 'text-amber-400 border-amber-500/30',
    bgBadge: 'bg-amber-950/40 text-amber-300 border-amber-500/30'
  },
  radiation: {
    label: 'Radiation Dosimetry',
    icon: Radiation,
    color: 'text-purple-400 border-purple-500/30',
    bgBadge: 'bg-purple-950/40 text-purple-300 border-purple-500/30'
  },
  sleep: {
    label: 'Sleep & Circadian Architecture',
    icon: Moon,
    color: 'text-blue-400 border-blue-500/30',
    bgBadge: 'bg-blue-950/40 text-blue-300 border-blue-500/30'
  },
  immune: {
    label: 'Immune System & Biomarkers',
    icon: ShieldCheck,
    color: 'text-emerald-400 border-emerald-500/30',
    bgBadge: 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
  }
};

export const HealthDataInterpretationView: React.FC<HealthDataInterpretationViewProps> = ({
  currentAstronaut,
  missionContext,
  onUpdateAstronaut,
  onOpenResearchDoc
}) => {
  const { provider, mode } = useAstroCareAI();

  const [activeDomain, setActiveDomain] = useState<HealthDomain>('cardiovascular');
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [interpretationResult, setInterpretationResult] = useState<HealthInterpretationResult | null>(null);
  const [editingMetric, setEditingMetric] = useState<MetricItem | null>(null);
  const [tempMetricValue, setTempMetricValue] = useState<string>('');

  const handleInterpret = async () => {
    setIsInterpreting(true);
    try {
      const result = await provider.interpretHealthData(currentAstronaut, missionContext);
      setInterpretationResult(result);
    } catch (err) {
      console.error('Failed to interpret telemetry:', err);
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleSaveMetricValue = () => {
    if (!editingMetric) return;
    const num = parseFloat(tempMetricValue);
    if (isNaN(num)) return;

    const updatedDomains = { ...currentAstronaut.domains };
    const domainData = updatedDomains[editingMetric.domain];

    const updatedMetrics = domainData.metrics.map(m => {
      if (m.id === editingMetric.id) {
        // Evaluate status against nominal range
        let newStatus: MetricItem['status'] = 'normal';
        if (num < m.nominalRange[0] || num > m.nominalRange[1]) {
          const delta = Math.abs(num - m.baseline);
          newStatus = delta > (m.nominalRange[1] - m.nominalRange[0]) * 0.8 ? 'warning' : 'nominal-shift';
        }
        return {
          ...m,
          value: num,
          status: newStatus,
          lastUpdated: 'Just now (Simulated)'
        };
      }
      return m;
    });

    domainData.metrics = updatedMetrics;
    onUpdateAstronaut({
      ...currentAstronaut,
      domains: updatedDomains
    });

    setEditingMetric(null);
  };

  const getStatusBadge = (status: MetricItem['status']) => {
    switch (status) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 border border-rose-500 text-rose-300">CRITICAL</span>;
      case 'warning':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-950/80 border border-amber-500/40 text-amber-300">WARNING</span>;
      case 'nominal-shift':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">NOMINAL SHIFT</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">NORMAL</span>;
    }
  };

  const getTrendIcon = (trend: MetricItem['trend']) => {
    switch (trend) {
      case 'increasing':
        return <span title="Increasing Trend"><TrendingUp className="w-3.5 h-3.5 text-cyan-400" /></span>;
      case 'decreasing':
        return <span title="Decreasing Trend"><TrendingDown className="w-3.5 h-3.5 text-amber-400" /></span>;
      case 'fluctuating':
        return <span title="Fluctuating Trend"><RotateCcw className="w-3.5 h-3.5 text-purple-400" /></span>;
      default:
        return <span title="Stable Trend"><Minus className="w-3.5 h-3.5 text-slate-500" /></span>;
    }
  };

  // Compile all observations & hypotheses across domains
  const allObservations: string[] = [];
  const allHypotheses: string[] = [];
  if (interpretationResult) {
    interpretationResult.domainEvaluations.forEach(de => {
      allObservations.push(...de.observations);
      allHypotheses.push(...de.hypotheses);
    });
  }

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-white tracking-wide">
              {currentAstronaut.astronautName} Telemetry Intake
            </h2>
            <DataOriginBadge origin={currentAstronaut.dataOrigin} />
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {currentAstronaut.role} • Age {currentAstronaut.age} ({currentAstronaut.sex}) • Flight Day {missionContext.flightDay}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleInterpret}
            disabled={isInterpreting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg transition-all cursor-pointer disabled:opacity-50 glow-cyan"
          >
            <Sparkles className={`w-4 h-4 ${isInterpreting ? 'animate-spin' : ''}`} />
            <span>{isInterpreting ? 'Synthesizing with AI...' : 'Interpret Telemetry with Gemini'}</span>
          </button>
        </div>
      </div>

      {/* Domain Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(Object.keys(DOMAIN_CONFIG) as HealthDomain[]).map((dom) => {
          const config = DOMAIN_CONFIG[dom];
          const Icon = config.icon;
          const isActive = activeDomain === dom;
          const domainData = currentAstronaut.domains[dom];

          return (
            <button
              key={dom}
              onClick={() => setActiveDomain(dom)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-cyan-300 border-cyan-500/50 shadow-md glow-cyan'
                  : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{config.label}</span>
              {domainData.overallStatus !== 'normal' && (
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Domain Telemetry Table & Cards */}
      <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{DOMAIN_CONFIG[activeDomain].label}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${DOMAIN_CONFIG[activeDomain].bgBadge}`}>
                {currentAstronaut.domains[activeDomain].overallStatus.toUpperCase()}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 italic">
              "{currentAstronaut.domains[activeDomain].keyObservation}"
            </p>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
            Click 'Edit Value' on any metric to simulate sensor anomalies
          </span>
        </div>

        {/* Metrics Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs text-left">
            <thead className="bg-slate-900/80 text-slate-400 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-3.5 py-2.5">Indicator / Metric</th>
                <th className="px-3.5 py-2.5">Current Value</th>
                <th className="px-3.5 py-2.5">Baseline</th>
                <th className="px-3.5 py-2.5">Nominal Range</th>
                <th className="px-3.5 py-2.5">Status</th>
                <th className="px-3.5 py-2.5">Trend</th>
                <th className="px-3.5 py-2.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {currentAstronaut.domains[activeDomain].metrics.map((metric) => (
                <tr key={metric.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-3.5 py-3">
                    <div className="font-semibold text-slate-200">{metric.name}</div>
                    <div className="text-[11px] text-slate-500 max-w-xs">{metric.description}</div>
                  </td>
                  <td className="px-3.5 py-3 font-mono font-bold text-sm text-cyan-300">
                    {metric.value} <span className="text-xs font-normal text-slate-400">{metric.unit}</span>
                  </td>
                  <td className="px-3.5 py-3 font-mono text-slate-400">
                    {metric.baseline} {metric.unit}
                  </td>
                  <td className="px-3.5 py-3 font-mono text-slate-400">
                    [{metric.nominalRange[0]} - {metric.nominalRange[1]}] {metric.unit}
                  </td>
                  <td className="px-3.5 py-3">{getStatusBadge(metric.status)}</td>
                  <td className="px-3.5 py-3">
                    <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                      {getTrendIcon(metric.trend)}
                      <span className="capitalize">{metric.trend}</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3">
                    <button
                      onClick={() => {
                        setEditingMetric(metric);
                        setTempMetricValue(String(metric.value));
                      }}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700 cursor-pointer transition-colors"
                    >
                      <Sliders className="w-3 h-3 text-cyan-400" />
                      <span>Adjust</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adjusting Metric Value */}
      {editingMetric && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Simulate Telemetry: {editingMetric.name}
              </h3>
              <button
                onClick={() => setEditingMetric(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Change the telemetry value to test how the AI identifies trends, anomalous changes, and risk patterns.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 block">
                Value ({editingMetric.unit}) [Nominal: {editingMetric.nominalRange[0]} - {editingMetric.nominalRange[1]}]:
              </label>
              <input
                type="number"
                step="any"
                value={tempMetricValue}
                onChange={(e) => setTempMetricValue(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingMetric(null)}
                className="px-3 py-1.5 rounded text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveMetricValue}
                className="px-4 py-1.5 rounded text-xs bg-cyan-600 hover:bg-cyan-500 text-white font-medium cursor-pointer shadow glow-cyan"
              >
                Apply Telemetry Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Interpretation Results Display */}
      {interpretationResult && (
        <div className="space-y-5 animate-in fade-in duration-300">
          
          {/* Executive Summary Card */}
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-xl p-5 shadow-xl glow-cyan">
            <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-cyan-500/20">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">
                  Gemini Biomedical Telemetry Synthesis
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                AI ENGINE: {mode.toUpperCase()}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {interpretationResult.executiveSummary}
            </p>
          </div>

          {/* Strict Separation: Observations vs Hypotheses */}
          <ObservationsVsHypothesesPanel
            observations={allObservations}
            hypotheses={allHypotheses}
            unusualChanges={interpretationResult.unusualChanges}
          />

          {/* Potential Risk Patterns Matrix */}
          {interpretationResult.potentialRiskPatterns.length > 0 && (
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Identified Physiological Risk Patterns (Non-Diagnostic)</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {interpretationResult.potentialRiskPatterns.map((rp, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-900/80 border border-slate-800 rounded-lg p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-xs text-white capitalize">
                        {rp.domain} Risk
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-500/40 uppercase">
                        {rp.riskLevel}
                      </span>
                    </div>
                    <div className="text-xs text-slate-200 font-medium">
                      {rp.description}
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed">
                      <strong className="text-slate-300">Physiological Mechanism:</strong> {rp.physiologicalMechanism}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Inquiries for Flight Surgeons */}
          {interpretationResult.recommendedQuestionsForSurgeon.length > 0 && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Recommended Questions for Flight Surgeon / BME Team</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {interpretationResult.recommendedQuestionsForSurgeon.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-slate-950/70 p-2.5 rounded border border-slate-850">
                    <span className="text-cyan-400 font-mono font-bold">Q{idx + 1}:</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Verified Ground Truth References */}
          {interpretationResult.citations.length > 0 && (
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-2 mb-2">
                <FileText className="w-3.5 h-3.5 text-emerald-400" />
                <span>Relevant NASA Research Citations</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {interpretationResult.citations.map((cit, idx) => (
                  <button
                    key={idx}
                    onClick={() => onOpenResearchDoc && onOpenResearchDoc(cit.docId)}
                    className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-850 border border-emerald-500/30 rounded px-2.5 py-1 text-xs text-slate-300 hover:text-white cursor-pointer transition-all"
                  >
                    <span className="font-mono text-[10px] text-emerald-400 font-bold">[{cit.ntrsId}]</span>
                    <span>{cit.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Disclaimer */}
          <div className="text-[11px] text-slate-500 border-t border-slate-850 pt-2 font-mono">
            * {interpretationResult.disclaimer}
          </div>

        </div>
      )}

    </div>
  );
};
