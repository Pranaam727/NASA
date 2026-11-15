import React from 'react';
import { AlertTriangle, AlertOctagon, CheckCircle2, Clock } from 'lucide-react';

export interface SystemAlert {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
  message: string;
  astronautId: string;
  ruleId: string;
  timestamp: string;
}

interface AlertPanelProps {
  alerts: SystemAlert[];
  onAcknowledge?: (alertId: string) => void;
  className?: string;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({
  alerts,
  onAcknowledge,
  className = '',
}) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div
        className={`p-6 rounded-2xl bg-[#FFFFFF] border border-[#DCD8CD] text-center space-y-2 shadow-subtle ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-[#75D8DC]/20 border border-[#75D8DC]/40 flex items-center justify-center mx-auto text-[#111111]">
          <CheckCircle2 className="w-5 h-5 text-[#111111]" />
        </div>
        <h4 className="font-display font-bold text-sm text-[#111111]">
          ALL BIOMEDICAL PARAMETERS NOMINAL
        </h4>
        <p className="font-mono text-xs text-[#888882]">
          0 active physiological or atmospheric alerts across crew envelopes.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {alerts.map((alert) => {
        const isCritical = alert.severity === 'CRITICAL';
        return (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border transition-all ${
              isCritical
                ? 'bg-[#E03616]/5 border-[#E03616] text-[#111111]'
                : 'bg-[#FF6B35]/5 border-[#FF6B35] text-[#111111]'
            } shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  isCritical ? 'bg-[#E03616] text-white' : 'bg-[#FF6B35] text-white'
                }`}
              >
                {isCritical ? (
                  <AlertOctagon className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      isCritical
                        ? 'bg-[#E03616] text-white'
                        : 'bg-[#FF6B35] text-white'
                    }`}
                  >
                    {alert.severity}
                  </span>
                  <span className="font-mono text-[10px] text-[#888882] flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </span>
                </div>

                <h5 className="font-display font-bold text-sm text-[#111111] mt-1">
                  {alert.message}
                </h5>
                <p className="font-mono text-xs text-[#444444] mt-0.5">
                  Astronaut: {alert.astronautId} · Rule: {alert.ruleId}
                </p>
              </div>
            </div>

            {alert.status === 'ACTIVE' && onAcknowledge && (
              <button
                type="button"
                onClick={() => onAcknowledge(alert.id)}
                className="px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold bg-[#FFFFFF] border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-[#F2F0EA] transition-all self-end sm:self-center"
              >
                Acknowledge
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
