import { LaboratorySample, LaboratoryResult, SampleWorkflowStatus, SampleType } from '../../types';
import { DEMO_LAB_SAMPLES, DEMO_LAB_RESULTS } from '../../data/mockImmuneData';
import { generateCsv } from '../../utils/calculations';

const SAMPLES_STORAGE_KEY = 'astrocare_p12_samples_v1';
const RESULTS_STORAGE_KEY = 'astrocare_p12_results_v1';

class LaboratoryService {
  private samples: LaboratorySample[] = [];
  private results: LaboratoryResult[] = [];

  constructor() {
    this.initStorage();
  }

  private initStorage(): void {
    try {
      const storedSamples = localStorage.getItem(SAMPLES_STORAGE_KEY);
      if (storedSamples) {
        this.samples = JSON.parse(storedSamples);
      } else {
        this.resetSamplesToDefault();
      }

      const storedResults = localStorage.getItem(RESULTS_STORAGE_KEY);
      if (storedResults) {
        this.results = JSON.parse(storedResults);
      } else {
        this.resetResultsToDefault();
      }
    } catch (e) {
      console.warn('Storage corrupted or unavailable, resetting to default demo data', e);
      this.resetSamplesToDefault();
      this.resetResultsToDefault();
    }
  }

  public resetToDefault(): void {
    this.resetSamplesToDefault();
    this.resetResultsToDefault();
  }

  private resetSamplesToDefault(): void {
    this.samples = JSON.parse(JSON.stringify(DEMO_LAB_SAMPLES));
    this.saveSamples();
  }

  private resetResultsToDefault(): void {
    this.results = JSON.parse(JSON.stringify(DEMO_LAB_RESULTS));
    this.saveResults();
  }

  private saveSamples(): void {
    try {
      localStorage.setItem(SAMPLES_STORAGE_KEY, JSON.stringify(this.samples));
    } catch (e) {
      console.error('Failed to save samples to localStorage', e);
    }
  }

  private saveResults(): void {
    try {
      localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(this.results));
    } catch (e) {
      console.error('Failed to save results to localStorage', e);
    }
  }

  // --- SAMPLES CRUD & QUERY ---

  public getSamples(filters?: {
    astronautId?: string;
    sampleType?: SampleType | 'ALL';
    workflowStatus?: SampleWorkflowStatus | 'ALL';
    searchTerm?: string;
  }): LaboratorySample[] {
    let list = [...this.samples];

    if (filters?.astronautId) {
      list = list.filter((s) => s.astronautId === filters.astronautId);
    }

    if (filters?.sampleType && filters.sampleType !== 'ALL') {
      list = list.filter((s) => s.sampleType === filters.sampleType);
    }

    if (filters?.workflowStatus && filters.workflowStatus !== 'ALL') {
      list = list.filter((s) => s.workflowStatus === filters.workflowStatus);
    }

    if (filters?.searchTerm && filters.searchTerm.trim() !== '') {
      const q = filters.searchTerm.toLowerCase().trim();
      list = list.filter(
        (s) =>
          s.id.toLowerCase().includes(q) ||
          s.laboratory.toLowerCase().includes(q) ||
          s.storageLocation.toLowerCase().includes(q) ||
          s.associatedAssays.some((a) => a.toLowerCase().includes(q))
      );
    }

    return list.sort(
      (a, b) => new Date(b.collectionTimestamp).getTime() - new Date(a.collectionTimestamp).getTime()
    );
  }

  public getSampleById(id: string): LaboratorySample | undefined {
    return this.samples.find((s) => s.id === id);
  }

  public addSample(newSample: Omit<LaboratorySample, 'history'> & { history?: LaboratorySample['history'] }): {
    success: boolean;
    error?: string;
    sample?: LaboratorySample;
  } {
    // Duplicate check
    const existing = this.samples.find(
      (s) => s.id.toLowerCase().trim() === newSample.id.toLowerCase().trim()
    );
    if (existing) {
      return { success: false, error: `Sample with identifier "${newSample.id}" already exists.` };
    }

    if (!newSample.id || !newSample.astronautId || !newSample.sampleType) {
      return { success: false, error: 'Required fields missing (ID, Astronaut, or Sample Type).' };
    }

    const initialHistory = newSample.history || [
      {
        timestamp: new Date().toISOString(),
        status: newSample.workflowStatus,
        operator: newSample.collectedBy || 'Current Operator',
        comment: 'Initial sample record registered.',
      },
    ];

    const sampleToStore: LaboratorySample = {
      ...newSample,
      history: initialHistory,
    };

    this.samples.unshift(sampleToStore);
    this.saveSamples();
    return { success: true, sample: sampleToStore };
  }

  public updateSampleWorkflow(
    id: string,
    newStatus: SampleWorkflowStatus,
    operator: string,
    comment: string
  ): { success: boolean; error?: string; sample?: LaboratorySample } {
    const index = this.samples.findIndex((s) => s.id === id);
    if (index === -1) {
      return { success: false, error: `Sample ${id} not found.` };
    }

    const sample = this.samples[index];
    sample.workflowStatus = newStatus;
    sample.history.push({
      timestamp: new Date().toISOString(),
      status: newStatus,
      operator: operator || 'Medical Officer',
      comment: comment || `Status updated to ${newStatus}`,
    });

    this.saveSamples();
    return { success: true, sample };
  }

  // --- RESULTS QUERY & EXPORT ---

  public getResults(filters?: {
    astronautId?: string;
    sampleId?: string;
    category?: string;
    interpretation?: string;
    searchTerm?: string;
  }): LaboratoryResult[] {
    let list = [...this.results];

    if (filters?.astronautId) {
      list = list.filter((r) => r.astronautId === filters.astronautId);
    }

    if (filters?.sampleId) {
      list = list.filter((r) => r.sampleId === filters.sampleId);
    }

    if (filters?.category && filters.category !== 'ALL') {
      list = list.filter((r) => r.category === filters.category);
    }

    if (filters?.interpretation && filters.interpretation !== 'ALL') {
      list = list.filter((r) => r.interpretation === filters.interpretation);
    }

    if (filters?.searchTerm && filters.searchTerm.trim() !== '') {
      const q = filters.searchTerm.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.analyte.toLowerCase().includes(q) ||
          r.sampleId.toLowerCase().includes(q) ||
          r.laboratoryName.toLowerCase().includes(q) ||
          r.assayMethod.toLowerCase().includes(q)
      );
    }

    return list.sort(
      (a, b) => new Date(b.resultTimestamp).getTime() - new Date(a.resultTimestamp).getTime()
    );
  }

  public getResultById(id: string): LaboratoryResult | undefined {
    return this.results.find((r) => r.id === id);
  }

  public addResult(result: LaboratoryResult): { success: boolean; error?: string } {
    if (this.results.some((r) => r.id === result.id)) {
      return { success: false, error: `Result ID ${result.id} already exists.` };
    }
    this.results.unshift(result);
    this.saveResults();
    return { success: true };
  }

  public exportResultsCsv(resultsToExport?: LaboratoryResult[]): string {
    const data = resultsToExport || this.results;
    return generateCsv<LaboratoryResult>(data, [
      { key: 'id', header: 'Result_ID' },
      { key: 'sampleId', header: 'Sample_ID' },
      { key: 'astronautId', header: 'Astronaut_ID' },
      { key: 'missionId', header: 'Mission_ID' },
      { key: 'analyte', header: 'Analyte' },
      { key: 'category', header: 'Category' },
      { key: 'value', header: 'Observed_Value' },
      { key: 'unit', header: 'Unit' },
      { key: 'referenceIntervalText', header: 'Reference_Interval' },
      { key: 'referenceSource', header: 'Reference_Source' },
      { key: 'interpretation', header: 'Interpretation' },
      { key: 'assayMethod', header: 'Assay_Method' },
      { key: 'laboratoryName', header: 'Laboratory' },
      { key: 'collectionTimestamp', header: 'Collection_Timestamp' },
      { key: 'resultTimestamp', header: 'Result_Timestamp' },
      { key: 'resultStatus', header: 'Result_Status' },
      { key: 'dataProvenance', header: 'Data_Provenance' },
      { key: 'dataOrigin', header: 'Data_Origin' },
    ]);
  }
}

export const laboratoryService = new LaboratoryService();
