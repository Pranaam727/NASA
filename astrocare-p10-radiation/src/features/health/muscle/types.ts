/**
 * Types for muscle health assessments.
 */
export interface MuscleAssessmentRecord {
  astronautId: string;
  timestamp: string; // ISO date string
  gripStrengthKg: number; // example metric
  legPressKg?: number;
  isSimulated?: boolean;
}

export interface MuscleHealthProfile {
  baseline?: MuscleAssessmentRecord;
  latest?: MuscleAssessmentRecord;
  percentageChangeGrip?: number;
}
