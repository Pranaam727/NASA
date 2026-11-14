import { describe, it, expect, beforeEach } from 'vitest';
import { laboratoryService } from '../services/laboratory/laboratoryService';

describe('Laboratory Service & Specimen Workflow', () => {
  beforeEach(() => {
    laboratoryService.resetToDefault();
  });

  it('retrieves default demonstration samples', () => {
    const samples = laboratoryService.getSamples();
    expect(samples.length).toBeGreaterThan(5);
    expect(samples.some((s) => s.sampleType === 'BLOOD')).toBe(true);
    expect(samples.some((s) => s.sampleType === 'SALIVA')).toBe(true);
    expect(samples.some((s) => s.sampleType === 'URINE')).toBe(true);
  });

  it('prevents registration of duplicate sample IDs', () => {
    const existing = laboratoryService.getSamples()[0];
    const attempt = laboratoryService.addSample({
      id: existing.id,
      astronautId: 'AST-042',
      missionId: 'EXP-74',
      sampleType: 'SERUM',
      collectionTimestamp: new Date().toISOString(),
      missionPhase: 'IN_FLIGHT',
      missionDay: 88,
      collectionStatus: 'SUCCESS',
      workflowStatus: 'COLLECTED',
      storageCondition: 'CRYOPRESERVED_MINUS_80C',
      storageLocation: 'MELFI',
      volumeMl: 5.0,
      laboratory: 'ISS Lab',
      associatedAssays: ['Luminex'],
      collectedBy: 'CMO',
      source: 'Test',
      dataOrigin: 'SIMULATED',
    });

    expect(attempt.success).toBe(false);
    expect(attempt.error).toContain('already exists');
  });

  it('successfully adds a valid new specimen and initializes audit history', () => {
    const newId = 'SMP-TEST-999';
    const result = laboratoryService.addSample({
      id: newId,
      astronautId: 'AST-042',
      missionId: 'EXP-74',
      sampleType: 'SALIVA',
      collectionTimestamp: new Date().toISOString(),
      missionPhase: 'IN_FLIGHT',
      missionDay: 88,
      collectionStatus: 'SUCCESS',
      workflowStatus: 'COLLECTED',
      storageCondition: 'FROZEN_MINUS_20C',
      storageLocation: 'MELFI-2',
      volumeMl: 2.0,
      laboratory: 'WetLab-2',
      associatedAssays: ['Cortisol'],
      collectedBy: 'Dr. Sarah Chen',
      source: 'Test Protocol',
      dataOrigin: 'SIMULATED',
    });

    expect(result.success).toBe(true);
    const retrieved = laboratoryService.getSampleById(newId);
    expect(retrieved).toBeDefined();
    expect(retrieved?.history.length).toBeGreaterThanOrEqual(1);
  });

  it('advances specimen workflow state and records chain of custody audit event', () => {
    const sample = laboratoryService.getSamples()[0];
    const updateRes = laboratoryService.updateSampleWorkflow(
      sample.id,
      'PROCESSING',
      'Dr. Myers',
      'Aliquoted for cytometry'
    );

    expect(updateRes.success).toBe(true);
    const updated = laboratoryService.getSampleById(sample.id);
    expect(updated?.workflowStatus).toBe('PROCESSING');
    const latestEvent = updated?.history[updated.history.length - 1];
    expect(latestEvent?.operator).toBe('Dr. Myers');
    expect(latestEvent?.comment).toBe('Aliquoted for cytometry');
  });

  it('filters samples accurately by type and search term', () => {
    const bloodSamples = laboratoryService.getSamples({ sampleType: 'BLOOD' });
    expect(bloodSamples.every((s) => s.sampleType === 'BLOOD')).toBe(true);

    const searched = laboratoryService.getSamples({ searchTerm: 'MELFI' });
    expect(searched.length).toBeGreaterThan(0);
  });

  it('exports results to CSV with units, reference ranges, and provenance intact', () => {
    const csv = laboratoryService.exportResultsCsv();
    expect(csv).toContain('Result_ID');
    expect(csv).toContain('Analyte');
    expect(csv).toContain('Observed_Value');
    expect(csv).toContain('Unit');
    expect(csv).toContain('Reference_Interval');
    expect(csv).toContain('Data_Provenance');
  });
});
