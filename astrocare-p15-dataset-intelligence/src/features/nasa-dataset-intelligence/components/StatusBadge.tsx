import React from 'react';
import { ProvenanceType, StudyPopulation, FileAvailabilityStatus } from '../types/dataset.types';
import { Radio, Database, Sparkles, User, PawPrint, TestTube, Globe, CheckCircle2, AlertCircle, FileText, Download } from 'lucide-react';

interface StatusBadgeProps {
  type: 'provenance' | 'population' | 'availability';
  value: ProvenanceType | StudyPopulation | FileAvailabilityStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'sm' }) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  if (type === 'provenance') {
    switch (value) {
      case 'LIVE_NASA_API':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses}`}>
            <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
            LIVE NASA API
          </span>
        );
      case 'CACHED_NASA_BENCHMARK':
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 ${sizeClasses}`}>
            <Database className="w-3 h-3 text-cyan-400" />
            VERIFIED OSDR RECORD
          </span>
        );
      case 'SYNTHETIC_DEMO':
      default:
        return (
          <span className={`inline-flex items-center gap-1 font-mono font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 ${sizeClasses}`}>
            <Sparkles className="w-3 h-3 text-amber-400" />
            DEMONSTRATION VALUE
          </span>
        );
    }
  }

  if (type === 'population') {
    switch (value) {
      case 'human-spaceflight':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 ${sizeClasses}`}>
            <User className="w-3 h-3 text-blue-400" />
            Human Astronaut
          </span>
        );
      case 'human-analog':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 ${sizeClasses}`}>
            <User className="w-3 h-3 text-teal-400" />
            Human Terrestrial Analog
          </span>
        );
      case 'animal':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 ${sizeClasses}`}>
            <PawPrint className="w-3 h-3 text-amber-400" />
            Animal Model
          </span>
        );
      case 'cell-culture':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-violet-500/15 text-violet-300 border border-violet-500/30 ${sizeClasses}`}>
            <TestTube className="w-3 h-3 text-violet-400" />
            Cell Culture (In Vitro)
          </span>
        );
      case 'microbial':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 ${sizeClasses}`}>
            <Globe className="w-3 h-3 text-emerald-400" />
            Microbial Specimen
          </span>
        );
      default:
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-slate-800 text-slate-300 border border-slate-700 ${sizeClasses}`}>
            Model: {value}
          </span>
        );
    }
  }

  if (type === 'availability') {
    switch (value) {
      case 'DOWNLOAD_AVAILABLE':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 ${sizeClasses}`}>
            <Download className="w-3 h-3" />
            Download Available
          </span>
        );
      case 'FILE_AVAILABLE':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 ${sizeClasses}`}>
            <CheckCircle2 className="w-3 h-3" />
            File Available
          </span>
        );
      case 'METADATA_AVAILABLE':
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-slate-700/60 text-slate-300 border border-slate-600 ${sizeClasses}`}>
            <FileText className="w-3 h-3" />
            Metadata Indexed
          </span>
        );
      case 'ACCESS_UNAVAILABLE':
      case 'RETRIEVAL_FAILED':
      default:
        return (
          <span className={`inline-flex items-center gap-1 font-medium rounded bg-rose-500/10 text-rose-400 border border-rose-500/25 ${sizeClasses}`}>
            <AlertCircle className="w-3 h-3" />
            Access Restricted
          </span>
        );
    }
  }

  return null;
};
