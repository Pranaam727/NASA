import React from 'react';
import { SystemStatusSummary } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { CheckCircle2, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PhysiologicalSystemCardProps {
  summary: SystemStatusSummary;
  routePath?: string;
  icon?: React.ReactNode;
}

export const PhysiologicalSystemCard: React.FC<PhysiologicalSystemCardProps> = ({
  summary,
  routePath = `/digital-twin/${summary.system}`,
  icon,
}) => {
  const statusConfig = {
    normal: {
      badge: <Badge variant="emerald">ACTIVE // NORMAL</Badge>,
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />,
      subtext: 'Telemetry within expected physiological limits',
    },
    review_recommended: {
      badge: <Badge variant="amber">TREND REVIEW</Badge>,
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />,
      subtext: 'Missing or anomalous observation detected',
    },
    insufficient_data: {
      badge: <Badge variant="slate">NO TELEMETRY</Badge>,
      icon: <HelpCircle className="w-4 h-4 text-slate-500" />,
      subtext: 'Awaiting scheduled clinical collection',
    },
  }[summary.status];

  return (
    <Card className="flex flex-col justify-between hover:border-slate-700 transition-all">
      <div>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-cyan-400">{icon}</span>}
            <h4 className="font-semibold text-slate-200 text-sm">
              {summary.displayName}
            </h4>
          </div>
          {statusConfig.badge}
        </div>

        <p className="text-xs text-slate-400 mt-2">
          {statusConfig.subtext}
        </p>

        <div className="my-3 space-y-1.5 bg-slate-950/40 p-2.5 rounded-lg text-xs font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>Observations:</span>
            <span className="text-slate-200 font-bold">{summary.measurementCount}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Variables:</span>
            <span className="text-cyan-400 truncate max-w-[150px]">
              {summary.activeVariables.length > 0 ? summary.activeVariables.join(', ') : 'None'}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className="text-[11px] text-slate-500 font-mono">
          {summary.lastUpdated ? `Updated: ${new Date(summary.lastUpdated).toLocaleDateString()}` : 'Awaiting data'}
        </span>
        <Link
          to={routePath}
          className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 group text-xs"
        >
          <span>Explore Twin</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </Card>
  );
};
