// ============================================================================
// AstroCare Status Badge and Provenance Tag Components
// ============================================================================

import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Clock, Database, Globe, Cpu } from 'lucide-react';
import { ModuleIntegrationStatusType, VerificationState } from '../types';

interface StatusBadgeProps {
  status: ModuleIntegrationStatusType | VerificationState | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = String(status).toLowerCase().replace(/_/g, ' ');

  let bgClass = 'bg-slate-800 text-slate-300 border-slate-700';
  let icon = <Clock className="w-3 h-3" />;

  switch (norm) {
    case 'integrated':
    case 'passed':
    case 'healthy':
    case 'online':
    case 'compliant':
    case 'valid':
      bgClass = 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80';
      icon = <CheckCircle className="w-3 h-3" />;
      break;

    case 'partially integrated':
    case 'warning':
    case 'degraded':
    case 'advisory':
    case 'mock active':
      bgClass = 'bg-amber-950/80 text-amber-400 border-amber-800/80';
      icon = <AlertTriangle className="w-3 h-3" />;
      break;

    case 'failed':
    case 'blocked':
    case 'down':
    case 'critical finding':
    case 'missing':
    case 'invalid format':
      bgClass = 'bg-rose-950/80 text-rose-400 border-rose-800/80';
      icon = <XCircle className="w-3 h-3" />;
      break;

    case 'pending':
    case 'not run':
    case 'not verified':
    case 'untested':
      bgClass = 'bg-slate-800 text-slate-400 border-slate-700';
      icon = <Clock className="w-3 h-3" />;
      break;
  }

  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border uppercase tracking-wider font-mono ${padding} ${bgClass}`}>
      {icon}
      <span>{norm}</span>
    </span>
  );
};

interface ProvenanceTagProps {
  tag: string;
  organism?: string;
}

export const ProvenanceTag: React.FC<ProvenanceTagProps> = ({ tag, organism }) => {
  let icon = <Globe className="w-3 h-3" />;
  let color = 'text-cyan-400 border-cyan-800/60 bg-cyan-950/40';

  if (tag.includes('SIMULAT') || tag.includes('SYNTHETIC')) {
    icon = <Cpu className="w-3 h-3" />;
    color = 'text-purple-400 border-purple-800/60 bg-purple-950/40';
  } else if (tag.includes('OSDR') || tag.includes('HRP') || tag.includes('NASA')) {
    icon = <Database className="w-3 h-3" />;
    color = 'text-sky-400 border-sky-800/60 bg-sky-950/40';
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase tracking-wider ${color}`}>
        {icon}
        <span>{tag}</span>
      </span>
      {organism && (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
          {organism}
        </span>
      )}
    </div>
  );
};
