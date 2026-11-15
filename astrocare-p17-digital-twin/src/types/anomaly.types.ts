export type AnomalySeverity = 'Low' | 'Moderate' | 'Elevated (Review)';
export type AnomalyReviewStatus = 'Pending' | 'Acknowledged' | 'Reviewed' | 'Dismissed';
export type DetectionMethod = 
  | 'Z-Score Statistical Deviation'
  | 'Sudden Rate-of-Change Detection'
  | 'Missing Measurement Gap'
  | 'Personal Baseline Discrepancy'
  | 'Sensor Telemetry Noise Filter';

export interface AnomalyRecord {
  id: string;
  astronautId: string;
  astronautName: string;
  system: string;
  measurementVariable: string;
  variableName: string;
  observedValue: number | null;
  baselineValue: number;
  expectedRange: {
    min: number;
    max: number;
  };
  unit: string;
  deviationPercent: number;
  severity: AnomalySeverity;
  detectionMethod: DetectionMethod;
  detectionTimestamp: string;
  missionDay: number;
  explanation: string;
  clinicalSignificanceDisclaimer: string;
  status: AnomalyReviewStatus;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  reviewerNotes?: string;
}

export interface AnomalyFilterOptions {
  severity?: AnomalySeverity | 'All';
  status?: AnomalyReviewStatus | 'All';
  system?: string | 'All';
  astronautId?: string | 'All';
}
