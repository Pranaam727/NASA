export type MissionPhase = 'Preflight' | 'Inflight' | 'Postflight' | 'Recovery';

export interface BaselineMeasurement {
  variable: string;
  system: string;
  baselineValue: number;
  unit: string;
  typicalRange: {
    min: number;
    max: number;
  };
  recordedAt: string;
}

export interface AstronautProfile {
  id: string;
  displayName: string;
  codeName: string;
  role: string;
  missionId: string;
  missionName: string;
  missionType: 'LEO' | 'Lunar Gateway' | 'Mars Transit' | 'Deep Space' | 'Ground Analog';
  missionPhase: MissionPhase;
  missionDay: number;
  missionDurationDays: number;
  age?: number;
  biologicalSex?: 'Female' | 'Male' | 'Undisclosed';
  bloodType?: string;
  heightCm?: number;
  weightKg?: number;
  vo2Max?: number;
  isSynthetic: boolean;
  notes?: string;
  baselineMeasurements: Record<string, BaselineMeasurement>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAstronautProfileInput {
  displayName: string;
  codeName: string;
  role: string;
  missionId: string;
  missionName: string;
  missionType: AstronautProfile['missionType'];
  missionPhase: MissionPhase;
  missionDay: number;
  missionDurationDays: number;
  age?: number;
  biologicalSex?: 'Female' | 'Male' | 'Undisclosed';
  heightCm?: number;
  weightKg?: number;
  notes?: string;
}
