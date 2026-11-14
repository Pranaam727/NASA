import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { RadiationAlert } from '../types/radiationTypes';
import { AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { PrimaryButton } from '@/components/common/Buttons';

interface RadiationAlertPanelProps {
  activeAlert: RadiationAlert | null;
  recentAlerts: RadiationAlert[];
  currentFluxUsVh: number;
  onAcknowledge: (alertId: string) => void;
}

export const RadiationAlertPanel: React.FC<RadiationAlertPanelProps> = ({
  activeAlert,
  recentAlerts,
  currentFluxUsVh,
  onAcknowledge,
}) => {
  const isCritical = currentFluxUsVh >= 2.0 || activeAlert?.severity === 'CRITICAL';
  const isWarning = currentFluxUsVh >= 0.5 || activeAlert?.severity === 'MEDIUM';

  const statusLabel = isCritical
    ? 'CRITICAL // SOLAR PARTICLE EVENT ACTIVE'
    : isWarning
    ? 'CAUTION // ELEVATED AMBIENT FLUX'
    : 'NOMINAL // BACKGROUND GCR LEVEL';

  const statusLevel = isCritical ? 'CRITICAL' : isWarning ? 'CAUTION' : 'NOMINAL';

  return (
    <DossierCard
      title="Radiation Threat Assessment & Incident Triage"
      subtitle="THRESHOLD MONITORING // AUTOMATED INCIDENT LOGGING"
      badge={<StatusIndicator status={statusLevel} label={statusLabel} pulse={isCritical} />}
    >
      <div className="space-y-4">
        {/* Active Alert Banner */}
        {activeAlert ? (
          <div
            className={`p-4 rounded border ${
              activeAlert.severity === 'CRITICAL'
                ? 'bg-[#B9473E]/10 border-[#B9473E]/40 text-[#B9473E]'
                : 'bg-[#D16C48]/10 border-[#D16C48]/40 text-[#D16C48]'
            } flex flex-col md:flex-row items-start md:items-center justify-between gap-3`}
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-heading font-semibold text-sm tracking-wide">
                  {activeAlert.severity} THRESHOLD VIOLATION: {activeAlert.metric}
                </h4>
                <p className="font-body text-xs text-astro-ink mt-0.5">
                  {activeAlert.message}
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] font-mono mt-2 text-astro-text-secondary">
                  <span>DETECTED: {new Date(activeAlert.timestamp).toLocaleTimeString()}</span>
                  <span>TRIGGER: {activeAlert.currentValue.toFixed(3)} {activeAlert.unit}</span>
                  <span>THRESHOLD: {activeAlert.threshold} {activeAlert.unit}</span>
                  <span className="text-astro-status-sandstone font-semibold">
                    ORIGIN: {activeAlert.dataOrigin}
                  </span>
                </div>
              </div>
            </div>

            {activeAlert.acknowledgementStatus === 'UNACKNOWLEDGED' ? (
              <PrimaryButton
                size="sm"
                onClick={() => onAcknowledge(activeAlert.id)}
                className="whitespace-nowrap shrink-0"
              >
                Acknowledge Alert
              </PrimaryButton>
            ) : (
              <span className="flex items-center gap-1.5 text-xs font-mono text-astro-status-healthy">
                <CheckCircle className="w-4 h-4" /> ACKNOWLEDGED
              </span>
            )}
          </div>
        ) : (
          <div className="p-3 bg-[#EAE6DC]/60 rounded border border-astro-border-hairline flex items-center gap-2.5 text-xs font-body text-astro-text-secondary">
            <ShieldCheck className="w-4 h-4 text-astro-status-healthy shrink-0" />
            <span>
              All ambient dosimeter channels operating within nominal physiological baselines (&lt; 0.5 uSv/h). No active storm alert.
            </span>
          </div>
        )}

        {/* Historical Threshold Events */}
        {recentAlerts.length > 0 && (
          <div>
            <h5 className="font-heading text-xs font-semibold uppercase text-astro-text-secondary tracking-wider mb-2">
              Recent Threshold Crossing Log
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-astro-border-hairline text-[10px] text-astro-text-secondary uppercase">
                    <th className="py-1.5 px-2">Timestamp</th>
                    <th className="py-1.5 px-2">Severity</th>
                    <th className="py-1.5 px-2">Trigger Value</th>
                    <th className="py-1.5 px-2">Threshold</th>
                    <th className="py-1.5 px-2">Status</th>
                    <th className="py-1.5 px-2">Provenance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-astro-border-hairline">
                  {recentAlerts.slice(0, 5).map((alert) => (
                    <tr key={alert.id} className="hover:bg-[#EAE6DC]/40">
                      <td className="py-1.5 px-2 text-astro-text-secondary">
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="py-1.5 px-2 font-semibold">
                        <span
                          className={
                            alert.severity === 'CRITICAL'
                              ? 'text-[#B9473E]'
                              : 'text-[#D16C48]'
                          }
                        >
                          {alert.severity}
                        </span>
                      </td>
                      <td className="py-1.5 px-2">{alert.currentValue.toFixed(3)} uSv/h</td>
                      <td className="py-1.5 px-2 text-astro-text-secondary">
                        {alert.threshold} uSv/h
                      </td>
                      <td className="py-1.5 px-2">
                        <span className="text-[10px] uppercase font-bold text-astro-text-secondary">
                          {alert.acknowledgementStatus}
                        </span>
                      </td>
                      <td className="py-1.5 px-2 text-[10px] text-astro-status-sandstone">
                        {alert.dataOrigin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DossierCard>
  );
};
