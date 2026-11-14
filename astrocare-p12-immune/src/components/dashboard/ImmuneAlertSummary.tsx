import React from 'react';
import { alertService } from '../../services/alerts/alertService';
import { StateBadge } from '../shared/StateBadge';
import { Bell, ArrowRight, AlertTriangle } from 'lucide-react';

interface ImmuneAlertSummaryProps {
  astronautId?: string;
  onNavigateToModule?: () => void;
}

export const ImmuneAlertSummary: React.FC<ImmuneAlertSummaryProps> = ({
  astronautId = 'AST-042',
  onNavigateToModule,
}) => {
  const unackAlerts = alertService.getAlerts({
    astronautId,
    unacknowledgedOnly: true,
  });

  const topAlert = unackAlerts[0];

  return (
    <div className="bg-space-900 border border-space-800 rounded-xl p-4 shadow-lg flex flex-col justify-between font-mono">
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white tracking-wide uppercase">
              Immune Alerts (P12)
            </h4>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
            {unackAlerts.length} Unresolved
          </span>
        </div>

        {topAlert ? (
          <div className="bg-space-950 p-2.5 rounded border border-space-800 my-2 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-white truncate max-w-[150px]">{topAlert.analyte}</span>
              <StateBadge state={topAlert.severity} size="sm" />
            </div>
            <p className="text-[11px] text-slate-400 font-sans line-clamp-2 leading-relaxed">
              {topAlert.explanation}
            </p>
          </div>
        ) : (
          <p className="text-xs text-slate-400 my-4">No unacknowledged alerts.</p>
        )}
      </div>

      {onNavigateToModule && (
        <button
          onClick={onNavigateToModule}
          className="mt-3 pt-2 border-t border-space-800/80 text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center justify-between transition"
        >
          <span>Manage Alert Dispatch</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
