import React, { useState } from 'react';
import { AnomalyRecord, AnomalyReviewStatus } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { UnitTag } from '../common/UnitTag';
import { DisclaimerNotice } from '../common/DisclaimerNotice';
import { AlertTriangle, CheckCircle, Sliders, ShieldAlert } from 'lucide-react';
import { AnomalyDetectionConfig } from '../../services/anomalyDetectionService';

interface AnomalyDetectionPanelProps {
  anomalies: AnomalyRecord[];
  config: AnomalyDetectionConfig;
  onUpdateStatus: (id: string, status: AnomalyReviewStatus, notes?: string) => void;
  onUpdateConfig: (newConfig: Partial<AnomalyDetectionConfig>) => void;
}

export const AnomalyDetectionPanel: React.FC<AnomalyDetectionPanelProps> = ({
  anomalies,
  config,
  onUpdateStatus,
  onUpdateConfig,
}) => {
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<'All' | AnomalyReviewStatus>('All');
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});

  const filtered = anomalies.filter(
    (a) => selectedFilter === 'All' || a.status === selectedFilter
  );

  const pendingCount = anomalies.filter((a) => a.status === 'Pending').length;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Explainable Anomaly Detection Engine
            </h3>
            <Badge variant={pendingCount > 0 ? 'amber' : 'emerald'}>
              {pendingCount} PENDING REVIEW
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rule-based statistical anomaly monitoring for sudden rate changes, personal baseline shifts, and telemetry data gaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={<Sliders className="w-3.5 h-3.5" />}
            onClick={() => setShowConfig(!showConfig)}
          >
            {showConfig ? 'Hide Rules' : 'Configure Rules'}
          </Button>
        </div>
      </div>

      {/* Configurable Rules Panel */}
      {showConfig && (
        <div className="p-4 bg-slate-900/80 border border-cyan-500/30 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Analytical Threshold Configuration (Demonstration Rules)
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              Adjust sensitivity parameters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Z-Score Baseline Threshold: <strong className="text-cyan-400 font-mono">{config.zScoreThreshold} σ</strong>
              </label>
              <input
                type="range"
                min={1.5}
                max={3.5}
                step={0.1}
                value={config.zScoreThreshold}
                onChange={(e) => onUpdateConfig({ zScoreThreshold: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1">
                Rate-of-Change Limit: <strong className="text-cyan-400 font-mono">{config.rateOfChangeThresholdPercent}%</strong>
              </label>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={config.rateOfChangeThresholdPercent}
                onChange={(e) =>
                  onUpdateConfig({ rateOfChangeThresholdPercent: parseInt(e.target.value, 10) })
                }
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="flagMissing"
                checked={config.flagMissingObservations}
                onChange={(e) => onUpdateConfig({ flagMissingObservations: e.target.checked })}
                className="rounded accent-cyan-400"
              />
              <label htmlFor="flagMissing" className="text-xs text-slate-300 cursor-pointer">
                Flag Missing Telemetry Gaps
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <span className="text-xs text-slate-400 mr-2">Filter by Status:</span>
        {(['All', 'Pending', 'Acknowledged', 'Reviewed'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setSelectedFilter(st)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedFilter === st
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Anomalies List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 italic bg-slate-950/40 rounded-xl border border-slate-800">
            No anomaly records matching the current filter.
          </div>
        ) : (
          filtered.map((anomaly) => (
            <div
              key={anomaly.id}
              className="p-4 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      anomaly.severity === 'Elevated (Review)'
                        ? 'rose'
                        : anomaly.severity === 'Moderate'
                        ? 'amber'
                        : 'blue'
                    }
                  >
                    {anomaly.severity}
                  </Badge>
                  <h4 className="text-sm font-semibold text-slate-200">
                    {anomaly.variableName}
                  </h4>
                  <UnitTag unit={anomaly.unit} />
                  <span className="text-xs text-slate-400 font-mono">
                    FD {anomaly.missionDay}
                  </span>
                </div>

                <Badge
                  variant={
                    anomaly.status === 'Reviewed'
                      ? 'emerald'
                      : anomaly.status === 'Acknowledged'
                      ? 'blue'
                      : 'amber'
                  }
                >
                  {anomaly.status}
                </Badge>
              </div>

              {/* Numerical comparison row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/60 p-2.5 rounded-lg text-xs font-mono">
                <div>
                  <span className="text-slate-500 text-[10px]">Observed Value</span>
                  <div className="text-slate-100 font-bold">
                    {anomaly.observedValue !== null ? `${anomaly.observedValue} ${anomaly.unit}` : 'Missing Value'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Baseline / Reference</span>
                  <div className="text-slate-300">
                    {anomaly.baselineValue} {anomaly.unit}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Deviation Magnitude</span>
                  <div className="text-amber-400 font-bold">
                    {anomaly.deviationPercent > 0 ? `+${anomaly.deviationPercent}%` : 'Gap alert'}
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Detection Method</span>
                  <div className="text-cyan-400 truncate" title={anomaly.detectionMethod}>
                    {anomaly.detectionMethod}
                  </div>
                </div>
              </div>

              {/* Explainable text */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/30 p-2 rounded border-l-2 border-amber-500/60">
                <strong>Analysis:</strong> {anomaly.explanation}
              </p>

              {/* Acknowledgement controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-800/60 text-xs">
                <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Enter biomedical reviewer notes..."
                    value={reviewerNotes[anomaly.id] ?? anomaly.reviewerNotes ?? ''}
                    onChange={(e) =>
                      setReviewerNotes({ ...reviewerNotes, [anomaly.id]: e.target.value })
                    }
                    className="w-full sm:w-80 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {anomaly.status !== 'Acknowledged' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() =>
                        onUpdateStatus(anomaly.id, 'Acknowledged', reviewerNotes[anomaly.id])
                      }
                    >
                      Acknowledge
                    </Button>
                  )}
                  {anomaly.status !== 'Reviewed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<CheckCircle className="w-3.5 h-3.5" />}
                      onClick={() =>
                        onUpdateStatus(anomaly.id, 'Reviewed', reviewerNotes[anomaly.id])
                      }
                    >
                      Mark Reviewed
                    </Button>
                  )}
                </div>
              </div>

              {anomaly.acknowledgedBy && (
                <div className="text-[10px] text-slate-500 font-mono">
                  Review logged by {anomaly.acknowledgedBy} at {new Date(anomaly.acknowledgedAt || '').toLocaleTimeString()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <DisclaimerNotice compact />
    </Card>
  );
};
