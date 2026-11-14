import React from 'react';
import { 
  X, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  Microscope, 
  Compass, 
  Layers, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import { ResearchEvidence } from '../types/evidence.types';

interface EvidenceDetailPanelProps {
  evidence: ResearchEvidence | null;
  onClose: () => void;
}

export const EvidenceDetailPanel: React.FC<EvidenceDetailPanelProps> = ({ evidence, onClose }) => {
  if (!evidence) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-space-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-start justify-between gap-4 bg-space-950/60">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-space-800 text-cyan-400 border border-slate-700">
                {evidence.evidenceCode}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-space-800 text-slate-300 border border-slate-700">
                {evidence.sourceOrganization}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Published {evidence.publicationDate}
              </span>
              {evidence.isDirectHumanEvidence ? (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-700/80 font-medium">
                  HUMAN ASTRONAUT STUDY
                </span>
              ) : (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/80 font-medium">
                  NON-HUMAN / ANALOG MODEL
                </span>
              )}
            </div>
            <h2 className="text-lg md:text-xl font-bold text-slate-100 leading-snug">
              {evidence.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-space-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          
          {/* Scientific Caveat Alert */}
          {!evidence.isDirectHumanEvidence && (
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <span className="font-semibold text-amber-300">Scientific Translation Safeguard:</span> This record reports on an animal model, in-vitro cell culture, or ground analog. In accordance with NASA scientific standards, findings from non-human or ground models provide biological plausibility and mechanistic clues, but must never be cited as direct confirmation of human astronaut health outcomes during deep-space missions.
              </div>
            </div>
          )}

          {/* Quick Scientific Specs Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Study Classification
              </div>
              <div className="text-xs font-medium text-slate-200 capitalize">
                {evidence.studyType.replace('_', ' ')}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                <Microscope className="w-3.5 h-3.5 text-cyan-400" /> Organism / System
              </div>
              <div className="text-xs font-medium text-slate-200 truncate">
                {evidence.organism || 'Not reported'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Sample Size
              </div>
              <div className="text-xs font-mono font-medium text-slate-200 truncate">
                {evidence.sampleSize || 'Not reported'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> Environment
              </div>
              <div className="text-xs font-medium text-slate-200 truncate">
                {evidence.experimentalEnvironment || 'Not reported'}
              </div>
            </div>
          </div>

          {/* Study Population Details */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-cyan-400" /> Study Cohort & Population
            </h4>
            <div className="p-3.5 rounded-xl bg-space-950/60 border border-slate-800/80 text-xs leading-relaxed text-slate-200">
              {evidence.population || 'Not reported'}
            </div>
          </div>

          {/* Methodology & Measurement Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Experimental Protocol & Methodology
              </h4>
              <div className="p-3.5 rounded-xl bg-space-950/60 border border-slate-800/80 text-xs leading-relaxed text-slate-200 min-h-[100px]">
                {evidence.methodology || 'Not reported'}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Measurement Instruments & Assays
              </h4>
              <div className="p-3.5 rounded-xl bg-space-950/60 border border-slate-800/80 text-xs leading-relaxed text-slate-200 min-h-[100px]">
                {evidence.measurementMethods || 'Not reported'}
              </div>
            </div>
          </div>

          {/* Key Validated Findings */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Validated Scientific Observations & Findings
            </h4>
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs leading-relaxed text-slate-100">
              {evidence.findings || 'Not reported'}
            </div>
          </div>

          {/* Study Limitations and Generalizability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-space-950/90 border border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Documented Study Limitations
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                {evidence.limitations || 'Not reported in retrieved record.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-space-950/90 border border-slate-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-violet-400" /> Deep-Space Human Generalizability
              </h4>
              <p className="text-xs leading-relaxed text-slate-300">
                {evidence.generalizability || 'Not evaluated.'}
              </p>
            </div>
          </div>

          {/* External Verification Links */}
          <div className="p-4 rounded-xl bg-space-950/40 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="text-slate-400">
              Official Reference Verification:
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {evidence.doi && (
                <a
                  href={`https://doi.org/${evidence.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
                >
                  DOI: {evidence.doi} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {evidence.ntrsId && (
                <a
                  href={`https://ntrs.nasa.gov/citations/${evidence.ntrsId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors font-mono"
                >
                  NASA NTRS: {evidence.ntrsId} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              {evidence.sourceUrl && (
                <a
                  href={evidence.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 flex items-center gap-1.5 transition-colors font-medium"
                >
                  Original Publication <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-space-950/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            Target HRP Risk Codes: {evidence.relatedRiskIds.join(', ')}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
          >
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};
