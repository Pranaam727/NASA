import { useState, useMemo } from 'react';
import { ResearchObservation, MeasurementVariable } from '../types/observation.types';
import { BENCHMARK_OBSERVATIONS, BENCHMARK_VARIABLES } from '../data/demoObservations';

export function useLongitudinalData(initialStudyId = 'OSD-575', initialVarId = 'var-il6') {
  const [selectedStudyId, setSelectedStudyId] = useState<string>(initialStudyId);
  const [selectedVarId, setSelectedVarId] = useState<string>(initialVarId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');

  const availableVariables = useMemo(() => {
    return BENCHMARK_VARIABLES.filter(v => v.studyId === selectedStudyId);
  }, [selectedStudyId]);

  const currentVariable = useMemo(() => {
    return BENCHMARK_VARIABLES.find(v => v.variableId === selectedVarId) || availableVariables[0];
  }, [selectedVarId, availableVariables]);

  const observations = useMemo(() => {
    let list = BENCHMARK_OBSERVATIONS.filter(obs => 
      obs.studyId === selectedStudyId && 
      obs.variableId === currentVariable?.variableId
    );

    if (selectedSubjectId !== 'all') {
      list = list.filter(obs => obs.subjectId === selectedSubjectId);
    }

    // Sort chronologically by phaseDay
    return list.sort((a, b) => a.phaseDay - b.phaseDay);
  }, [selectedStudyId, currentVariable, selectedSubjectId]);

  const availableSubjects = useMemo(() => {
    const list = BENCHMARK_OBSERVATIONS
      .filter(obs => obs.studyId === selectedStudyId)
      .map(obs => obs.subjectId);
    return Array.from(new Set(list));
  }, [selectedStudyId]);

  // Aggregate by phase
  const phaseAverages = useMemo(() => {
    const phases = ['Preflight', 'Inflight', 'Postflight', 'Ground Control', 'Analog Confinement', 'Analog Recovery'];
    return phases.map(phase => {
      const match = observations.filter(o => o.collectionPhase === phase);
      if (match.length === 0) return null;
      const sum = match.reduce((acc, m) => acc + m.numericValue, 0);
      return {
        phase,
        average: +(sum / match.length).toFixed(2),
        count: match.length,
        unit: match[0].originalUnit
      };
    }).filter(Boolean);
  }, [observations]);

  return {
    selectedStudyId,
    setSelectedStudyId,
    selectedVarId,
    setSelectedVarId,
    selectedSubjectId,
    setSelectedSubjectId,
    availableVariables,
    currentVariable,
    observations,
    availableSubjects,
    phaseAverages
  };
}
