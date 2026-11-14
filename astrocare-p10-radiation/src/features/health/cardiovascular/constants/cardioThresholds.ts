/**
 * Demo cardiovascular thresholds for Astronaut health monitoring.
 * These values are illustrative only and not clinically validated.
 */
export interface CardioThresholds {
  warning: {
    heartRate: number; // beats per minute
    systolic: number;  // mmHg
    diastolic: number; // mmHg
    spo2: number;      // percent
  };
  critical: {
    heartRate: number;
    systolic: number;
    diastolic: number;
    spo2: number;
  };
}

export const CARDIO_THRESHOLDS: CardioThresholds = {
  warning: {
    heartRate: 100,
    systolic: 140,
    diastolic: 90,
    spo2: 94,
  },
  critical: {
    heartRate: 130,
    systolic: 160,
    diastolic: 100,
    spo2: 90,
  },
};
