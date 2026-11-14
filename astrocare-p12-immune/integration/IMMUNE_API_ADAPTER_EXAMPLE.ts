/**
 * AstroCare P12 — API Adapter Example
 * Demonstrates how master AstroCare backend or microservice endpoints
 * can replace the deterministic local providers.
 */

import {
  AstronautContext,
  ImmuneCellRecord,
  BiomarkerRecord,
  LaboratorySample,
  LaboratoryResult,
  ImmuneAlert,
  OptionalRadiationContext,
  OptionalWellnessContext,
} from '../src/types';

export interface P12ImmuneDataProvider {
  getAstronautContext(astronautId: string): Promise<AstronautContext>;
  getImmuneCells(astronautId: string, filter?: { phase?: string }): Promise<ImmuneCellRecord[]>;
  getBiomarkers(astronautId: string, filter?: { category?: string }): Promise<BiomarkerRecord[]>;
  getLaboratorySamples(astronautId: string): Promise<LaboratorySample[]>;
  createSample(sample: Omit<LaboratorySample, 'history'>): Promise<LaboratorySample>;
  updateSampleStatus(sampleId: string, status: string, comment: string): Promise<LaboratorySample>;
  getLaboratoryResults(astronautId: string): Promise<LaboratoryResult[]>;
  getAlerts(astronautId: string): Promise<ImmuneAlert[]>;
}

/**
 * Example HTTP Adapter connecting to master AstroCare REST or GraphQL API
 */
export class MasterAstroCareRemoteAdapter implements P12ImmuneDataProvider {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string = '/api/v1/astrocare', authToken: string = '') {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  private async fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.authToken}`,
        ...options?.headers,
      },
    });

    if (!res.ok) {
      throw new Error(`AstroCare API Error [${res.status}]: ${await res.text()}`);
    }

    return res.json();
  }

  public async getAstronautContext(astronautId: string): Promise<AstronautContext> {
    return this.fetchJson<AstronautContext>(`/astronauts/${astronautId}/context`);
  }

  public async getImmuneCells(astronautId: string, filter?: { phase?: string }): Promise<ImmuneCellRecord[]> {
    const query = filter?.phase ? `?phase=${filter.phase}` : '';
    return this.fetchJson<ImmuneCellRecord[]>(`/immune/${astronautId}/cells${query}`);
  }

  public async getBiomarkers(astronautId: string, filter?: { category?: string }): Promise<BiomarkerRecord[]> {
    const query = filter?.category ? `?category=${filter.category}` : '';
    return this.fetchJson<BiomarkerRecord[]>(`/immune/${astronautId}/biomarkers${query}`);
  }

  public async getLaboratorySamples(astronautId: string): Promise<LaboratorySample[]> {
    return this.fetchJson<LaboratorySample[]>(`/laboratory/${astronautId}/samples`);
  }

  public async createSample(sample: Omit<LaboratorySample, 'history'>): Promise<LaboratorySample> {
    return this.fetchJson<LaboratorySample>(`/laboratory/samples`, {
      method: 'POST',
      body: JSON.stringify(sample),
    });
  }

  public async updateSampleStatus(sampleId: string, status: string, comment: string): Promise<LaboratorySample> {
    return this.fetchJson<LaboratorySample>(`/laboratory/samples/${sampleId}/workflow`, {
      method: 'PATCH',
      body: JSON.stringify({ status, comment }),
    });
  }

  public async getLaboratoryResults(astronautId: string): Promise<LaboratoryResult[]> {
    return this.fetchJson<LaboratoryResult[]>(`/laboratory/${astronautId}/results`);
  }

  public async getAlerts(astronautId: string): Promise<ImmuneAlert[]> {
    return this.fetchJson<ImmuneAlert[]>(`/immune/${astronautId}/alerts`);
  }
}
