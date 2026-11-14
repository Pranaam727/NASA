import React, { useState } from 'react';
import { RiskCategory } from '../types/risk.types';
import { NasaResearchService } from '../services/nasaResearchService';
import { Layers, ShieldAlert, Award } from 'lucide-react';

interface RiskComparisonChartProps {
  categoryIds: string[];
}

export const RiskComparisonChart: React.FC<RiskComparisonChartProps> = ({ categoryIds }) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'systems' | 'vulnerability'>('evidence');

  const comparison = NasaResearchService.compareRiskCategories(
    categoryIds.length > 0 ? categoryIds : ['RAD', 'CARDIO', 'BONE', 'SANS']
  );

  return (
    <div className="bg-space-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      
      {/* Header and View Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" /> Multi-Domain Research Analytics & Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparing {comparison.categories.length} selected NASA HRP biomedical risk domains
          </p>
        </div>

        <div className="flex items-center gap-1 bg-space-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'evidence' ? 'bg-cyan-950 text-cyan-300 font-medium border border-cyan-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Evidence Volume
          </button>
          <button
            onClick={() => setActiveTab('systems')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'systems' ? 'bg-cyan-950 text-cyan-300 font-medium border border-cyan-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Physiological Systems
          </button>
          <button
            onClick={() => setActiveTab('vulnerability')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'vulnerability' ? 'bg-cyan-950 text-cyan-300 font-medium border border-cyan-800/80' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mission Vulnerability
          </button>
        </div>
      </div>

      {/* Tab 1: Evidence Breakdown Bar Chart */}
      {activeTab === 'evidence' && (
        <div className="space-y-4 pt-2">
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Indexed Human Studies vs Ground Analog vs Pre-Clinical Models</span>
            <span className="font-mono text-[11px] text-slate-400">Total HRP Database Records</span>
          </div>

          <div className="space-y-3">
            {comparison.categories.map(cat => {
              const summary = cat.evidenceQualitySummary;
              const maxStudies = 250; // visual scaling
              const humanPct = (summary.astronautStudiesCount / maxStudies) * 100;
              const analogPct = (summary.groundAnalogCount / maxStudies) * 100;
              const animalPct = (summary.animalStudiesCount / maxStudies) * 100;

              return (
                <div key={cat.id} className="space-y-1.5 bg-space-950/40 p-3 rounded-lg border border-slate-800/60">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                      <span className="font-semibold text-slate-200">{cat.title} ({cat.code})</span>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px]">
                      {summary.astronautStudiesCount} human / {summary.groundAnalogCount} analog / {summary.animalStudiesCount} pre-clinical
                    </span>
                  </div>

                  {/* Multi-segment Progress Bar */}
                  <div className="h-3 w-full bg-space-800 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-500 hover:bg-emerald-400 transition-all" 
                      style={{ width: `${humanPct}%` }}
                      title={`Human Flight Studies: ${summary.astronautStudiesCount}`}
                    />
                    <div 
                      className="bg-cyan-500 hover:bg-cyan-400 transition-all" 
                      style={{ width: `${analogPct}%` }}
                      title={`Ground Analog Studies: ${summary.groundAnalogCount}`}
                    />
                    <div 
                      className="bg-violet-500 hover:bg-violet-400 transition-all" 
                      style={{ width: `${animalPct}%` }}
                      title={`Pre-clinical Animal/Cell Studies: ${summary.animalStudiesCount}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-[11px] text-slate-400 border-t border-slate-800/70">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Direct Astronaut Flight Studies
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Ground-Based Analogs (Bed Rest / Isolation)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> Pre-Clinical Animal & Cell Models
            </span>
          </div>
        </div>
      )}

      {/* Tab 2: Affected Physiological Systems */}
      {activeTab === 'systems' && (
        <div className="space-y-4 pt-2">
          <div className="p-3 rounded-lg bg-cyan-950/20 border border-cyan-800/40 text-xs text-cyan-200">
            <strong>Cross-System Interactions:</strong> Human spaceflight physiological responses are deeply interconnected. Below are the physiological systems influenced by the selected risk categories.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {comparison.categories.map(cat => (
              <div key={cat.id} className="p-3.5 rounded-xl bg-space-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.accentColor }} />
                  <span className="font-semibold text-xs text-slate-100">{cat.title}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {cat.physiologicalSystem.map((sys, idx) => (
                    <span 
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-slate-700/80"
                    >
                      {sys}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 leading-relaxed">
                  <strong>Key pathway:</strong> {cat.mechanisms[0]?.name}
                </div>
              </div>
            ))}
          </div>

          {comparison.commonAffectedSystems.length > 0 && (
            <div className="p-3 rounded-lg bg-space-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Shared Affected Domains:</strong> {comparison.commonAffectedSystems.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Mission Vulnerability Qualitative Matrix */}
      {activeTab === 'vulnerability' && (
        <div className="space-y-3 pt-2">
          <div className="text-xs text-slate-400">
            Research-grounded qualitative relevance across mission destinations:
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-space-950/60">
                  <th className="py-2.5 px-3">Health Risk Domain</th>
                  <th className="py-2.5 px-3">LEO (ISS ~180d)</th>
                  <th className="py-2.5 px-3">Lunar (Artemis ~30d)</th>
                  <th className="py-2.5 px-3">Mars Transit (~1000d)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparison.missionVulnerabilityMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-space-800/40 transition-colors">
                    <td className="py-2 px-3 font-medium text-slate-200">
                      {row.category}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        row.leoSeverity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                        row.leoSeverity === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        row.leoSeverity === 'MODERATE' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {row.leoSeverity}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        row.lunarSeverity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                        row.lunarSeverity === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        row.lunarSeverity === 'MODERATE' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {row.lunarSeverity}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        row.marsSeverity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                        row.marsSeverity === 'HIGH' ? 'bg-amber-950 text-amber-300 border-amber-800' :
                        row.marsSeverity === 'MODERATE' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                        'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {row.marsSeverity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 italic pt-1">
            * Assessments reflect NASA Human Research Roadmap risk postures without additional unproven countermeasure architectures.
          </p>
        </div>
      )}

    </div>
  );
};
