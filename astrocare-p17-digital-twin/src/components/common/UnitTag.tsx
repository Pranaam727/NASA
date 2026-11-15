import React from 'react';

interface UnitTagProps {
  unit: string;
  className?: string;
}

export const UnitTag: React.FC<UnitTagProps> = ({ unit, className = '' }) => {
  return (
    <span
      className={`font-mono text-[11px] text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800 ${className}`}
      title={`Measurement Unit: ${unit}`}
    >
      [{unit}]
    </span>
  );
};
