import React from 'react';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface DataQualityIndicatorProps {
  completeness: number; // e.g. 98.4
  isCalibrated?: boolean;
  isSimulated?: boolean;
  className?: string;
}

export const DataQualityIndicator: React.FC<DataQualityIndicatorProps> = ({
  completeness,
  isCalibrated = true,
  isSimulated = false,
  className = ''
}) => {
  const isOptimal = completeness >= 95;

  return (
    <div className={`flex items-center gap-2 text-[11px] font-mono ${className}`}>
      <div className="flex items-center gap-1">
        {isOptimal ? (
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
        )}
        <span className="text-slate-600 dark:text-slate-400">Quality:</span>
        <span className={`font-semibold ${isOptimal ? 'text-emerald-500 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
          {completeness.toFixed(1)}%
        </span>
      </div>

      <span className="text-slate-300 dark:text-slate-700">•</span>

      <span className="text-slate-500 dark:text-slate-400">
        {isCalibrated ? 'Calibrated' : 'Raw Sensor'}
      </span>

      {isSimulated && (
        <>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-cyan-500 dark:text-cyan-400 font-semibold">Simulated Telemetry</span>
        </>
      )}
    </div>
  );
};
