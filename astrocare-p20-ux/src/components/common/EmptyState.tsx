import React from 'react';
import { Database, AlertCircle, RefreshCw } from 'lucide-react';

export const EmptyState: React.FC<{
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}> = ({
  title = 'No Telemetry Records Available',
  description = 'No observations matching current filter or search criteria.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center space-y-3 bg-white dark:bg-[#0b101d] rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}>
      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400">
        <Database className="w-6 h-6" />
      </div>
      <div className="font-semibold text-sm text-slate-800 dark:text-slate-200 font-mono">
        {title}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer transition-colors shadow"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export const ErrorState: React.FC<{
  title?: string;
  error?: string;
  onRetry?: () => void;
  className?: string;
}> = ({
  title = 'Telemetry Link Disruption',
  error = 'Downlink package decoding failed due to packet loss or CRC mismatch.',
  onRetry,
  className = ''
}) => {
  return (
    <div className={`p-6 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-500/40 text-center space-y-3 ${className}`}>
      <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-900/60 border border-rose-300 dark:border-rose-500 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
        <AlertCircle className="w-5 h-5" />
      </div>
      <div className="font-bold text-sm text-rose-900 dark:text-rose-200 font-mono">
        {title}
      </div>
      <p className="text-xs text-rose-700 dark:text-rose-300 max-w-md mx-auto">
        {error}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-rose-600 hover:bg-rose-500 text-white cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-establish Connection</span>
        </button>
      )}
    </div>
  );
};
