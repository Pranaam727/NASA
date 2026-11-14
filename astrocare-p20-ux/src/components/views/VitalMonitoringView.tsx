import React, { useState, useEffect } from 'react';
import { Astronaut } from '../../types/contracts';
import { DataProvenanceBadge } from '../common/DataProvenanceBadge';
import { DataQualityIndicator } from '../common/DataQualityIndicator';
import { Heart, Activity, Wind, Thermometer, Radio, Zap } from 'lucide-react';
import { CARD_SURFACE } from '../../design-system/utils';

interface VitalMonitoringViewProps {
  crewMembers: Astronaut[];
  selectedAstronaut: Astronaut | null;
  onSelectAstronaut: (astronaut: Astronaut) => void;
}

export const VitalMonitoringView: React.FC<VitalMonitoringViewProps> = ({
  crewMembers,
  selectedAstronaut,
  onSelectAstronaut
}) => {
  const current = selectedAstronaut || crewMembers[0];

  // Simulating live 1 Hz cardiac pulse updates
  const [pulseBeats, setPulseBeats] = useState<number>(current.primaryVitals.heartRateBpm);
  const [packetCount, setPacketCount] = useState<number>(142980);

  useEffect(() => {
    setPulseBeats(current.primaryVitals.heartRateBpm);
  }, [current.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Subtle natural sinus fluctuation (+/- 1 bpm)
      setPulseBeats(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      setPacketCount(prev => prev + 1);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Controls & Stream Indicator */}
      <div className="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold font-sans text-slate-900 dark:text-white">
              Real-Time Physiological Vital Monitoring
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              1 Hz LIVE DOWNLINK
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Continuous biosensor telemetry for {current.name} ({current.callsign}) • Flight Day {current.flightDay}
          </p>
        </div>

        {/* Astronaut Pill Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {crewMembers.map(a => (
            <button
              key={a.id}
              onClick={() => onSelectAstronaut(a)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                current.id === a.id
                  ? 'bg-white dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-300 dark:border-cyan-500/40 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {a.callsign}
            </button>
          ))}
        </div>
      </div>

      {/* Main Vital Indicators Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Heart Rate / Pulse */}
        <div className={`rounded-2xl p-5 ${CARD_SURFACE} space-y-3`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-rose-500 font-bold uppercase">
              <Heart className="w-4 h-4 text-rose-500 animate-ping" />
              Cardiac Pulse Rate
            </span>
            <span className="text-emerald-500 font-semibold">LEAD II ECG</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {pulseBeats}
            </span>
            <span className="text-sm font-mono text-slate-400">bpm</span>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span>Resting Margin: 50-80 bpm</span>
            <span>R-Peak Confirmed</span>
          </div>
        </div>

        {/* Arterial Blood Pressure */}
        <div className={`rounded-2xl p-5 ${CARD_SURFACE} space-y-3`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-cyan-500 font-bold uppercase">
              <Activity className="w-4 h-4 text-cyan-500" />
              Arterial Blood Pressure
            </span>
            <span className="text-slate-400">Ambulatory</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-cyan-300">
              {current.primaryVitals.bloodPressureSys}/{current.primaryVitals.bloodPressureDia}
            </span>
            <span className="text-sm font-mono text-slate-400">mmHg</span>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span>Nominal: &lt;120/80 mmHg</span>
            <span className={current.primaryVitals.bloodPressureSys > 125 ? 'text-amber-500' : 'text-emerald-500'}>
              {current.primaryVitals.bloodPressureSys > 125 ? 'Mild Elevation' : 'Nominal'}
            </span>
          </div>
        </div>

        {/* SpO2 Oxygen Saturation */}
        <div className={`rounded-2xl p-5 ${CARD_SURFACE} space-y-3`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-blue-500 font-bold uppercase">
              <Wind className="w-4 h-4 text-blue-500" />
              Oxygen Saturation (SpO₂)
            </span>
            <span className="text-emerald-500 font-semibold">Pulse Oximeter</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {current.primaryVitals.spo2Percent}
            </span>
            <span className="text-sm font-mono text-slate-400">%</span>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span>Operational Target: &gt;96%</span>
            <span className="text-emerald-500">Optimal Perfusion</span>
          </div>
        </div>

        {/* HRV rMSSD */}
        <div className={`rounded-2xl p-5 ${CARD_SURFACE} space-y-3`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-purple-500 font-bold uppercase">
              <Activity className="w-4 h-4 text-purple-500" />
              Heart Rate Variability (rMSSD)
            </span>
            <span className="text-slate-400">Vagal Tone</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tight text-purple-600 dark:text-purple-300">
              {current.primaryVitals.hrvRmssdMs}
            </span>
            <span className="text-sm font-mono text-slate-400">ms</span>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span>Nominal Margin: 40-75 ms</span>
            <span className={current.primaryVitals.hrvRmssdMs < 40 ? 'text-amber-500 font-bold' : 'text-emerald-500'}>
              {current.primaryVitals.hrvRmssdMs < 40 ? 'Vagal Withdrawal' : 'Nominal'}
            </span>
          </div>
        </div>

        {/* Core Body Temperature */}
        <div className={`rounded-2xl p-5 ${CARD_SURFACE} space-y-3`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-amber-500 font-bold uppercase">
              <Thermometer className="w-4 h-4 text-amber-500" />
              Core Body Temperature
            </span>
            <span className="text-slate-400">Double Sensor</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {current.primaryVitals.coreTempC}
            </span>
            <span className="text-sm font-mono text-slate-400">°C</span>
          </div>

          <div className="text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <span>Nominal: 36.5 - 37.5 °C</span>
            <span className="text-emerald-500">Normothermic</span>
          </div>
        </div>

        {/* Sensor Stream Telemetry Quality */}
        <div className={`rounded-2xl p-5 ${CARD_SURFACE} space-y-3`}>
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-400 font-bold uppercase">
              <Zap className="w-4 h-4 text-cyan-400" />
              Downlink Buffer Integrity
            </span>
            <span className="text-cyan-500 font-mono">Channel A</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-slate-900 dark:text-white">
              {packetCount.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">packets</span>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <DataQualityIndicator completeness={99.4} isCalibrated={true} />
          </div>
        </div>

      </div>

    </div>
  );
};
