/**
 * Types for bone health assessments.
 */
export interface BoneAssessmentRecord {
  astronautId: string;
  timestamp: string; // ISO date string
  femoralNeckBmd: number; // g/cm^2
  lumbarSpineBmd: number; // g/cm^2
  isSimulated?: boolean;
}

export interface BoneHealthProfile {
  baseline?: BoneAssessmentRecord;
  latest?: BoneAssessmentRecord;
  percentageChangeFemoralNeck?: number;
  percentageChangeLumbarSpine?: number;
}
