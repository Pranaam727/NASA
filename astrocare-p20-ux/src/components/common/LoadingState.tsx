import React from 'react';
import { Loader2, Radio } from 'lucide-react';

export const LoadingState: React.FC<{
  message?: string;
  subtext?: string;
  className?: string;
}> = ({
  message = 'Acquiring Telemetry Stream...',
  subtext = 'Synchronizing with AstroCare biomedical downlink buffers',
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center space-y-3 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin flex items-center justify-center" />
        <Radio className="w-5 h-5 text-cyan-400 absolute inset-0 m-auto animate-pulse" />
      </div>
      <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 font-mono tracking-wide">
        {message}
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
        {subtext}
      </p>
    </div>
  );
};
