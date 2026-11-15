import { describe, it, expect } from 'vitest';
import {
  areVariablesCompatible,
  BIOMEDICAL_VARIABLE_REGISTRY,
} from '../utils/unitValidation';

describe('Biomedical Unit Validation & Compatibility', () => {
  it('registers core aerospace variables with correct standard units', () => {
    expect(BIOMEDICAL_VARIABLE_REGISTRY.resting_heart_rate.standardUnit).toBe('bpm');
    expect(BIOMEDICAL_VARIABLE_REGISTRY.systolic_bp.standardUnit).toBe('mmHg');
    expect(BIOMEDICAL_VARIABLE_REGISTRY.radiation_cumulative_dose.standardUnit).toBe('mSv');
    expect(BIOMEDICAL_VARIABLE_REGISTRY.radiation_daily_rate.standardUnit).toBe('mSv/day');
  });

  it('validates identical variables as compatible', () => {
    const res = areVariablesCompatible('resting_heart_rate', 'resting_heart_rate');
    expect(res.compatible).toBe(true);
  });

  it('rejects comparison between scientifically distinct units', () => {
    const res = areVariablesCompatible('resting_heart_rate', 'systolic_bp');
    expect(res.compatible).toBe(false);
    expect(res.reason).toContain('Incompatible measurement units');
  });

  it('rejects comparison between cumulative dose and daily rate', () => {
    const res = areVariablesCompatible('radiation_cumulative_dose', 'radiation_daily_rate');
    expect(res.compatible).toBe(false);
  });
});
