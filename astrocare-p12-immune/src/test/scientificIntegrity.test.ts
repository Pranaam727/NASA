import { describe, it, expect } from 'vitest';
import { DEMO_IMMUNE_CELLS, DEMO_BIOMARKERS, DEMO_ASTRONAUT_CONTEXT } from '../data/mockImmuneData';
import { OSDR_DATASETS } from '../constants/nasaResourcesData';
import { calculatePercentChange } from '../utils/calculations';

describe('Scientific Integrity & Aerospace Medical Guardrails', () => {
  it('strictly labels all demonstration astronaut data as SIMULATED', () => {
    expect(DEMO_ASTRONAUT_CONTEXT.dataOrigin).toBe('SIMULATED');
    expect(DEMO_IMMUNE_CELLS.every((c) => c.dataOrigin === 'SIMULATED')).toBe(true);
    expect(DEMO_BIOMARKERS.every((b) => b.dataOrigin === 'SIMULATED')).toBe(true);
  });

  it('distinguishes human astronaut datasets from rodent animal-models and cell models', () => {
    const humanAstronaut = OSDR_DATASETS.find((d) => d.id === 'OSD-575');
    const cellModel = OSDR_DATASETS.find((d) => d.id === 'OSD-2');
    const animalModel = OSDR_DATASETS.find((d) => d.id === 'OSD-4');

    expect(humanAstronaut?.category).toBe('HUMAN_ASTRONAUT_RESEARCH');
    expect(cellModel?.category).toBe('HUMAN_CELL_MODEL');
    expect(animalModel?.category).toBe('ANIMAL_MODEL');

    // Verification of explicit caveat text
    expect(cellModel?.caveatsAndLimitations.some((c) => c.toLowerCase().includes('cell-model'))).toBe(true);
    expect(animalModel?.caveatsAndLimitations.some((c) => c.toLowerCase().includes('animal-model'))).toBe(true);
  });

  it('does not treat missing values as zero', () => {
    // Missing baseline should return null, not 0 or calculated % change
    const result = calculatePercentChange(10, null as any);
    expect(result).toBeNull();
  });

  it('preserves distinct metrological units across biomarker categories', () => {
    const cytokines = DEMO_BIOMARKERS.filter((b) => b.category === 'CYTOKINE');
    const inflammatory = DEMO_BIOMARKERS.filter((b) => b.category === 'INFLAMMATORY');
    const hormonal = DEMO_BIOMARKERS.filter((b) => b.category === 'STRESS_HORMONAL');

    expect(cytokines.every((c) => c.unit === 'pg/mL')).toBe(true);
    expect(inflammatory.some((i) => i.unit === 'mg/L')).toBe(true); // hs-CRP
    expect(hormonal.some((h) => h.unit === 'nmol/L')).toBe(true); // salivary cortisol
  });

  it('confirms reference intervals document their origin source and context', () => {
    expect(DEMO_IMMUNE_CELLS.every((c) => c.referenceSource && c.referenceSource.length > 0)).toBe(true);
    expect(DEMO_BIOMARKERS.every((b) => b.referenceSource && b.referenceSource.length > 0)).toBe(true);
  });
});
