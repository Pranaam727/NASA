import React from 'react';
import { SimulationTimelineEvent } from '../engine/SimulationEngine';
import { DossierCard } from '@/components/common/DossierCard';
import { Activity, Play, Pause, AlertTriangle, Layers } from 'lucide-react';

interface EventTimelineViewProps {
  events: SimulationTimelineEvent[];
}

export const EventTimelineView: React.FC<EventTimelineViewProps> = ({ events }) => {
  const getIcon = (type: SimulationTimelineEvent['type']) => {
    switch (type) {
      case 'SESSION_START':
        return <Play className="w-3.5 h-3.5 text-astro-status-healthy" />;
      case 'SCENARIO_SWITCH':
        return <Layers className="w-3.5 h-3.5 text-astro-status-sandstone" />;
      case 'ALERT_TRIGGER':
        return <AlertTriangle className="w-3.5 h-3.5 text-astro-status-critical" />;
      case 'PAUSE':
        return <Pause className="w-3.5 h-3.5 text-astro-status-caution" />;
      case 'RESUME':
        return <Play className="w-3.5 h-3.5 text-astro-status-healthy" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-astro-text-secondary" />;
    }
  };

  return (
    <DossierCard
      title="TELEMETRY EVENT STREAM"
      subtitle="CHRONOLOGICAL SIMULATION LIFECYCLE & INCIDENT DISPATCH LOG"
      badge={<span className="font-mono text-[10px] text-astro-text-secondary">{events.length} EVENTS</span>}
    >
      {events.length === 0 ? (
        <div className="py-6 text-center font-mono text-xs text-astro-text-tertiary">
          [ NO EVENTS RECORDED // ACTIVATE SIMULATION TO DISPATCH TELEMETRY ]
        </div>
      ) : (
        <div className="space-y-3 font-mono text-xs">
          {events.map((evt) => {
            const time = new Date(evt.timestamp).toLocaleTimeString();
            return (
              <div
                key={evt.id}
                className="flex items-start space-x-3 p-2 bg-astro-bg-subtle/50 border border-astro-border-hairline rounded-sm"
              >
                <div className="mt-0.5 shrink-0">{getIcon(evt.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-astro-text-primary uppercase tracking-tight truncate">
                      {evt.title}
                    </span>
                    <span className="text-[10px] text-astro-text-tertiary shrink-0 ml-2">{time}</span>
                  </div>
                  <p className="font-body text-[11px] text-astro-text-secondary mt-0.5">{evt.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DossierCard>
  );
};
