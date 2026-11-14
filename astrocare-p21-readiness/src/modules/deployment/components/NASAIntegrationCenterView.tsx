// ============================================================================
// AstroCare Module C: NASA Integration & Scientific Provenance Center View
// Rigorous verification of official NASA research portals, APIs, and datasets.
// ============================================================================

import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Database,
  Key,
  ShieldAlert,
  Layers,
  Sparkles
} from 'lucide-react';
import { NASAResourceStatus } from '../types';
import { StatusBadge, ProvenanceTag } from './StatusBadge';
import { verifyNASAResourceConnectivity, verifyAllNASAResources } from '../services/nasaVerifier';

interface NASAIntegrationCenterViewProps {
  sources: NASAResourceStatus[];
  onSourcesUpdated: (newSources: NASAResourceStatus[]) => void;
}

export const NASAIntegrationCenterView: React.FC<NASAIntegrationCenterViewProps> = ({
  sources,
  onSourcesUpdated
}) => {
  const [isVerifyingAll, setIsVerifyingAll] = useState(false);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerifyOne = async (resource: NASAResourceStatus) => {
    setVerifyingId(resource.id);
    const updated = await verifyNASAResourceConnectivity(resource);
    const newSources = sources.map(s => s.id === updated.id ? updated : s);
    onSourcesUpdated(newSources);
    setVerifyingId(null);
  };

  const handleVerifyAll = async () => {
    setIsVerifyingAll(true);
    const updated = await verifyAllNASAResources(sources);
    onSourcesUpdated(updated);
    setIsVerifyingAll(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
              NASA SCIENTIFIC PROVENANCE
            </span>
            <span className="text-xs text-slate-400 font-mono">
              7 Official NASA Repositories
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            NASA Data Source Connectivity & Scientific Provenance Verification
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Enforces strict differentiation between Link Availability, API Connectivity, Authentication Validity, Dataset Availability, and Actual Data Retrieval. Never fabricates live connections.
          </p>
        </div>

        <button
          onClick={handleVerifyAll}
          disabled={isVerifyingAll}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-lg shadow-md transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isVerifyingAll ? 'animate-spin' : ''}`} />
          <span>{isVerifyingAll ? 'Verifying All Sources...' : 'Verify All NASA Endpoints'}</span>
        </button>
      </div>

      {/* NASA Disclaimer Box */}
      <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="text-sky-300 font-bold block mb-0.5">
            NASA Scientific Attribution & Certification Notice:
          </span>
          AstroCare is an aerospace biomedical research and flight-readiness intelligence platform. All research papers, datasets, and guidelines are cited directly from NASA Human Research Program (HRP), Open Science Data Repository (OSDR), and Life Sciences Data Archive (LSDA). AstroCare is not an official NASA agency product, and outputs do not constitute certified medical diagnoses.
        </div>
      </div>

      {/* NASA Sources Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {sources.map(source => {
          const isVerifying = verifyingId === source.id || isVerifyingAll;
          const v = source.verificationLevel;

          return (
            <div 
              key={source.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {source.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1.5 flex items-center gap-1.5">
                      {source.name}
                    </h3>
                  </div>
                  <StatusBadge status={source.connectivityStatus} size="sm" />
                </div>

                {/* Provenance & Organism Context */}
                <div className="mb-4">
                  <ProvenanceTag tag={source.provenanceTag} organism={source.organismContext} />
                </div>

                {/* 5-Tier Verification State Matrix */}
                <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 mb-4 space-y-2 font-mono text-xs">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1.5 border-b border-slate-850 pb-1">
                    5-Tier Verification Levels:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {v.linkAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      <span className={v.linkAvailable ? 'text-slate-200' : 'text-slate-500'}>Link Reachable</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {v.apiConnectivity ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      <span className={v.apiConnectivity ? 'text-slate-200' : 'text-slate-500'}>API Online</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {v.authValid ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                      <span className={v.authValid ? 'text-slate-200' : 'text-slate-500'}>Auth ({source.authRequirement})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {v.datasetAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      <span className={v.datasetAvailable ? 'text-slate-200' : 'text-slate-500'}>Datasets Listed</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      {v.actualDataRetrieved ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                      <span className={v.actualDataRetrieved ? 'text-slate-200' : 'text-slate-400'}>
                        {v.actualDataRetrieved ? 'Payload Retrieved' : 'Schema Verified (Async Payload)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metadata Details */}
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Integration Type:</span>
                    <span className="font-mono text-slate-200">{source.integrationType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Freshness:</span>
                    <span className="font-mono text-cyan-300">{source.dataFreshness}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Verification Latency:</span>
                    <span className="font-mono text-emerald-400">{source.latencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Successful Audit:</span>
                    <span className="font-mono text-slate-400">{new Date(source.lastSuccessfulVerification).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Citation */}
                <div className="mt-3 p-2.5 bg-slate-950/60 rounded border border-slate-800 text-[11px] text-slate-400 italic">
                  "{source.citationString}"
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <a
                  href={source.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"
                >
                  <span>Official NASA Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => handleVerifyOne(source)}
                  disabled={isVerifying}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-white rounded-lg border border-slate-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>{isVerifying ? 'Probing...' : 'Re-verify'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
