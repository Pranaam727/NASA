import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { ExternalLink, RotateCcw, Filter, Satellite } from 'lucide-react';
import { RadiationMeasurement } from '../types/radiationTypes';
import { RadLabQueryParams } from '../services/nasaRadLabService';

interface NasaRadLabExplorerProps {
  measurements: RadiationMeasurement[];
  isLive: boolean;
  isLoading: boolean;
  error?: string | null;
  params: RadLabQueryParams;
  onUpdateFilter: (updates: Partial<RadLabQueryParams>) => void;
  onRefresh: () => void;
}

export const NasaRadLabExplorer: React.FC<NasaRadLabExplorerProps> = ({
  measurements,
  isLive,
  isLoading,
  error,
  params,
  onUpdateFilter,
  onRefresh,
}) => {
  return (
    <DossierCard
      title="NASA RadLab Telemetry Explorer"
      subtitle="MULTI-AGENCY SPACE RADIATION DATA ACCESS // OFFICIAL NASA OSDR ENDPOINT"
      badge={
        <div className="flex items-center gap-2">
          <StatusIndicator
            status={isLive ? 'NOMINAL' : 'SIMULATED'}
            label={isLive ? 'LIVE RADLAB API' : 'RADLAB ARCHIVE'}
            pulse={isLive}
          />
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-1 text-astro-text-secondary hover:text-astro-ink transition-colors disabled:opacity-50"
            title="Refresh RadLab Telemetry"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#EAE6DC]/60 rounded border border-astro-border-hairline text-xs font-mono">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-astro-text-secondary">
              <Filter className="w-3.5 h-3.5" />
              <span>SPACECRAFT:</span>
            </div>
            <select
              value={params.spacecraft || 'ISS'}
              onChange={(e) => onUpdateFilter({ spacecraft: e.target.value })}
              className="bg-[#F3F0E8] border border-astro-border-hairline rounded px-2 py-1 text-astro-ink focus:outline-none focus:border-astro-ink text-xs"
            >
              <option value="ISS">ISS (International Space Station)</option>
            </select>

            <div className="flex items-center gap-1 text-astro-text-secondary ml-2">
              <Satellite className="w-3.5 h-3.5" />
              <span>INSTRUMENT:</span>
            </div>
            <select
              value={params.instrument || 'DosTel'}
              onChange={(e) => onUpdateFilter({ instrument: e.target.value })}
              className="bg-[#F3F0E8] border border-astro-border-hairline rounded px-2 py-1 text-astro-ink focus:outline-none focus:border-astro-ink text-xs"
            >
              <option value="DosTel">DosTel (DLR / ESA)</option>
              <option value="TEPC">TEPC (NASA Tissue Equivalent Proportional Counter)</option>
              <option value="Liulin-5">Liulin-5 (SRTI-BAS / Roscosmos)</option>
              <option value="REM">REM (Timepix Radiation Environment Monitor)</option>
            </select>
          </div>

          <a
            href="https://visualization.osdr.nasa.gov/radlab/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-astro-ink hover:underline font-mono"
          >
            <span>Open NASA RadLab Portal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {error && (
          <div className="p-2.5 bg-astro-status-sandstone/20 border border-astro-status-sandstone/40 rounded text-xs font-mono text-[#7A6643]">
            ℹ️ {error}
          </div>
        )}

        {/* Telemetry Data Table */}
        <div className="overflow-x-auto border border-astro-border-hairline rounded">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="bg-[#EAE6DC] border-b border-astro-border-hairline text-[10px] text-astro-text-secondary uppercase">
                <th className="py-2 px-2.5">Timestamp (UTC)</th>
                <th className="py-2 px-2.5">Spacecraft / Module</th>
                <th className="py-2 px-2.5">Instrument (ID)</th>
                <th className="py-2 px-2.5">Absorbed Dose Rate</th>
                <th className="py-2 px-2.5">Equivalent Dose Rate</th>
                <th className="py-2 px-2.5">Flux</th>
                <th className="py-2 px-2.5">Altitude</th>
                <th className="py-2 px-2.5">Position</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-astro-border-hairline bg-[#F3F0E8]">
              {measurements.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-astro-text-secondary">
                    {isLoading ? 'Querying NASA RadLab telemetry...' : 'No telemetry records matching filter.'}
                  </td>
                </tr>
              ) : (
                measurements.map((row) => (
                  <tr key={row.id} className="hover:bg-[#EAE6DC]/50 transition-colors">
                    <td className="py-2 px-2.5 whitespace-nowrap text-astro-ink">
                      {new Date(row.timestamp).toISOString().replace('.000Z', 'Z')}
                    </td>
                    <td className="py-2 px-2.5 text-astro-text-secondary">
                      {row.spacecraft} {row.module ? `// ${row.module}` : ''}
                    </td>
                    <td className="py-2 px-2.5 font-medium text-astro-ink">
                      {row.instrument} <span className="text-[10px] text-astro-text-secondary">({row.instrumentId})</span>
                    </td>
                    <td className="py-2 px-2.5 text-astro-ink">
                      {row.absorbedDoseRate !== null ? `${row.absorbedDoseRate.toFixed(3)} uGy/h` : '--'}
                    </td>
                    <td className="py-2 px-2.5 font-semibold text-[#D16C48]">
                      {row.doseEquivalentRate !== null ? `${row.doseEquivalentRate.toFixed(3)} uSv/h` : '--'}
                    </td>
                    <td className="py-2 px-2.5 text-astro-text-secondary">
                      {row.particleFlux !== null ? `${row.particleFlux.toFixed(4)}` : '--'}
                    </td>
                    <td className="py-2 px-2.5 text-astro-text-secondary">
                      {row.altitude !== null ? `${row.altitude.toFixed(1)} km` : '--'}
                    </td>
                    <td className="py-2 px-2.5 text-[10px] text-astro-text-secondary">
                      {row.latitude !== null && row.longitude !== null
                        ? `${row.latitude.toFixed(1)}°, ${row.longitude.toFixed(1)}°`
                        : '--'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Attribution & Medical Boundary Disclaimer */}
        <div className="p-3 bg-[#EAE6DC]/40 rounded border border-astro-border-hairline text-[11px] font-body text-astro-text-secondary leading-relaxed">
          <p>
            <strong>NASA Resource Attribution:</strong> Radiation telemetry retrieved via the NASA Open Science Data Repository (OSDR) RadLab API (<code>https://visualization.osdr.nasa.gov/radlab/api/</code>). RadLab aggregates environmental radiation dosimeters from international space agencies across LEO and BLEO missions.
          </p>
          <p className="mt-1 text-[10px] font-mono text-astro-status-sandstone">
            * SCIENTIFIC NOTICE: RadLab vehicle environmental dosimeter streams are historical physical measurements and are strictly distinguished from personal astronaut clinical telemetry.
          </p>
        </div>
      </div>
    </DossierCard>
  );
};
