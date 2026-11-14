import React, { useState } from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { DataVisualizationPanel } from '../components/DataVisualizationPanel';
import { BENCHMARK_VARIABLES, BENCHMARK_OBSERVATIONS } from '../data/demoObservations';
import { 
  BarChart2, Filter, Layers, Download, CheckCircle2, 
  Sparkles, FileText, Activity, ShieldCheck 
} from 'lucide-react';

interface VisualizationStudioPageProps {
  datasets: DatasetRecord[];
  onSelectStudy: (studyId: string) => void;
}

export const VisualizationStudioPage: React.FC<VisualizationStudioPageProps> = ({
  datasets,
  onSelectStudy
}) => {
  const [selectedStudyId, setSelectedStudyId] = useState<string>('OSD-575');
  const [selectedVariableId, setSelectedVariableId] = useState<string>('var-il6');

  const studyVariables = BENCHMARK_VARIABLES.filter(v => v.studyId === selectedStudyId);
  const currentVariable = BENCHMARK_VARIABLES.find(v => v.variableId === selectedVariableId) || studyVariables[0] || BENCHMARK_VARIABLES[0];

  const observations = BENCHMARK_OBSERVATIONS.filter(obs => 
    obs.studyId === selectedStudyId && 
    obs.variableId === currentVariable.variableId
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Interactive Biomedical Graphics & Exploration Studio
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Data Visualization Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Multi-modal data exploration workspace. Switch between longitudinal trend curves, grouped sampling epoch histograms, scatter distribution dispersions, and underlying scientific observation matrices.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <span>Interactive Studio Active</span>
        </div>
      </div>

      {/* Selector Controls Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Study Selector */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Target Spaceflight Study Accession
          </label>
          <select
            value={selectedStudyId}
            onChange={e => {
              const newStudyId = e.target.value;
              setSelectedStudyId(newStudyId);
              const vars = BENCHMARK_VARIABLES.filter(v => v.studyId === newStudyId);
              if (vars.length > 0) setSelectedVariableId(vars[0].variableId);
            }}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            <option value="OSD-575">OSD-575: SpaceX Inspiration4 Blood Serum Panel (Human Astronaut)</option>
            <option value="OSD-661">OSD-661: GSK3 Target Murine Lumbar Bone Loss (Animal Model)</option>
            <option value="OSD-2">OSD-2: Iron Ion HZE Radiation Cellular DNA Repair (Human Cell Line)</option>
            <option value="OSD-174">OSD-174: ISS Astronaut Hair Follicle Circadian Clock (Human Astronaut)</option>
          </select>
        </div>

        {/* Variable Selector */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
            Target Biomarker / Physical Measurement
          </label>
          <select
            value={selectedVariableId}
            onChange={e => setSelectedVariableId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
          >
            {studyVariables.map(v => (
              <option key={v.variableId} value={v.variableId}>
                {v.variableName} ({v.unit}) — Domain: {v.domain}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Visualization Panel */}
      <DataVisualizationPanel
        observations={observations}
        currentVariable={currentVariable}
      />
    </div>
  );
};
