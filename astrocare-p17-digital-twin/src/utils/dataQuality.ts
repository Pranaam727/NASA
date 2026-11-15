import { PhysiologicalMeasurement } from '../types';

export interface DataQualityReport {
  totalObservations: number;
  validObservations: number;
  missingCount: number;
  completenessPercentage: number;
  averageQualityScore: number;
  gapsIdentified: {
    system: string;
    variable: string;
    gapStartDay: number;
    gapEndDay: number;
    missingDaysCount: number;
  }[];
}

/**
 * Assesses data completeness, flags missing entries, and computes quality index.
 */
export function evaluateDataQuality(
  measurements: PhysiologicalMeasurement[],
  expectedMissionDays: number = 30
): DataQualityReport {
  const totalObservations = measurements.length;
  const validObservations = measurements.filter((m) => m.value !== null).length;
  const missingCount = totalObservations - validObservations;
  const completenessPercentage =
    totalObservations > 0 ? Math.round((validObservations / totalObservations) * 1000) / 10 : 0;

  const validScores = measurements.filter((m) => m.value !== null).map((m) => m.qualityScore);
  const averageQualityScore =
    validScores.length > 0
      ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10
      : 0;

  // Identify gaps in sequence
  const gapsIdentified: DataQualityReport['gapsIdentified'] = [];
  const groupedByVar: Record<string, PhysiologicalMeasurement[]> = {};

  measurements.forEach((m) => {
    const key = `${m.system}::${m.variable}`;
    if (!groupedByVar[key]) groupedByVar[key] = [];
    groupedByVar[key].push(m);
  });

  Object.entries(groupedByVar).forEach(([key, items]) => {
    const sorted = [...items].sort((a, b) => a.missionDay - b.missionDay);
    for (let i = 1; i < sorted.length; i++) {
      const diff = sorted[i].missionDay - sorted[i - 1].missionDay;
      if (diff > 2) {
        const [system, variable] = key.split('::');
        gapsIdentified.push({
          system,
          variable,
          gapStartDay: sorted[i - 1].missionDay + 1,
          gapEndDay: sorted[i].missionDay - 1,
          missingDaysCount: diff - 1,
        });
      }
    }
  });

  return {
    totalObservations,
    validObservations,
    missingCount,
    completenessPercentage,
    averageQualityScore,
    gapsIdentified,
  };
}
