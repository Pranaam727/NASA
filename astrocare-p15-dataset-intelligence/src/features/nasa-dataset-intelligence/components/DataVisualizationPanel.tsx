import React, { useState } from 'react';
import { ResearchObservation, MeasurementVariable } from '../types/observation.types';
import { DataNormalizationService } from '../services/dataNormalizationService';
import { ReportExportService } from '../services/reportExportService';
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { 
  TrendingUp, BarChart3, ScatterChart as ScatterIcon, Table, 
  Download, Filter, Layers, Info, Check, ShieldCheck 
} from 'lucide-react';

interface DataVisualizationPanelProps {
  observations: ResearchObservation[];
  currentVariable: MeasurementVariable;
  onExportCSV?: () => void;
}

export const DataVisualizationPanel: React.FC<DataVisualizationPanelProps> = ({
  observations,
  currentVariable,
  onExportCSV
}) => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'scatter' | 'table'>('line');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  const [csvDownloaded, setCsvDownloaded] = useState(false);

  // Filter observations by phase if selected
  const filteredData = selectedPhase === 'all' 
    ? observations 
    : observations.filter(o => o.collectionPhase === selectedPhase);

  // Calculate genuine cohort statistics
  const values = filteredData.map(o => o.numericValue);
  const stats = DataNormalizationService.calculateCohortStats(values);

  // Transform data for Recharts
  const chartData = filteredData.map(obs => ({
    name: obs.phaseDayLabel,
    value: obs.numericValue,
    phase: obs.collectionPhase,
    subject: obs.subjectId,
    sample: obs.sampleId,
    unit: obs.originalUnit,
    condition: obs.experimentalCondition,
    day: obs.phaseDay
  }));

  const handleDownloadCSV = () => {
    const csv = ReportExportService.exportObservationsToCSV(filteredData);
    ReportExportService.downloadFile(
      csv, 
      `${currentVariable.studyId}_${currentVariable.variableId}_observations.csv`,
      'text/csv'
    );
    setCsvDownloaded(true);
    setTimeout(() => setCsvDownloaded(false), 2000);
    onExportCSV?.();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-slate-950 border border-slate-700 rounded-xl shadow-xl text-xs space-y-1">
          <div className="font-mono font-bold text-cyan-400">
            {data.name} ({data.phase})
          </div>
          <div className="text-slate-200">
            Value: <span className="font-mono font-bold text-slate-100">{data.value} {data.unit}</span>
          </div>
          <div className="text-slate-400">Subject: {data.subject}</div>
          <div className="text-slate-500 text-[11px] truncate max-w-xs">{data.condition}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5">
      {/* Header with Variable Info & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
              {currentVariable.studyId}
            </span>
            <span className="font-mono text-xs text-slate-400 uppercase">
              Domain: {currentVariable.domain}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-100 mt-1">
            {currentVariable.variableName} ({currentVariable.unit})
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            {currentVariable.description}
          </p>
        </div>

        {/* View Mode & Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart selector pills */}
          <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                chartType === 'line' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Longitudinal Line Chart"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                chartType === 'bar' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Bar Chart by Sampling Epoch"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('scatter')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                chartType === 'scatter' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Scatter Distribution"
            >
              <ScatterIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setChartType('table')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                chartType === 'table' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Data Table View"
            >
              <Table className="w-4 h-4" />
            </button>
          </div>

          {/* Phase Filter dropdown */}
          <select
            value={selectedPhase}
            onChange={e => setSelectedPhase(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/60"
          >
            <option value="all">All Phases ({observations.length})</option>
            <option value="Preflight">Preflight</option>
            <option value="Inflight">Inflight</option>
            <option value="Postflight">Postflight</option>
            <option value="Ground Control">Ground Control</option>
            <option value="Analog Confinement">Analog Confinement</option>
          </select>

          {/* CSV Download */}
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            {csvDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Exported</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Cohort Statistical Summary Bar */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 text-xs">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Sample Count (N)</span>
          <span className="text-sm font-bold font-mono text-slate-200">{stats.count}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Mean</span>
          <span className="text-sm font-bold font-mono text-cyan-400">
            {stats.mean} <span className="text-[10px] text-slate-500 font-normal">{currentVariable.unit}</span>
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Median</span>
          <span className="text-sm font-bold font-mono text-slate-200">{stats.median}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Std Deviation</span>
          <span className="text-sm font-bold font-mono text-slate-200">±{stats.stdDev}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Minimum</span>
          <span className="text-sm font-bold font-mono text-slate-200">{stats.min}</span>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Maximum</span>
          <span className="text-sm font-bold font-mono text-slate-200">{stats.max}</span>
        </div>
      </div>

      {/* Main Visualization Display */}
      <div className="min-h-[320px] w-full flex items-center justify-center">
        {filteredData.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No observations match the selected phase filter.
          </div>
        ) : chartType === 'line' ? (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                dy={8}
              />
              <YAxis 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
              <Line 
                type="monotone" 
                dataKey="value" 
                name={`${currentVariable.variableName} (${currentVariable.unit})`}
                stroke="#06B6D4" 
                strokeWidth={2.5}
                dot={{ fill: '#080C14', stroke: '#06B6D4', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#22D3EE', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : chartType === 'bar' ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis 
                dataKey="name" 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                dy={8}
              />
              <YAxis 
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                name={`${currentVariable.variableName} (${currentVariable.unit})`}
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : chartType === 'scatter' ? (
          <ResponsiveContainer width="100%" height={320}>
            <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis 
                type="number"
                dataKey="day" 
                name="Mission Timeline Day"
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                dy={8}
              />
              <YAxis 
                type="number"
                dataKey="value" 
                name="Value"
                stroke="#64748B" 
                tick={{ fill: '#94A3B8', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter 
                name={currentVariable.variableName} 
                data={chartData} 
                fill="#14B8A6" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          /* Underlying Table View */
          <div className="w-full overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Epoch Label</th>
                  <th className="py-2.5 px-3">Phase</th>
                  <th className="py-2.5 px-3">Value</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Subject ID</th>
                  <th className="py-2.5 px-3">Sample ID</th>
                  <th className="py-2.5 px-3">Experimental Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredData.map(obs => (
                  <tr key={obs.observationId} className="hover:bg-slate-850/50">
                    <td className="py-2 px-3 font-mono text-cyan-300 font-medium">{obs.phaseDayLabel}</td>
                    <td className="py-2 px-3 text-slate-400">{obs.collectionPhase}</td>
                    <td className="py-2 px-3 font-mono font-bold text-slate-100">{obs.numericValue}</td>
                    <td className="py-2 px-3 font-mono text-slate-400">{obs.originalUnit}</td>
                    <td className="py-2 px-3 font-mono text-slate-300">{obs.subjectId}</td>
                    <td className="py-2 px-3 font-mono text-slate-500">{obs.sampleId}</td>
                    <td className="py-2 px-3 text-slate-400 text-[11px] max-w-xs truncate">{obs.experimentalCondition}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Scientific Integrity Note */}
      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Original scientific units ({currentVariable.unit}) and raw observation values strictly preserved without arbitrary rounding or synthetic interpolation.
          </span>
        </div>
        <span className="font-mono text-slate-500">Method: {currentVariable.assayMethod}</span>
      </div>
    </div>
  );
};
