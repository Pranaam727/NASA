// ============================================================================
// AstroCare Module E: Infrastructure, Backend & Database Health View
// Real-time endpoint health checks, latency tracking, and dependency status.
// ============================================================================

import React, { useState } from 'react';
import { 
  Server, 
  Activity, 
  RefreshCw, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { InfrastructureHealthResult } from '../types';
import { INITIAL_INFRASTRUCTURE_HEALTH, pingServiceEndpoint } from '../services/infrastructureHealthService';
import { StatusBadge } from './StatusBadge';

export const InfrastructureHealthView: React.FC = () => {
  const [services, setServices] = useState<InfrastructureHealthResult[]>(INITIAL_INFRASTRUCTURE_HEALTH);
  const [isSimulatedMode, setIsSimulatedMode] = useState(true);
  const [probingServiceId, setProbingServiceId] = useState<string | null>(null);

  const handlePingOne = async (srv: InfrastructureHealthResult) => {
    setProbingServiceId(srv.serviceId);
    const updated = await pingServiceEndpoint(srv, isSimulatedMode);
    setServices(prev => prev.map(s => s.serviceId === updated.serviceId ? updated : s));
    setProbingServiceId(null);
  };

  const handlePingAll = async () => {
    setProbingServiceId('all');
    const updatedList = await Promise.all(
      services.map(s => pingServiceEndpoint(s, isSimulatedMode))
    );
    setServices(updatedList);
    setProbingServiceId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              INFRASTRUCTURE TELEMETRY
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Mode: {isSimulatedMode ? 'Calibrated Simulation' : 'Live Endpoints Probe'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Backend Gateway, Database & API Infrastructure Health
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Monitors proxy latencies, health probe endpoints, and database connection pools without exposing credentials or executing destructive queries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Simulated Mode Toggle */}
          <button
            onClick={() => setIsSimulatedMode(!isSimulatedMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white transition-all"
          >
            {isSimulatedMode ? (
              <ToggleRight className="w-5 h-5 text-cyan-400" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-slate-500" />
            )}
            <span>{isSimulatedMode ? 'Simulation Mode' : 'Live Mode'}</span>
          </button>

          <button
            onClick={handlePingAll}
            disabled={probingServiceId !== null}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${probingServiceId ? 'animate-spin' : ''}`} />
            <span>Probe All</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map(srv => {
          const isProbing = probingServiceId === srv.serviceId || probingServiceId === 'all';

          return (
            <div 
              key={srv.serviceId} 
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 shadow-lg flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-950 text-cyan-400 rounded-lg border border-slate-800">
                      {srv.type === 'database' ? <Database className="w-4 h-4" /> : <Server className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{srv.name}</h3>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">{srv.type}</span>
                    </div>
                  </div>
                  <StatusBadge status={srv.status} size="sm" />
                </div>

                {/* Endpoint & latency stats */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 my-3 font-mono text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Probe Endpoint:</span>
                    <span className="text-cyan-300 truncate max-w-[180px]">{srv.endpoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Response Latency:</span>
                    <span className={`font-bold ${
                      srv.latencyMs < 100 ? 'text-emerald-400' : srv.latencyMs < 300 ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {srv.latencyMs} ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Availability:</span>
                    <span className="text-emerald-400">{srv.uptimePercent}% uptime</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Evaluation Source:</span>
                    <span className={srv.isSimulated ? 'text-purple-400' : 'text-emerald-400'}>
                      {srv.isSimulated ? 'SIMULATED HARNESS' : 'LIVE NETWORK PROBE'}
                    </span>
                  </div>
                </div>

                {/* Dependencies */}
                {srv.dependencies.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1.5">
                      Subsystem Dependencies:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {srv.dependencies.map((dep, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
                          {dep}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer action */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono">
                  Checked: {new Date(srv.lastChecked).toLocaleTimeString()}
                </span>

                <button
                  onClick={() => handlePingOne(srv)}
                  disabled={isProbing}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-slate-800 hover:bg-slate-750 text-white rounded border border-slate-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isProbing ? 'animate-spin' : ''}`} />
                  <span>{isProbing ? 'Pinging...' : 'Ping Endpoint'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
