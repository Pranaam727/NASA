export type MissionDestination = 'Low Earth Orbit (ISS/Axiom)' | 'Lunar Gateway / Artemis' | 'Mars Transit / Habitat' | 'Deep Space Orbit' | 'Ground-based Isolation Analog (HERA/CHAPEA)';

export type RadiationEnvironmentLevel = 'Low (LEO Van Allen Protected)' | 'Moderate (Lunar Surface/Transit)' | 'Elevated (Interplanetary SPE/GCR)' | 'Extreme (Solar Particle Event Simulated)';

export interface MissionScenario {
  id: string;
  name: string;
  destination: MissionDestination;
  durationDays: number;
  environmentDescription: string;
  exerciseSchedule: {
    aerobicHoursPerDay: number;
    resistiveHoursPerDay: number;
    daysPerWeek: number;
  };
  sleepSchedule: {
    targetHours: number;
    circadianLighting: boolean;
    noiseLevelDb: number;
  };
  radiationScenario: {
    environment: RadiationEnvironmentLevel;
    estimatedDailyDoseMsv: number;
    stormShelterAvailable: boolean;
  };
  assumptions: string[];
  scientificNotes: string;
  createdAt: string;
  isPreconfigured: boolean;
}

export interface ScenarioSimulationResult {
  scenarioId: string;
  systemImpacts: {
    system: string;
    projectedChangePercent: number;
    confidenceLevel: string;
    keyDrivers: string[];
    evidenceReferences: string[];
  }[];
  overallReadinessScore: number; // 0-100 scale index
  projectedBiomarkerTrends: {
    day: number;
    estimatedBoneLossPct: number;
    estimatedVo2MaxPct: number;
    estimatedCumulativeDoseMsv: number;
    estimatedSleepDeficitHours: number;
  }[];
}
