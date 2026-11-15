import { useState, useMemo } from 'react';
import { PhysiologicalMeasurement, MissionPhase } from '../types';

export function useHealthTimeline(measurements: PhysiologicalMeasurement[]) {
  const [selectedPhase, setSelectedPhase] = useState<MissionPhase | 'All'>('All');
  const [selectedSystem, setSelectedSystem] = useState<string>('All');
  const [selectedVariable, setSelectedVariable] = useState<string>('All');

  const filteredTimeline = useMemo(() => {
    return measurements.filter((m) => {
      const matchPhase = selectedPhase === 'All' || m.missionPhase === selectedPhase;
      const matchSystem = selectedSystem === 'All' || m.system === selectedSystem;
      const matchVariable = selectedVariable === 'All' || m.variable === selectedVariable;
      return matchPhase && matchSystem && matchVariable;
    }).sort((a, b) => a.missionDay - b.missionDay);
  }, [measurements, selectedPhase, selectedSystem, selectedVariable]);

  const uniqueVariables = useMemo(() => {
    const map = new Map<string, string>();
    measurements.forEach((m) => map.set(m.variable, m.variableName));
    return Array.from(map.entries()).map(([key, name]) => ({ key, name }));
  }, [measurements]);

  return {
    selectedPhase,
    setSelectedPhase,
    selectedSystem,
    setSelectedSystem,
    selectedVariable,
    setSelectedVariable,
    filteredTimeline,
    uniqueVariables,
  };
}
