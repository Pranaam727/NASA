import React from 'react';
import { NavigationRoute } from '../../types/navigation';
import { Code2, ExternalLink, ShieldCheck, Cpu, ArrowRight } from 'lucide-react';
import { CARD_SURFACE } from '../../design-system/utils';

interface PlaceholderModuleViewProps {
  route: NavigationRoute;
}

export const PlaceholderModuleView: React.FC<PlaceholderModuleViewProps> = ({ route }) => {
  const sampleIntegrationSnippet = `// AstroCare Platform Integration Contract for ${route.targetPModule || route.id}
import { ${route.id.replace(/-/g, '_')}_Module } from 'astrocare-${route.id}';

export function Integrated${route.id.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase())}View() {
  return (
    <${route.id.replace(/-/g, '_')}_Module
      routeContractPath="${route.routeContractPath}"
      targetAstronautId="AST-084-SC"
      missionId="EXP-72-ISS"
      onAlertGenerated={(alert) => handleFlightSurgeonAlert(alert)}
    />
  );
}`;

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0b101d] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-500/40">
              INTEGRATION PLACEHOLDER • {route.targetPModule || 'EXTERNAL MODULE'}
            </span>
            <span className="text-xs font-mono text-slate-500">
              Route Contract: <code className="text-cyan-600 dark:text-cyan-400">{route.routeContractPath}</code>
            </span>
          </div>

          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Contract Validated
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold font-sans text-slate-900 dark:text-white">
          {route.label}
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          {route.description}
        </p>
      </div>

      {/* Integration Contracts Documentation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Input Contract Specifications */}
        <div className={`p-5 rounded-2xl ${CARD_SURFACE} space-y-3`}>
          <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4" />
            <span>Expected Input Data Contracts</span>
          </h3>

          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
              <span className="text-cyan-500 font-bold">•</span>
              <span><strong>astronautId:</strong> string (e.g. "AST-084-SC")</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
              <span className="text-cyan-500 font-bold">•</span>
              <span><strong>missionContext:</strong> Mission (Expedition 72 metadata, Flight Day, MET)</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
              <span className="text-cyan-500 font-bold">•</span>
              <span><strong>telemetryStream:</strong> HealthMetric[] (1 Hz biosensor array)</span>
            </li>
          </ul>
        </div>

        {/* Emitted Events Contract */}
        <div className={`p-5 rounded-2xl ${CARD_SURFACE} space-y-3`}>
          <h3 className="font-bold text-xs uppercase font-mono tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
            <Code2 className="w-4 h-4" />
            <span>Output Events Emitted</span>
          </h3>

          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-mono">
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>onAlertGenerated:</strong> (alert: AlertSummary) =&gt; void</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>onObservationLogged:</strong> (obs: HealthObservation) =&gt; void</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-850">
              <span className="text-purple-500 font-bold">•</span>
              <span><strong>onInvestigationRequested:</strong> (inv: InvestigationSummary) =&gt; void</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Code Snippet for Platform Developers */}
      <div className={`p-5 rounded-2xl ${CARD_SURFACE} space-y-3`}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            AstroCare Master Platform Mounting Contract
          </span>
          <span className="text-[10px] font-mono text-slate-500">TypeScript / React 19</span>
        </div>

        <pre className="p-4 rounded-xl bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
          <code>{sampleIntegrationSnippet}</code>
        </pre>
      </div>

    </div>
  );
};
