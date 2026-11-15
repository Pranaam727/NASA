/**
 * AstroCare P11 — Master Application API Adapter Example
 * 
 * Demonstrates how the master AstroCare application connects its backend telemetry,
 * database, or simulation engine to P11's WellnessDataProvider interface.
 */

import type {
  WellnessDataProvider,
  SleepRecord,
  WellnessRecord,
  CircadianRecord,
  FatigueRecord,
  CognitivePerformanceRecord,
  TeamWellnessRecord,
  WellnessAlert,
} from '../src/types';

export class MasterAstroCareAdapter implements WellnessDataProvider {
  private baseUrl: string;
  private authToken?: string;

  constructor(baseUrl = '/api/v1', authToken?: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  private async fetchJson<T>(path: string, options?: RequestInit): Promise<T> {
    const headers = new Headers(options?.headers || {});
    headers.set('Content-Type', 'application/json');
    if (this.authToken) {
      headers.set('Authorization', `Bearer ${this.authToken}`);
    }

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Master AstroCare API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async getSleepRecords(astronautId: string): Promise<SleepRecord[]> {
    return this.fetchJson<SleepRecord[]>(`/crew/${astronautId}/sleep`);
  }

  async getWellnessRecords(astronautId: string): Promise<WellnessRecord[]> {
    return this.fetchJson<WellnessRecord[]>(`/crew/${astronautId}/wellness`);
  }

  async getCircadianRecords(astronautId: string): Promise<CircadianRecord[]> {
    return this.fetchJson<CircadianRecord[]>(`/crew/${astronautId}/circadian`);
  }

  async getFatigueRecords(astronautId: string): Promise<FatigueRecord[]> {
    return this.fetchJson<FatigueRecord[]>(`/crew/${astronautId}/fatigue`);
  }

  async getCognitiveRecords(astronautId: string): Promise<CognitivePerformanceRecord[]> {
    return this.fetchJson<CognitivePerformanceRecord[]>(`/crew/${astronautId}/cognitive`);
  }

  async getTeamWellnessRecords(missionId: string): Promise<TeamWellnessRecord[]> {
    return this.fetchJson<TeamWellnessRecord[]>(`/missions/${missionId}/team-wellness`);
  }

  async getWellnessAlerts(astronautId: string): Promise<WellnessAlert[]> {
    return this.fetchJson<WellnessAlert[]>(`/crew/${astronautId}/wellness-alerts`);
  }

  async saveSleepRecord(record: Omit<SleepRecord, 'id'>): Promise<SleepRecord> {
    return this.fetchJson<SleepRecord>(`/crew/${record.astronautId}/sleep`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async saveWellnessRecord(record: Omit<WellnessRecord, 'id'>): Promise<WellnessRecord> {
    return this.fetchJson<WellnessRecord>(`/crew/${record.astronautId}/wellness`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async saveCognitiveRecord(record: Omit<CognitivePerformanceRecord, 'id'>): Promise<CognitivePerformanceRecord> {
    return this.fetchJson<CognitivePerformanceRecord>(`/crew/${record.astronautId}/cognitive`, {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  async resetDemoData(): Promise<void> {
    await this.fetchJson<void>('/demo/reset', { method: 'POST' });
  }
}

export const masterAstroCareAdapter = new MasterAstroCareAdapter();
