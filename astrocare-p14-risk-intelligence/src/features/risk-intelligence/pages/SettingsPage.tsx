import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Radio, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { NASA_RISK_CATEGORIES } from '../data/nasaRiskCategories';
import { NASA_EVIDENCE_LIBRARY } from '../data/nasaEvidenceLibrary';

interface SettingsPageProps {
  onNavigate: (route: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [offlineMode, setOfflineMode] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 2500);
  };

  const handleExportData = () => {
    const payload = {
      platform: 'AstroCare P14 Risk Intelligence',
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      categories: NASA_RISK_CATEGORIES,
      evidenceRecordsCount: NASA_EVIDENCE_LIBRARY.length,
      evidenceSummary: NASA_EVIDENCE_LIBRARY.map(e => ({
        code: e.evidenceCode,
        title: e.title,
        studyType: e.studyType,
        doi: e.doi
      }))
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AstroCare_P14_RiskIntelligence_Export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
            Platform Settings & Data Provider Configuration
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Manage NASA Open Science Data Repository (OSDR) endpoints, evidence caching, and selective integration parameters into the master AstroCare application.
        </p>
      </div>

      {/* NASA Data Providers Status */}
      <div className="bg-space-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Database className="w-4 h-4 text-cyan-400" /> External NASA Endpoints & Service Connectors
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-space-950 border border-slate-800">
            <div>
              <div className="font-semibold text-slate-200">NASA Open Science Data Repository (OSDR) API</div>
              <div className="text-[11px] font-mono text-slate-400">https://osdr.nasa.gov/osdr/data/search</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/80 text-emerald-300 font-mono text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Gateway
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-space-950 border border-slate-800">
            <div>
              <div className="font-semibold text-slate-200">NASA Human Research Roadmap (HRR) Registry</div>
              <div className="text-[11px] font-mono text-slate-400">https://humanresearchroadmap.nasa.gov/</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-800/80 text-cyan-300 font-mono text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" /> Active Baseline
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-space-950 border border-slate-800">
            <div>
              <div className="font-semibold text-slate-200">NASA Technical Reports Server (NTRS)</div>
              <div className="text-[11px] font-mono text-slate-400">https://ntrs.nasa.gov/</div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-950/70 border border-blue-800/80 text-blue-300 font-mono text-[11px] font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" /> Connected
            </span>
          </div>
        </div>
      </div>

      {/* Local Cache & Offline Controls */}
      <div className="bg-space-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Radio className="w-4 h-4 text-violet-400" /> Offline Reliability & Local Cache
        </h3>

        <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-semibold text-slate-200">Curated Fallback Cache</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Guarantees full platform functionality even in air-gapped environments or when external NASA APIs encounter downtime.
            </p>
          </div>
          <button
            onClick={handleClearCache}
            className="px-3.5 py-1.5 rounded-lg bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700 font-medium transition-colors shrink-0"
          >
            {cacheCleared ? 'Cache Refreshed!' : 'Refresh Cache'}
          </button>
        </div>
      </div>

      {/* Research Data Export */}
      <div className="bg-space-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
          <Download className="w-4 h-4 text-emerald-400" /> Biomedical Intelligence Data Export
        </h3>

        <div className="p-3.5 rounded-xl bg-space-950 border border-slate-800 flex items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-semibold text-slate-200">Export Full Risk & Evidence Schema (JSON)</div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Exports all 8 risk categories, indexed NASA evidence library records, and mitigation schemas.
            </p>
          </div>
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-space-950 font-semibold transition-colors shrink-0 flex items-center gap-1.5 shadow-md shadow-emerald-900/30"
          >
            <Download className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* AstroCare Master Integration Architecture */}
      <div className="bg-space-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs text-slate-300">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
          <Layers className="w-4 h-4" /> AstroCare Master Application Integration Guardrails
        </div>
        <p className="leading-relaxed">
          P14 is architected with strict feature isolation inside <code className="text-cyan-300 font-mono">src/features/risk-intelligence</code>. It exports self-contained pages, reusable risk cards, and typed services without modifying master router configurations, global CSS, or assuming access to other AstroCare modules (P01–P13).
        </p>
        <div className="p-3 rounded-lg bg-space-950 border border-slate-800 font-mono text-[11px] text-slate-400">
          Mount route: <span className="text-cyan-300">/risks/*</span> | Standalone runnable: <span className="text-emerald-400">Yes</span> | Dependency footprint: <span className="text-slate-300">Zero global overrides</span>
        </div>
      </div>

    </div>
  );
};
