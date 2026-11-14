import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { RadiationEventRecord } from '../types/radiationTypes';
import { SunMedium, AlertOctagon } from 'lucide-react';

interface EventMonitorProps {
  events: RadiationEventRecord[];
  isSpeActive: boolean;
  currentFluxUsVh: number;
}

export const EventMonitor: React.FC<EventMonitorProps> = ({
  events,
  isSpeActive,
  currentFluxUsVh,
}) => {
  return (
    <div className="space-y-6">
      <DossierCard
        title="SOLAR PARTICLE EVENT (SPE) MONITOR & ALERT LOG"
        subtitle="NOAA SPACE WEATHER PREDICTION CENTER S1-S5 CLASSIFICATION MATRIX"
        action={
          <div className="flex items-center space-x-2">
            <span
              className={`font-mono text-[9px] px-2 py-0.5 rounded-sm border uppercase font-bold ${
                isSpeActive
                  ? 'bg-astro-status-critical/15 text-astro-status-critical border-astro-status-critical/40 animate-pulse'
                  : 'bg-astro-status-healthy/15 text-astro-status-healthy border-astro-status-healthy/40'
              }`}
            >
              {isSpeActive ? 'ACTIVE SOLAR PARTICLE SURGE' : 'QUIET SUN // NO SPE DETECTED'}
            </span>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Active Banner if SPE */}
          {isSpeActive && (
            <div className="p-4 bg-astro-status-critical/10 border border-astro-status-critical/40 rounded-sm flex items-start space-x-3">
              <AlertOctagon className="w-5 h-5 text-astro-status-critical shrink-0 mt-0.5" />
              <div>
                <h4 className="font-mono text-xs font-bold text-astro-status-critical uppercase">
                  SOLAR RADIATION STORM IN PROGRESS — IMMEDIATE ACTION REQUIRED
                </h4>
                <p className="font-body text-xs text-astro-text-primary mt-1 leading-relaxed">
                  Ionizing proton flux at {currentFluxUsVh.toFixed(3)} µSv/h. Crew should immediately halt extravehicular tasks and stage inside the central storm shelter module.
                </p>
              </div>
            </div>
          )}

          {/* Table / List of Historical and Active SPE Events */}
          <div className="space-y-2">
            <div className="font-mono text-xs text-astro-text-secondary uppercase">
              Mission Radiological Events Log ({events.length})
            </div>
            {events.map((evt) => (
              <div
                key={evt.id}
                className="p-3 bg-astro-bg-surface border border-astro-border-hairline rounded-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <SunMedium className={`w-4 h-4 ${evt.active ? 'text-astro-status-critical' : 'text-astro-sage'}`} />
                    <span className="font-mono text-xs font-bold text-astro-text-primary">{evt.id}</span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 bg-astro-bg-subtle text-astro-text-secondary border border-astro-border-hairline rounded-sm uppercase">
                      CLASS {evt.speClass}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-astro-text-secondary">
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>
                </div>

                <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
                  {evt.summary}
                </p>

                <div className="flex items-center space-x-4 font-mono text-[10px] text-astro-text-secondary pt-1 border-t border-astro-border-hairline">
                  <span>Peak Flux: <strong className="text-astro-text-primary">{evt.peakFluxUsVh.toFixed(3)} µSv/h</strong></span>
                  <span>Duration: <strong className="text-astro-text-primary">{evt.durationMinutes} min</strong></span>
                  <span>Proton Energy: <strong className="text-astro-text-primary">&gt;{evt.protonEnergyMev} MeV</strong></span>
                  <span>Shelter Ordered: <strong className={evt.stormShelterOrdered ? 'text-astro-status-critical' : 'text-astro-text-secondary'}>{evt.stormShelterOrdered ? 'YES' : 'NO'}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DossierCard>
    </div>
  );
};
