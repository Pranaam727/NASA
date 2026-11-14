import React from 'react';
import { DataOrigin } from '../../types';

interface DataOriginBadgeProps {
  origin: DataOrigin | string;
}

export const DataOriginBadge: React.FC<DataOriginBadgeProps> = ({ origin }) => {
  const isSimulated = origin === 'SIMULATED';
  const isNasa = origin === 'NASA_RESEARCH';

  let badgeClass = 'bg-amber-950/40 text-amber-300 border-amber-800/50';
  let label = origin.replace(/_/g, ' ');

  if (isNasa) {
    badgeClass = 'bg-blue-950/50 text-cyan-300 border-cyan-800/50';
    label = 'NASA OSDR RECORD';
  } else if (isSimulated) {
    badgeClass = 'bg-purple-950/40 text-purple-300 border-purple-800/40';
    label = 'SIMULATED TELEMETRY';
  }

  return (
    <span
      title={
        isSimulated
          ? 'Synthetic demonstration record. Not actual astronaut private medical data.'
          : 'Data directly catalogued from NASA OSDR open science datasets.'
      }
      className={`inline-flex items-center text-[10px] tracking-wider uppercase font-mono px-2 py-0.5 rounded border ${badgeClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70 animate-pulse" />
      {label}
    </span>
  );
};
