import React from 'react';
import { DataProvenanceType } from '../../types/contracts';
import { DESIGN_TOKENS } from '../../design-system/tokens';
import { 
  Radio, 
  Activity, 
  Database, 
  Cpu, 
  Sparkles, 
  ShieldAlert, 
  AlertCircle 
} from 'lucide-react';

interface DataProvenanceBadgeProps {
  type: DataProvenanceType;
  showIcon?: boolean;
  className?: string;
  tooltip?: string;
}

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({
  type,
  showIcon = true,
  className = '',
  tooltip
}) => {
  const token = DESIGN_TOKENS.provenance[type] || DESIGN_TOKENS.provenance['simulated-data'];

  const getIcon = () => {
    switch (type) {
      case 'live-telemetry':
        return <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />;
      case 'simulated-data':
        return <Activity className="w-2.5 h-2.5 text-cyan-500" />;
      case 'nasa-research-source':
        return <Database className="w-2.5 h-2.5 text-blue-500" />;
      case 'derived-metric':
        return <Cpu className="w-2.5 h-2.5 text-purple-500" />;
      case 'ai-generated-interpretation':
        return <Sparkles className="w-2.5 h-2.5 text-indigo-500" />;
      case 'deterministic-fallback':
        return <ShieldAlert className="w-2.5 h-2.5 text-amber-500" />;
      case 'incomplete-data':
        return <AlertCircle className="w-2.5 h-2.5 text-slate-400" />;
    }
  };

  return (
    <span
      title={tooltip || token.description}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-medium border tracking-wider uppercase transition-colors ${token.dark} dark:${token.dark} ${token.light} ${className}`}
    >
      {showIcon && getIcon()}
      <span>{token.label}</span>
    </span>
  );
};
