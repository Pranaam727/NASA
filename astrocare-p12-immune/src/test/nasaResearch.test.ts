import { describe, it, expect } from 'vitest';
import { nasaResearchService } from '../services/nasa/nasaResearchService';

describe('NASA Research Service & OSDR Integration', () => {
  it('retrieves all catalogued OSDR candidate datasets', () => {
    const datasets = nasaResearchService.getDatasets();
    expect(datasets.length).toBe(5);

    const studyIds = datasets.map((d) => d.studyIdentifier);
    expect(studyIds).toContain('OSD-575');
    expect(studyIds).toContain('OSD-53');
    expect(studyIds).toContain('OSD-2');
    expect(studyIds).toContain('OSD-4');
    expect(studyIds).toContain('OSD-54');
  });

  it('correctly classifies human astronaut vs cell model vs animal model', () => {
    const osd575 = nasaResearchService.getDatasetById('OSD-575');
    expect(osd575?.category).toBe('HUMAN_ASTRONAUT_RESEARCH');
    expect(osd575?.organism).toContain('Homo sapiens');

    const osd2 = nasaResearchService.getDatasetById('OSD-2');
    expect(osd2?.category).toBe('HUMAN_CELL_MODEL');
    expect(osd2?.caveatsAndLimitations.some((c) => c.toLowerCase().includes('cell-model'))).toBe(true);

    const osd4 = nasaResearchService.getDatasetById('OSD-4');
    expect(osd4?.category).toBe('ANIMAL_MODEL');
    expect(osd4?.organism).toContain('Mus musculus');
  });

  it('filters datasets by topic and keyword search', () => {
    const cytokineDatasets = nasaResearchService.getDatasets({
      topic: 'CYTOKINE_ARRAY',
    });
    expect(cytokineDatasets.length).toBeGreaterThan(0);
    expect(cytokineDatasets.some((d) => d.id === 'OSD-575')).toBe(true);

    const searchResult = nasaResearchService.getDatasets({
      searchTerm: 'Inspiration4',
    });
    expect(searchResult.length).toBe(1);
    expect(searchResult[0].id).toBe('OSD-575');
  });

  it('supports bookmarking and saving datasets locally', () => {
    const isSavedInitially = nasaResearchService.isSaved('OSD-575');
    nasaResearchService.toggleSaveDataset('OSD-575');
    expect(nasaResearchService.isSaved('OSD-575')).toBe(!isSavedInitially);
    // toggle back
    nasaResearchService.toggleSaveDataset('OSD-575');
  });

  it('retrieves all 7 mandatory official NASA research references', () => {
    const resources = nasaResearchService.getOfficialResources();
    expect(resources.length).toBe(7);

    const resourceIds = resources.map((r) => r.id);
    expect(resourceIds).toContain('NASA-RES-1');
    expect(resourceIds).toContain('NASA-RES-2');
    expect(resourceIds).toContain('NASA-RES-7');
  });
});
