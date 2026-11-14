import React, { useState } from 'react';
import { NasaOsdrService } from '../services/nasaOsdrService';
import { 
  Settings, Server, Database, ShieldCheck, RefreshCw, 
  CheckCircle2, AlertCircle, Save, HardDrive 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [providerMode, setProviderMode] = useState<'LIVE_WITH_FALLBACK' | 'LIVE_STRICT' | 'OFFLINE_BENCHMARK'>('LIVE_WITH_FALLBACK');
  const [proxyUrl, setProxyUrl] = useState('/api/osdr');
  const [directUrl, setDirectUrl] = useState('https://osdr.nasa.gov/osdr/data');
  const [useProxy, setUseProxy] = useState(true);
  const [cacheTimeout, setCacheTimeout] = useState(60);
  const [testStatus, setTestStatus] = useState<{ testing: boolean; success?: boolean; message?: string }>({ testing: false });
  const [saved, setSaved] = useState(false);

  const handleTestConnection = async () => {
    setTestStatus({ testing: true });
    try {
      const service = NasaOsdrService.getInstance();
      const res = await service.searchStudies({ query: 'spaceflight', pageSize: 1 });
      if (res && res.results.length > 0) {
        setTestStatus({
          testing: false,
          success: true,
          message: `Connection successful (${res.provenance}). Retrieved: ${res.results[0].studyId}`
        });
      } else {
        setTestStatus({
          testing: false,
          success: false,
          message: 'Received response from OSDR API but no study items returned.'
        });
      }
    } catch (err: any) {
      setTestStatus({
        testing: false,
        success: false,
        message: err?.message || 'Failed to connect to NASA OSDR endpoint.'
      });
    }
  };

  const handleSaveSettings = () => {
    const service = NasaOsdrService.getInstance();
    service.setPreferLive(providerMode !== 'OFFLINE_BENCHMARK');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Telemetry & Data Provider Architecture
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Repository Provider Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Configure NASA Open Science Data Repository (OSDR) upstream API connection endpoints, dev server CORS proxying, and local benchmark fallback policies.
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold transition-colors"
        >
          {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Settings Saved' : 'Save Configuration'}</span>
        </button>
      </div>

      {/* Provider Mode Selection */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-100">NASA OSDR Provider Mode</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() => setProviderMode('LIVE_WITH_FALLBACK')}
            className={`p-4 rounded-xl border text-left transition-all ${
              providerMode === 'LIVE_WITH_FALLBACK'
                ? 'bg-cyan-500/15 border-cyan-500/40 ring-1 ring-cyan-500/30'
                : 'bg-slate-950 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-200">Live with Fallback</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Attempts live NASA OSDR queries first; falls back seamlessly to verified cached benchmark datasets if offline or rate-limited.
            </p>
          </button>

          <button
            onClick={() => setProviderMode('LIVE_STRICT')}
            className={`p-4 rounded-xl border text-left transition-all ${
              providerMode === 'LIVE_STRICT'
                ? 'bg-cyan-500/15 border-cyan-500/40 ring-1 ring-cyan-500/30'
                : 'bg-slate-950 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-200">Strict Live Only</span>
              <span className="w-2 h-2 rounded-full bg-blue-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Direct live connection only. Fails with diagnostic error if remote NASA endpoints are unreachable.
            </p>
          </button>

          <button
            onClick={() => setProviderMode('OFFLINE_BENCHMARK')}
            className={`p-4 rounded-xl border text-left transition-all ${
              providerMode === 'OFFLINE_BENCHMARK'
                ? 'bg-cyan-500/15 border-cyan-500/40 ring-1 ring-cyan-500/30'
                : 'bg-slate-950 border-slate-800 hover:bg-slate-850'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-slate-200">Offline Benchmark</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Air-gapped operation utilizing authentic cached spaceflight studies (OSD-575, OSD-53, OSD-661, etc.) without external network queries.
            </p>
          </button>
        </div>
      </div>

      {/* Network Endpoint Settings */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2">
          <HardDrive className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-bold text-slate-100">API Endpoint Configuration</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Development Server Proxy Route (Handles CORS)
            </label>
            <input
              type="text"
              value={proxyUrl}
              onChange={e => setProxyUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
              Official NASA OSDR Root URL
            </label>
            <input
              type="text"
              value={directUrl}
              onChange={e => setDirectUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleTestConnection}
              disabled={testStatus.testing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus.testing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{testStatus.testing ? 'Testing Endpoint...' : 'Test NASA OSDR Connection'}</span>
            </button>

            {testStatus.message && (
              <span className={`text-xs font-mono flex items-center gap-1.5 ${
                testStatus.success ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {testStatus.success ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                {testStatus.message}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
