import React, { useState } from 'react';
import { HealthAlert } from '@/types/database.types';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface ActiveAlertsQueueProps {
  alerts: HealthAlert[];
  onAcknowledge: (alertId: string, notes?: string) => Promise<void>;
  onResolve: (alertId: string, notes?: string) => Promise<void>;
}

export const ActiveAlertsQueue: React.FC<ActiveAlertsQueueProps> = ({
  alerts,
  onAcknowledge,
  onResolve,
}) => {
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  const activeAlerts = alerts.filter((a) => a.status === 'ACTIVE');
  const acknowledgedAlerts = alerts.filter((a) => a.status === 'ACKNOWLEDGED');

  const severityBadge = (severity: HealthAlert['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'CRITICAL' as const;
      case 'HIGH':
      case 'MEDIUM':
        return 'CAUTION' as const;
      case 'LOW':
        return 'NOMINAL' as const;
    }
  };

  const handleAction = async (alertId: string, action: 'ACKNOWLEDGE' | 'RESOLVE') => {
    setSubmitting(true);
    try {
      if (action === 'ACKNOWLEDGE') {
        await onAcknowledge(alertId, notes || undefined);
      } else {
        await onResolve(alertId, notes || undefined);
      }
      setSelectedAlertId(null);
      setNotes('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DossierCard
      title="ACTIVE INCIDENT & ALERT TRIAGE QUEUE"
      subtitle="DETERMINISTIC THRESHOLD VIOLATIONS & DE-DUPLICATED NOTIFICATIONS"
      badge={
        <div className="flex items-center space-x-2">
          <StatusIndicator
            status={activeAlerts.length > 0 ? 'CRITICAL' : 'NOMINAL'}
            label={`${activeAlerts.length} UNRESOLVED`}
            pulse={activeAlerts.length > 0}
            size="sm"
          />
        </div>
      }
    >
      {activeAlerts.length === 0 && acknowledgedAlerts.length === 0 ? (
        <div className="py-8 text-center space-y-1">
          <CheckCheck className="w-8 h-8 text-astro-status-healthy mx-auto mb-2 opacity-80" />
          <span className="font-mono text-xs font-semibold text-astro-text-primary uppercase block">
            [ ZERO ACTIVE TELEMETRY ALERTS // ALL CREW PARAMETERS STABLE ]
          </span>
          <span className="font-mono text-[11px] text-astro-text-secondary">
            Continuous deterministic rule engine monitoring active streams.
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          {activeAlerts.map((alert) => {
            const isEditing = selectedAlertId === alert.id;

            return (
              <div
                key={alert.id}
                className="border border-astro-border-hairline rounded-sm p-3.5 bg-white space-y-2.5 transition-all hover:border-astro-border-strong"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <StatusIndicator
                      status={severityBadge(alert.severity)}
                      label={alert.severity}
                      size="sm"
                      pulse={alert.severity === 'CRITICAL'}
                    />
                    <span className="font-mono text-[10px] text-astro-text-tertiary">
                      {alert.rule_code}
                    </span>
                    <h4 className="font-display text-xs font-bold text-astro-text-primary">
                      {alert.title}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2 text-[10px] font-mono text-astro-text-tertiary">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>

                <p className="font-body text-xs text-astro-text-secondary leading-snug">
                  {alert.description}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 font-mono text-[11px] border-t border-astro-border-hairline/60">
                  <div>
                    <span className="text-[10px] text-astro-text-tertiary uppercase">TRIGGER: </span>
                    <span className="font-bold text-astro-status-critical">
                      {alert.triggering_value}
                    </span>
                  </div>
                  {alert.baseline_expected && (
                    <div>
                      <span className="text-[10px] text-astro-text-tertiary uppercase">EXPECTED: </span>
                      <span className="text-astro-text-secondary">{alert.baseline_expected}</span>
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-astro-border-hairline/60">
                  {isEditing ? (
                    <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        placeholder="Resolution / triage notes..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="flex-1 font-mono text-xs bg-astro-bg-subtle border border-astro-border-hairline rounded-sm px-2 py-1 outline-none text-astro-text-primary focus:border-astro-border-focus"
                      />
                      <div className="flex items-center space-x-2">
                        <PrimaryButton
                          size="sm"
                          disabled={submitting}
                          onClick={() => handleAction(alert.id, 'ACKNOWLEDGE')}
                        >
                          CONFIRM ACK
                        </PrimaryButton>
                        <SecondaryButton
                          size="sm"
                          disabled={submitting}
                          onClick={() => handleAction(alert.id, 'RESOLVE')}
                        >
                          RESOLVE
                        </SecondaryButton>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedAlertId(null);
                            setNotes('');
                          }}
                          className="font-mono text-xs text-astro-text-tertiary hover:text-astro-text-primary px-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex items-center justify-end space-x-2">
                      <SecondaryButton
                        size="sm"
                        icon={Check}
                        onClick={() => setSelectedAlertId(alert.id)}
                      >
                        ACKNOWLEDGE
                      </SecondaryButton>
                      <PrimaryButton
                        size="sm"
                        icon={CheckCheck}
                        onClick={() => handleAction(alert.id, 'RESOLVE')}
                      >
                        RESOLVE NOW
                      </PrimaryButton>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DossierCard>
  );
};
