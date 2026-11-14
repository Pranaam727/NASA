import React, { useState } from 'react';
import { useAstroCareContext } from '../../hooks/useAstroCareContext';
import { alertService } from '../../services/alerts/alertService';
import { AlertCategory, AlertSeverity, ImmuneAlert } from '../../types';
import { StateBadge } from '../../components/shared/StateBadge';
import { DataOriginBadge } from '../../components/shared/DataOriginBadge';
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Info,
  ShieldAlert,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const AlertEnginePage: React.FC = () => {
  const { currentAstronaut, refreshData } = useAstroCareContext();

  const [selectedSeverity, setSelectedSeverity] = useState<AlertSeverity | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<AlertCategory | 'ALL'>('ALL');
  const [showUnacknowledgedOnly, setShowUnacknowledgedOnly] = useState<boolean>(false);

  const alerts = alertService.getAlerts({
    astronautId: currentAstronaut.astronautId,
    severity: selectedSeverity,
    category: selectedCategory,
    unacknowledgedOnly: showUnacknowledgedOnly,
  });

  const handleAcknowledge = (id: string) => {
    alertService.acknowledgeAlert(id, 'Dr. Elena Rostova (Crew CMO)');
    refreshData();
  };

  const masterContractSample = alertService.toMasterAstroCareAlerts(currentAstronaut.astronautId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Module G — Rules-Based Surveillance
            </span>
            <DataOriginBadge origin="SIMULATED" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-cyan-400" />
            Immune Monitoring Alert Engine & Dispatcher
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Deterministic rule surveillance evaluating cytokine surges, functional lytic depression,
            salivary viral reactivation signatures, and cryogenic specimen workflow latency.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="flex items-center gap-2 bg-space-950 px-3 py-2 rounded-lg border border-space-800 text-xs font-mono">
          <span className="text-slate-400">Total Alerts:</span>
          <span className="font-bold text-white">{alerts.length}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Unacknowledged:</span>
          <span className="font-bold text-amber-400">
            {alerts.filter((a) => !a.acknowledged).length}
          </span>
        </div>
      </div>

      {/* Clinical Disclaimer on Alerts */}
      <div className="bg-space-950/80 border border-space-800 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 font-semibold block mb-0.5">
            Non-Diagnostic Guardrail: Reusable Rules vs Medical Diagnoses
          </strong>
          <span className="text-slate-400">
            Alerts indicate statistical departures from configurable thresholds or pre-flight baselines.
            The engine explicitly does NOT generate medical diagnoses or autonomously prescribe therapeutics.
            All notifications require human flight surgeon evaluation.
          </span>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-slate-400 uppercase">Severity:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as any)}
              className="bg-space-950 text-white border border-space-800 rounded p-1.5 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical</option>
              <option value="WARNING">Warning</option>
              <option value="INFORMATIONAL">Informational</option>
              <option value="NORMAL">Normal</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="bg-space-950 text-white border border-space-800 rounded p-1.5 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="CYTOKINE_SURGE">Cytokine Surge</option>
              <option value="LEUKOCYTE_DYSREGULATION">Leukocyte Dysregulation</option>
              <option value="INFLAMMATORY_SPIKE">Inflammatory Spike</option>
              <option value="VIRAL_REACTIVATION_RISK">Viral Reactivation</option>
              <option value="SAMPLE_WORKFLOW_DELAY">Sample Delay</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={showUnacknowledgedOnly}
            onChange={(e) => setShowUnacknowledgedOnly(e.target.checked)}
            className="rounded border-space-700 bg-space-950 text-cyan-500 focus:ring-0"
          />
          <span>Unacknowledged Only</span>
        </label>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="bg-space-900 border border-space-800 rounded-xl p-8 text-center text-slate-500 font-mono text-xs">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-60" />
            No active alerts matching configured filters for {currentAstronaut.name}.
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-space-900 border rounded-xl p-5 shadow-lg transition ${
                alert.acknowledged
                  ? 'border-space-800 opacity-80'
                  : alert.severity === 'WARNING'
                  ? 'border-amber-800/80 bg-gradient-to-r from-space-900 to-amber-950/20'
                  : alert.severity === 'CRITICAL'
                  ? 'border-rose-800/80 bg-gradient-to-r from-space-900 to-rose-950/20'
                  : 'border-space-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <StateBadge state={alert.severity} size="sm" />
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                      {alert.category.replace(/_/g, ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      ID: {alert.id}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                    {alert.analyte}
                    <span className="text-xs font-mono font-normal text-amber-300">
                      Observed: {alert.observedValue} {alert.unit} (Threshold: {alert.threshold} {alert.unit})
                    </span>
                  </h3>
                </div>

                {/* Acknowledge Button */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {alert.acknowledged ? (
                    <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Acknowledged</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="flex items-center gap-1.5 text-xs font-mono font-bold text-white bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 rounded-lg shadow-md transition"
                    >
                      <span>Acknowledge</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Rationale & Recommended Follow-up */}
              <div className="mt-4 pt-3 border-t border-space-800/80 space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  <strong className="text-slate-100 font-semibold font-mono">Telemetry Rationale: </strong>
                  {alert.explanation}
                </p>

                <div className="bg-space-950 p-3 rounded-lg border border-space-800 text-[11px] font-mono flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-cyan-300 font-bold uppercase">Recommended Follow-up: </span>
                    <span className="text-slate-300">{alert.recommendedFollowUp}</span>
                  </div>
                </div>
              </div>

              {/* Footer Audit Information */}
              <div className="mt-3 pt-2 border-t border-space-800/60 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-400 gap-2">
                <span>Source: {alert.source}</span>
                <span>Timestamp: {alert.timestamp.replace('T', ' ').slice(0, 16)}</span>
                {alert.acknowledged && (
                  <span className="text-slate-400">
                    Ack by: {alert.acknowledgedBy} at {alert.acknowledgedAt?.replace('T', ' ').slice(0, 16)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* AstroCare Master Alert Integration Contract Viewer */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            Master AstroCare Alert Adapter Output (`MasterAstroCareAlert[]`)
          </h3>
          <span className="text-[10px] font-mono text-cyan-300 bg-space-950 px-2 py-0.5 rounded border border-space-800">
            Ready for Master Dispatcher
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Normalized payload mapped via <code className="text-cyan-300">alertService.toMasterAstroCareAlerts()</code>{' '}
          for consumption by the master application alert system.
        </p>
        <pre className="bg-space-950 p-4 rounded-lg border border-space-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 scrollbar-thin">
          {JSON.stringify(masterContractSample.slice(0, 2), null, 2)}
        </pre>
      </div>
    </div>
  );
};
