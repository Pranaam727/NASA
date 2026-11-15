import { describe, it, expect, beforeEach } from 'vitest';
import { astronautProfileService } from '../services/astronautProfileService';
import { predictionService } from '../services/predictionService';
import { evaluateDataQuality } from '../utils/dataQuality';
import { measurementService } from '../services/measurementService';

describe('Astronaut Profiles & Predictive Analytics', () => {
  beforeEach(() => {
    astronautProfileService.resetToDemo();
    measurementService.resetToDemo();
  });

  it('creates and persists a new astronaut profile', () => {
    const created = astronautProfileService.create({
      displayName: 'MS Test Subject',
      codeName: 'Test-1',
      role: 'Biomedical Engineer',
      missionId: 'TEST-EXP',
      missionName: 'Test Simulation Expedition',
      missionType: 'LEO',
      missionPhase: 'Preflight',
      missionDay: -5,
      missionDurationDays: 90,
      age: 33,
      biologicalSex: 'Male',
    });

    expect(created.id).toBeDefined();
    expect(created.displayName).toBe('MS Test Subject');
    expect(created.isSynthetic).toBe(true);

    const fetched = astronautProfileService.getById(created.id);
    expect(fetched?.displayName).toBe('MS Test Subject');
  });

  it('updates an existing astronaut profile', () => {
    const updated = astronautProfileService.update('astro-001', {
      missionDay: 70,
    });
    expect(updated?.missionDay).toBe(70);

    const refetched = astronautProfileService.getById('astro-001');
    expect(refetched?.missionDay).toBe(70);
  });

  it('generates a predictive analysis with 95% confidence intervals', () => {
    const forecast = predictionService.generateForecast('astro-001', 'resting_heart_rate', 'Linear Regression', 14);

    expect(forecast.status).toBe('completed');
    expect(forecast.predictions.length).toBeGreaterThan(0);
    expect(forecast.predictions[0].confidenceLower).toBeLessThanOrEqual(forecast.predictions[0].predictedValue);
    expect(forecast.predictions[0].confidenceUpper).toBeGreaterThanOrEqual(forecast.predictions[0].predictedValue);
    expect(forecast.assumptions.length).toBeGreaterThan(0);
    expect(forecast.limitations.length).toBeGreaterThan(0);
  });

  it('evaluates data quality and flags gaps in telemetry series', () => {
    const measurements = measurementService.getByAstronaut('astro-001');
    const quality = evaluateDataQuality(measurements, 180);

    expect(quality.totalObservations).toBeGreaterThan(0);
    expect(quality.completenessPercentage).toBeGreaterThan(80);
    expect(quality.averageQualityScore).toBeGreaterThan(80);
  });
});
