import { HealthMetric } from '../types/contracts';

export const MOCK_ASTRONAUT_METRICS: Record<string, HealthMetric[]> = {
  'AST-084-SC': [
    {
      id: 'metric-hrv',
      name: 'Heart Rate Variability (rMSSD)',
      domain: 'cardiovascular',
      currentValue: 38,
      unit: 'ms',
      baselineValue: 54,
      nominalRange: [40, 75],
      status: 'warning',
      trend: 'decreasing',
      trendDeltaPercent: -18.5,
      lastUpdated: '12 min ago',
      provenance: {
        type: 'live-telemetry',
        sourceSystem: 'Crew Bio-Harness (Lead II ECG R-Peak Detection)',
        timestamp: '2026-11-14T15:48:00Z',
        transformationStatus: 'calibrated',
        completenessPercentage: 99.1,
        isSimulated: false
      },
      timeSeriesHistory: [
        { timestamp: 'FD 136', value: 52, baseline: 54, lowerNominal: 40, upperNominal: 75 },
        { timestamp: 'FD 137', value: 49, baseline: 54, lowerNominal: 40, upperNominal: 75 },
        { timestamp: 'FD 138', value: 46, baseline: 54, lowerNominal: 40, upperNominal: 75 },
        { timestamp: 'FD 139', value: 44, baseline: 54, lowerNominal: 40, upperNominal: 75 },
        { timestamp: 'FD 140', value: 41, baseline: 54, lowerNominal: 40, upperNominal: 75 },
        { timestamp: 'FD 141', value: 39, baseline: 54, lowerNominal: 40, upperNominal: 75 },
        { timestamp: 'FD 142', value: 38, baseline: 54, lowerNominal: 40, upperNominal: 75 }
      ]
    },
    {
      id: 'metric-bp-sys',
      name: 'Systolic Arterial Pressure',
      domain: 'cardiovascular',
      currentValue: 128,
      unit: 'mmHg',
      baselineValue: 114,
      nominalRange: [100, 130],
      status: 'nominal',
      trend: 'increasing',
      trendDeltaPercent: 12.2,
      lastUpdated: '15 min ago',
      provenance: {
        type: 'live-telemetry',
        sourceSystem: 'Ambulatory Blood Pressure Cuff',
        timestamp: '2026-11-14T15:45:00Z',
        transformationStatus: 'calibrated',
        completenessPercentage: 100,
        isSimulated: false
      },
      timeSeriesHistory: [
        { timestamp: 'FD 136', value: 116, baseline: 114, lowerNominal: 100, upperNominal: 130 },
        { timestamp: 'FD 137', value: 118, baseline: 114, lowerNominal: 100, upperNominal: 130 },
        { timestamp: 'FD 138', value: 120, baseline: 114, lowerNominal: 100, upperNominal: 130 },
        { timestamp: 'FD 139', value: 124, baseline: 114, lowerNominal: 100, upperNominal: 130 },
        { timestamp: 'FD 140', value: 125, baseline: 114, lowerNominal: 100, upperNominal: 130 },
        { timestamp: 'FD 141', value: 127, baseline: 114, lowerNominal: 100, upperNominal: 130 },
        { timestamp: 'FD 142', value: 128, baseline: 114, lowerNominal: 100, upperNominal: 130 }
      ]
    },
    {
      id: 'metric-sleep-duration',
      name: 'Total Sleep Duration',
      domain: 'sleep',
      currentValue: 5.4,
      unit: 'hours',
      baselineValue: 7.5,
      nominalRange: [6.5, 8.5],
      status: 'warning',
      trend: 'decreasing',
      trendDeltaPercent: -28.0,
      lastUpdated: 'Morning sync',
      provenance: {
        type: 'derived-metric',
        sourceSystem: 'Actigraphy Sleep Scoring Algorithm v3.2',
        timestamp: '2026-11-14T07:00:00Z',
        transformationStatus: 'derived',
        completenessPercentage: 96.5,
        isSimulated: false
      },
      timeSeriesHistory: [
        { timestamp: 'FD 136', value: 7.1, baseline: 7.5, lowerNominal: 6.5, upperNominal: 8.5 },
        { timestamp: 'FD 137', value: 6.8, baseline: 7.5, lowerNominal: 6.5, upperNominal: 8.5 },
        { timestamp: 'FD 138', value: 6.2, baseline: 7.5, lowerNominal: 6.5, upperNominal: 8.5 },
        { timestamp: 'FD 139', value: 5.9, baseline: 7.5, lowerNominal: 6.5, upperNominal: 8.5 },
        { timestamp: 'FD 140', value: 5.6, baseline: 7.5, lowerNominal: 6.5, upperNominal: 8.5 },
        { timestamp: 'FD 141', value: 5.3, baseline: 7.5, lowerNominal: 6.5, upperNominal: 8.5 },
        { timestamp: 'FD 142', value: 5.4, baseline: 7.5, lowerNominal: 6.5, upperNominal: 8.5 }
      ]
    },
    {
      id: 'metric-bmd-ntx',
      name: 'Serum NTX (Bone Collagen Turnover)',
      domain: 'musculoskeletal',
      currentValue: 24.2,
      unit: 'nM BCE',
      baselineValue: 15.0,
      nominalRange: [10.0, 22.0],
      status: 'warning',
      trend: 'increasing',
      trendDeltaPercent: 38.0,
      lastUpdated: 'Yesterday lab assay',
      provenance: {
        type: 'live-telemetry',
        sourceSystem: 'In-Flight Biomedical Wet Lab ELISA Assay',
        timestamp: '2026-11-13T16:00:00Z',
        transformationStatus: 'calibrated',
        completenessPercentage: 100,
        isSimulated: false
      },
      timeSeriesHistory: [
        { timestamp: 'FD 112', value: 16.5, baseline: 15.0, lowerNominal: 10.0, upperNominal: 22.0 },
        { timestamp: 'FD 118', value: 18.2, baseline: 15.0, lowerNominal: 10.0, upperNominal: 22.0 },
        { timestamp: 'FD 124', value: 19.9, baseline: 15.0, lowerNominal: 10.0, upperNominal: 22.0 },
        { timestamp: 'FD 130', value: 21.4, baseline: 15.0, lowerNominal: 10.0, upperNominal: 22.0 },
        { timestamp: 'FD 136', value: 23.1, baseline: 15.0, lowerNominal: 10.0, upperNominal: 22.0 },
        { timestamp: 'FD 142', value: 24.2, baseline: 15.0, lowerNominal: 10.0, upperNominal: 22.0 }
      ]
    },
    {
      id: 'metric-rad-cum',
      name: 'Cumulative Absorbed Radiation Dose',
      domain: 'radiation',
      currentValue: 72.4,
      unit: 'mSv',
      baselineValue: 0.0,
      nominalRange: [0, 150],
      status: 'nominal',
      trend: 'increasing',
      trendDeltaPercent: 4.8,
      lastUpdated: 'Live dosimeter stream',
      provenance: {
        type: 'live-telemetry',
        sourceSystem: 'Crew Personal Active Dosimeter (CPAD)',
        timestamp: '2026-11-14T15:50:00Z',
        transformationStatus: 'calibrated',
        completenessPercentage: 100,
        isSimulated: false
      },
      timeSeriesHistory: [
        { timestamp: 'FD 136', value: 69.5, baseline: 0.0, lowerNominal: 0, upperNominal: 150 },
        { timestamp: 'FD 137', value: 70.0, baseline: 0.0, lowerNominal: 0, upperNominal: 150 },
        { timestamp: 'FD 138', value: 70.5, baseline: 0.0, lowerNominal: 0, upperNominal: 150 },
        { timestamp: 'FD 139', value: 71.0, baseline: 0.0, lowerNominal: 0, upperNominal: 150 },
        { timestamp: 'FD 140', value: 71.5, baseline: 0.0, lowerNominal: 0, upperNominal: 150 },
        { timestamp: 'FD 141', value: 71.9, baseline: 0.0, lowerNominal: 0, upperNominal: 150 },
        { timestamp: 'FD 142', value: 72.4, baseline: 0.0, lowerNominal: 0, upperNominal: 150 }
      ]
    },
    {
      id: 'metric-immune-il6',
      name: 'Interleukin-6 (Systemic Inflammatory Cytokine)',
      domain: 'immune',
      currentValue: 4.2,
      unit: 'pg/mL',
      baselineValue: 1.8,
      nominalRange: [1.0, 3.5],
      status: 'warning',
      trend: 'increasing',
      trendDeltaPercent: 42.0,
      lastUpdated: 'Yesterday lab assay',
      provenance: {
        type: 'derived-metric',
        sourceSystem: 'Multiplex Cytokine Array (Bio-Analyzer)',
        timestamp: '2026-11-13T16:20:00Z',
        transformationStatus: 'derived',
        completenessPercentage: 100,
        isSimulated: false
      },
      timeSeriesHistory: [
        { timestamp: 'FD 112', value: 2.1, baseline: 1.8, lowerNominal: 1.0, upperNominal: 3.5 },
        { timestamp: 'FD 118', value: 2.4, baseline: 1.8, lowerNominal: 1.0, upperNominal: 3.5 },
        { timestamp: 'FD 124', value: 2.8, baseline: 1.8, lowerNominal: 1.0, upperNominal: 3.5 },
        { timestamp: 'FD 130', value: 3.2, baseline: 1.8, lowerNominal: 1.0, upperNominal: 3.5 },
        { timestamp: 'FD 136', value: 3.8, baseline: 1.8, lowerNominal: 1.0, upperNominal: 3.5 },
        { timestamp: 'FD 142', value: 4.2, baseline: 1.8, lowerNominal: 1.0, upperNominal: 3.5 }
      ]
    }
  ]
};
