import React, { useState } from 'react';
import { HealthAlert, AlertSeverity } from '@/types/database.types';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  User,
  Check,
  ShieldAlert,
} from 'lucide-react';

interface ActiveAlertsListProps {
  alerts: HealthAlert[];
  onAcknowledge: (alertId: string, notes?: string) => Promise<void>;
  onResolve: (alertId: string, notes?: string) => Promise<void>;
  className?: string;
}

export const ActiveAlertsList: React.FC<ActiveAlertsListProps> = ({
  alerts,
  onAcknowledge,
  onResolve,
  className = '',
}) => {
  const [filterStatus, setFilterStatus] = useState<'ACTIVE' | 'ACKNOWLEDGED' | 'ALL'>('ACTIVE');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedAlertForAction, setSelectedAlertForAction] = useState<{
    alert: HealthAlert;
    action: 'ACKNOWLEDGE' | 'RESOLVE';
  } | null>(null);
  const [actionNotes, setActionNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    if (filterStatus !== 'ALL' && alert.status !== filterStatus) return false;
    if (filterSeverity !== 'ALL' && alert.severity !== filterSeverity) return false;
    return true;
  });

  const getSeverityStyle = (severity: AlertSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          badge: 'bg-astro-status-critical/10 text-astro-status-critical border-astro-status-critical/30',
          icon: <AlertOctagon className="w-4 h-4 text-astro-status-critical" />,
        };
      case 'HIGH':
        return {
          badge: 'bg-[#C87D20]/10 text-[#C87D20] border-[#C87D20]/30',
          icon: <AlertTriangle className="w-4 h-4 text-[#C87D20]" />,
        };
      case 'MEDIUM':
        return {
          badge: 'bg-astro-status-caution/10 text-astro-status-caution border-astro-status-caution/30',
          icon: <AlertTriangle className="w-4 h-4 text-astro-status-caution" />,
        };
      default:
        return {
          badge: 'bg-astro-bg-subtle text-astro-text-secondary border-astro-border-hairline',
          icon: <Info className="w-4 h-4 text-astro-text-secondary" />,
        };
    }
  };

  const handleConfirmAction = async () => {
    if (!selectedAlertForAction) return;
    setIsSubmitting(true);
    try {
      if (selectedAlertForAction.action === 'ACKNOWLEDGE') {
        await onAcknowledge(selectedAlertForAction.alert.id, actionNotes);
      } else {
        await onResolve(selectedAlertForAction.alert.id, actionNotes);
      }
      setSelectedAlertForAction(null);
      setActionNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`bg-astro-bg-surface border border-astro-border-hairline rounded-sm overflow-hidden ${className}`}
    >
      {/* Header & Filter Controls */}
      <div className="px-4 py-3 border-b border-astro-border-hairline flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-astro-status-critical" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-astro-text-primary font-bold">
            HEALTH ALERT TRIAGE & INCIDENT QUEUE
          </h3>
          <span className="px-1.5 py-0.5 rounded bg-astro-bg-secondary text-[10px] font-mono text-astro-text-secondary">
            {filteredAlerts.length}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 font-mono text-[10px]">
          <div className="inline-flex rounded-sm border border-astro-border-hairline p-0.5 bg-astro-bg-secondary/40">
            {(['ACTIVE', 'ACKNOWLEDGED', 'ALL'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-2.5 py-0.5 rounded-sm uppercase tracking-wider transition-colors ${
                  filterStatus === status
                    ? 'bg-astro-bg-surface text-astro-text-primary font-semibold shadow-sm'
                    : 'text-astro-text-secondary hover:text-astro-text-primary'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-2 py-1 bg-astro-bg-surface border border-astro-border-hairline rounded-sm text-[10px] uppercase text-astro-text-primary focus:outline-none"
          >
            <option value="ALL">ALL SEVERITIES</option>
            <option value="CRITICAL">CRITICAL ONLY</option>
            <option value="HIGH">HIGH ONLY</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="divide-y divide-astro-border-hairline max-h-[420px] overflow-y-auto">
        {filteredAlerts.length === 0 ? (
          <div className="py-12 text-center font-mono text-xs text-astro-text-secondary">
            [ NO ACTIVE ALERTS MATCHING FILTER CRITERIA // ALL CREW WITHIN PHYSIOLOGICAL TOLERANCE ]
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const { badge, icon } = getSeverityStyle(alert.severity);

            return (
              <div
                key={alert.id}
                className="p-4 hover:bg-astro-bg-subtle/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                {/* Left Section: Details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {icon}
                    <span
                      className={`px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider font-semibold rounded-sm border ${badge}`}
                    >
                      {alert.severity}
                    </span>
                    <span className="font-mono text-[10px] text-astro-text-tertiary">
                      [{alert.rule_code}]
                    </span>
                    <span className="px-1.5 py-0.5 bg-astro-bg-secondary text-[10px] font-mono text-astro-text-secondary rounded">
                      <User className="w-2.5 h-2.5 inline mr-1" />
                      {alert.astronaut_id}
                    </span>
                    <span className="text-[10px] font-mono text-astro-text-tertiary flex items-center">
                      <Clock className="w-2.5 h-2.5 inline mr-1" />
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <h4 className="font-sans font-semibold text-astro-text-primary text-sm">
                    {alert.title}
                  </h4>

                  <p className="font-sans text-astro-text-secondary text-xs leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-astro-text-tertiary pt-0.5">
                    <span>
                      Triggering: <strong className="text-astro-text-primary">{alert.triggering_value}</strong>
                    </span>
                    {alert.baseline_expected && (
                      <span>
                        Expected: <strong className="text-astro-text-secondary">{alert.baseline_expected}</strong>
                      </span>
                    )}
                    {alert.acknowledged_by && (
                      <span className="text-astro-status-healthy">
                        Ack: {alert.acknowledged_by} ({new Date(alert.acknowledged_at || '').toLocaleTimeString()})
                      </span>
                    )}
                  </div>
                </div>

                {/* Right Section: Actions */}
                <div className="flex items-center space-x-2 shrink-0 pt-2 md:pt-0">
                  {alert.status === 'ACTIVE' && (
                    <button
                      onClick={() =>
                        setSelectedAlertForAction({ alert, action: 'ACKNOWLEDGE' })
                      }
                      className="px-2.5 py-1.5 rounded-sm border border-astro-border-hairline hover:bg-astro-bg-subtle text-astro-text-primary font-mono text-[10px] uppercase tracking-wider flex items-center space-x-1"
                    >
                      <Check className="w-3 h-3 text-[#C87D20]" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() =>
                        setSelectedAlertForAction({ alert, action: 'RESOLVE' })
                      }
                      className="px-2.5 py-1.5 rounded-sm bg-astro-status-healthy text-white hover:bg-astro-status-healthy/90 font-mono text-[10px] uppercase tracking-wider flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Resolve</span>
                    </button>
                  )}

                  {alert.status === 'RESOLVED' && (
                    <span className="px-2.5 py-1 rounded-sm bg-astro-status-healthy/10 text-astro-status-healthy border border-astro-status-healthy/30 font-mono text-[10px] uppercase tracking-wider font-semibold">
                      RESOLVED
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Action Dialog / Modal */}
      {selectedAlertForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-astro-bg-surface border border-astro-border-hairline rounded-sm shadow-xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-astro-border-hairline pb-3">
              <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-astro-text-primary">
                {selectedAlertForAction.action === 'ACKNOWLEDGE'
                  ? 'Acknowledge Physiological Alert'
                  : 'Resolve Mission Alert'}
              </h4>
              <button
                onClick={() => setSelectedAlertForAction(null)}
                className="text-astro-text-tertiary hover:text-astro-text-primary text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="font-sans font-semibold text-astro-text-primary">
                {selectedAlertForAction.alert.title}
              </p>
              <p className="text-astro-text-secondary text-[11px]">
                {selectedAlertForAction.alert.description}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono text-astro-text-tertiary uppercase">
                Clinical / Operational Notes:
              </label>
              <textarea
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder="Enter triage notes, countermeasures taken, or verification steps..."
                rows={3}
                className="w-full p-2 bg-astro-bg-secondary/40 border border-astro-border-hairline rounded-sm font-sans text-xs text-astro-text-primary focus:outline-none focus:border-astro-border-focus"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-astro-border-hairline">
              <button
                onClick={() => setSelectedAlertForAction(null)}
                className="px-3 py-1.5 rounded-sm border border-astro-border-hairline text-astro-text-secondary hover:text-astro-text-primary font-mono text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isSubmitting}
                className="px-3 py-1.5 rounded-sm bg-astro-text-primary text-astro-text-inverted hover:bg-black font-mono text-xs uppercase font-semibold disabled:opacity-50"
              >
                {isSubmitting ? 'Recording...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
