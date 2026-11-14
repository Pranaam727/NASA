import { MissionPhase, MonitoringState } from './context';

export interface LongitudinalMetricSummary {
  metricKey: string;
  metricName: string;
  category: string;
  unit: string;
  preFlightBaseline: number | null;
  latestValue: number | null;
  absoluteChange: number | null;
  percentChange: number | null; // null if baseline is 0 or null
  isCalculable: boolean;
  totalMeasurements: number;
  expectedMeasurements: number;
  missingDataPercent: number;
  phaseAverages: {
    preFlight: number | null;
    inFlight: number | null;
    postFlight: number | null;
    recovery: number | null;
  };
  trendPattern: 'STABLE' | 'ELEVATED_IN_FLIGHT' | 'DEPRESSED_IN_FLIGHT' | 'PERSISTENT_SHIFT' | 'VARIABLE';
  monitoringState: MonitoringState;
  referenceLow: number;
  referenceHigh: number;
  notes: string;
}

export interface LongitudinalTimelinePoint {
  date: string;
  missionDay: number;
  missionPhase: MissionPhase;
  sampleId?: string;
  values: Record<string, number | null>;
}
