import React, { useState } from 'react';
import { useMissionRiskAnalysis } from '../hooks/useMissionRiskAnalysis';
import { MissionConfiguration } from '../components/MissionConfiguration';
import { QualitativeRiskRelevance } from '../types/mission.types';
import { 
  Rocket, 
  ShieldAlert, 
  Layers, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Split,
  FileText,
  Clock,
  Radio,
  MapPin,
  Compass
} from 'lucide-react';

interface MissionRiskAnalysisPageProps {
  onNavigate: (route: string) => void;
}

export const MissionRiskAnalysisPage: React.FC<MissionRiskAnalysisPageProps> = ({ onNavigate }) => {
  const {
    presets,
    selectedPresetId,
    activeMission,
    comparisonMission,
    isComparing,
    setIsComparing,
    report,
    comparisonReport,
    selectPreset,
    updateMissionParam,
    updateComparisonParam
  } = useMissionRiskAnalysis();

  const [activeTab, setActiveTab] = useState<'assessments' | 'constraints' | 'assumptions'>('assessments');

  const getRelevanceBadge = (rel: QualitativeRiskRelevance) => {
    switch (rel) {
      case 'CRITICAL':
        return 'bg-rose-950/80 text-rose-300 border-rose-700 font-bold';
      case 'HIGH':
        return 'bg-amber-950/80 text-amber-300 border-amber-700 font-semibold';
      case 'MODERATE':
        return 'bg-blue-950/80 text-blue-300 border-blue-700 font-medium';
      case 'MONITORED_CONTROLLED':
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-700 font-medium';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Rocket className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              Mission Biomedical Risk Analysis & Architecture Evaluation
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Qualitative research-grounded synthesis linking mission duration, radiation environment, gravity vectors, and communications latency to NASA Human Research Program risk postures and operational mitigations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsComparing(!isComparing)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isComparing 
                ? 'bg-cyan-500 text-space-950 shadow-md shadow-cyan-500/20' 
                : 'bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Split className="w-4 h-4" />
            {isComparing ? 'Exit Comparison Mode' : 'Compare Two Mission Profiles'}
          </button>
        </div>
      </div>

      {/* Mandatory Scientific Integrity Disclaimer */}
      <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
          <Sparkles className="w-4 h-4" /> NASA Human Research Program Scientific Rule
        </div>
        <p className="leading-relaxed text-[11px] text-slate-400">
          {report.disclaimerNotice}
        </p>
      </div>

      {/* Mission Configurator */}
      <div className={`grid grid-cols-1 ${isComparing ? 'lg:grid-cols-2' : ''} gap-6`}>
        <MissionConfiguration
          mission={activeMission}
          presets={presets}
          selectedPresetId={selectedPresetId}
          onSelectPreset={selectPreset}
          onChange={updateMissionParam}
          titlePrefix={isComparing ? 'Primary Mission Profile (A)' : 'Configured Mission Profile'}
        />

        {/* Comparison Configurator if active */}
        {isComparing && (
          <MissionConfiguration
            mission={comparisonMission}
            presets={presets}
            selectedPresetId="custom"
            onSelectPreset={(pId) => {
              const found = presets.find(p => p.id === pId);
              if (found) updateComparisonParam(found);
            }}
            onChange={updateComparisonParam}
            titlePrefix="Comparison Mission Profile (B)"
          />
        )}
      </div>

      {/* Side-by-Side Comparison Delta Table (if isComparing) */}
      {isComparing && comparisonReport && (
        <div className="bg-space-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              <Split className="w-4 h-4 text-cyan-400" /> Comparative Mission Risk Analysis: {activeMission.missionName} vs {comparisonMission.missionName}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side delta in qualitative risk relevance driven by duration, radiation fields, and gravity states
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider bg-space-950/60">
                  <th className="py-2.5 px-3">Risk Domain</th>
                  <th className="py-2.5 px-3">Mission A Relevance</th>
                  <th className="py-2.5 px-3">Mission B Relevance</th>
                  <th className="py-2.5 px-3">Severity Delta</th>
                  <th className="py-2.5 px-3">Comparative Environmental Drivers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {comparisonReport.deltaRiskSummary.map((delta, idx) => (
                  <tr key={idx} className="hover:bg-space-800/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-200">
                      {delta.riskTitle} ({delta.riskCategoryId})
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getRelevanceBadge(delta.relevanceA)}`}>
                        {delta.relevanceA}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${getRelevanceBadge(delta.relevanceB)}`}>
                        {delta.relevanceB}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold">
                      {delta.severityDelta === 'HIGHER_IN_B' ? (
                        <span className="text-rose-400">↑ Elevated in B</span>
                      ) : delta.severityDelta === 'HIGHER_IN_A' ? (
                        <span className="text-amber-400">↑ Elevated in A</span>
                      ) : (
                        <span className="text-slate-400">Equivalent</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {delta.comparativeDrivers}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Executive Qualitative Synthesis */}
      <div className="bg-space-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-slate-100">
              Biomedical Evaluation Synthesis: {activeMission.missionName}
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Generated {report.generatedDate.slice(0, 10)}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed bg-space-950/70 p-4 rounded-lg border border-slate-800/80">
          {report.qualitativeSummary}
        </p>

        {/* Operational Constraints Pills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 pt-2 text-xs">
          {report.missionOperationalConstraints.map((cons, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-space-950 border border-slate-800 text-[11px] text-slate-300">
              {cons}
            </div>
          ))}
        </div>
      </div>

      {/* Tabs: Assessments vs Constraints vs Assumptions */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('assessments')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'assessments' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Domain Relevance Assessments ({report.assessments.length})
        </button>
        <button
          onClick={() => setActiveTab('constraints')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'constraints' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Deep Space Unique Challenges ({report.deepSpaceUniqueChallenges.length})
        </button>
      </div>

      {/* Domain Relevance Cards Grid */}
      {activeTab === 'assessments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.assessments.map(assessment => (
            <div 
              key={assessment.riskCategoryId}
              className="bg-space-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-200">
                  {assessment.riskCategoryId} Domain
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-mono border ${getRelevanceBadge(assessment.qualitativeRelevance)}`}>
                  {assessment.qualitativeRelevance}
                </span>
              </div>

              <div className="text-xs text-slate-200 bg-space-950/70 p-3 rounded-lg border border-slate-800/80 leading-relaxed">
                <span className="text-cyan-400 font-semibold block mb-1">Qualitative Rationale:</span>
                {assessment.primaryRationale}
              </div>

              {/* Environmental Drivers */}
              <div className="space-y-1 text-xs">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Environmental Drivers:</span>
                <div className="flex flex-wrap gap-1">
                  {assessment.environmentalDrivers.map((driver, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-slate-700">
                      {driver}
                    </span>
                  ))}
                </div>
              </div>

              {/* Research Gaps */}
              <div className="space-y-1 text-xs pt-1 border-t border-slate-800/60">
                <span className="text-[10px] uppercase font-semibold text-amber-400">NASA Research Gaps:</span>
                <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                  {assessment.keyResearchGaps.map((gap, idx) => (
                    <li key={idx}>{gap}</li>
                  ))}
                </ul>
              </div>

              {/* Countermeasures & Evidence Codes */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">Mitigations:</span>
                  {assessment.recommendedMitigations.map((m, idx) => (
                    <span key={idx} className="font-mono text-cyan-400 font-medium">{m}</span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <span>Evidence: {assessment.supportingEvidenceCodes.join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Deep Space Challenges Tab */}
      {activeTab === 'constraints' && (
        <div className="bg-space-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-violet-400" /> Deep Space Exploration Medical Constraints
          </h3>

          <div className="space-y-3">
            {report.deepSpaceUniqueChallenges.map((chal, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-space-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{chal}</p>
              </div>
            ))}

            {report.deepSpaceUniqueChallenges.length === 0 && (
              <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-xs text-slate-400 text-center">
                Mission profile is within Low Earth Orbit; emergency medical evacuation to Earth is available within 24 hours.
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
