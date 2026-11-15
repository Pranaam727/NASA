// AstroCare P11 — Local Demo Data Provider
// Implements WellnessDataProvider using localStorage + demo seed data

import type {
  WellnessDataProvider,
  SleepRecord,
  WellnessRecord,
  CircadianRecord,
  FatigueRecord,
  CognitivePerformanceRecord,
  TeamWellnessRecord,
  WellnessAlert,
} from '../../types';
import { STORAGE_KEYS } from '../../constants';
import { generateId, safeGetJSON, safeSetJSON } from '../../utils';
import {
  DEMO_SLEEP_RECORDS,
  DEMO_WELLNESS_RECORDS,
  DEMO_CIRCADIAN_RECORDS,
  DEMO_FATIGUE_RECORDS,
  DEMO_COGNITIVE_RECORDS,
  DEMO_TEAM_RECORDS,
  DEMO_ALERTS,
} from '../../data/demoData';

function ensureInitialized(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.DEMO_INITIALIZED);
  if (!initialized) {
    safeSetJSON(STORAGE_KEYS.SLEEP_RECORDS, DEMO_SLEEP_RECORDS);
    safeSetJSON(STORAGE_KEYS.WELLNESS_RECORDS, DEMO_WELLNESS_RECORDS);
    safeSetJSON(STORAGE_KEYS.COGNITIVE_RECORDS, DEMO_COGNITIVE_RECORDS);
    localStorage.setItem(STORAGE_KEYS.DEMO_INITIALIZED, '1');
  }
}

export const localDemoProvider: WellnessDataProvider = {
  async getSleepRecords(astronautId: string): Promise<SleepRecord[]> {
    ensureInitialized();
    const all = safeGetJSON<SleepRecord[]>(STORAGE_KEYS.SLEEP_RECORDS, DEMO_SLEEP_RECORDS);
    return all.filter((r) => r.astronautId === astronautId);
  },

  async getWellnessRecords(astronautId: string): Promise<WellnessRecord[]> {
    ensureInitialized();
    const all = safeGetJSON<WellnessRecord[]>(STORAGE_KEYS.WELLNESS_RECORDS, DEMO_WELLNESS_RECORDS);
    return all.filter((r) => r.astronautId === astronautId);
  },

  async getCircadianRecords(astronautId: string): Promise<CircadianRecord[]> {
    return DEMO_CIRCADIAN_RECORDS.filter((r) => r.astronautId === astronautId);
  },

  async getFatigueRecords(astronautId: string): Promise<FatigueRecord[]> {
    return DEMO_FATIGUE_RECORDS.filter((r) => r.astronautId === astronautId);
  },

  async getCognitiveRecords(astronautId: string): Promise<CognitivePerformanceRecord[]> {
    ensureInitialized();
    const all = safeGetJSON<CognitivePerformanceRecord[]>(
      STORAGE_KEYS.COGNITIVE_RECORDS,
      DEMO_COGNITIVE_RECORDS
    );
    return all.filter((r) => r.astronautId === astronautId);
  },

  async getTeamWellnessRecords(missionId: string): Promise<TeamWellnessRecord[]> {
    return DEMO_TEAM_RECORDS.filter((r) => r.missionId === missionId);
  },

  async getWellnessAlerts(astronautId: string): Promise<WellnessAlert[]> {
    return DEMO_ALERTS.filter((a) => !a.astronautId || a.astronautId === astronautId);
  },

  async saveSleepRecord(record: Omit<SleepRecord, 'id'>): Promise<SleepRecord> {
    ensureInitialized();
    const all = safeGetJSON<SleepRecord[]>(STORAGE_KEYS.SLEEP_RECORDS, DEMO_SLEEP_RECORDS);
    const newRecord: SleepRecord = { ...record, id: generateId('SLP') };
    all.push(newRecord);
    safeSetJSON(STORAGE_KEYS.SLEEP_RECORDS, all);
    return newRecord;
  },

  async saveWellnessRecord(record: Omit<WellnessRecord, 'id'>): Promise<WellnessRecord> {
    ensureInitialized();
    const all = safeGetJSON<WellnessRecord[]>(STORAGE_KEYS.WELLNESS_RECORDS, DEMO_WELLNESS_RECORDS);
    const newRecord: WellnessRecord = { ...record, id: generateId('WLN') };
    all.push(newRecord);
    safeSetJSON(STORAGE_KEYS.WELLNESS_RECORDS, all);
    return newRecord;
  },

  async saveCognitiveRecord(
    record: Omit<CognitivePerformanceRecord, 'id'>
  ): Promise<CognitivePerformanceRecord> {
    ensureInitialized();
    const all = safeGetJSON<CognitivePerformanceRecord[]>(
      STORAGE_KEYS.COGNITIVE_RECORDS,
      DEMO_COGNITIVE_RECORDS
    );
    const newRecord: CognitivePerformanceRecord = { ...record, id: generateId('COG') };
    all.push(newRecord);
    safeSetJSON(STORAGE_KEYS.COGNITIVE_RECORDS, all);
    return newRecord;
  },

  async resetDemoData(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.SLEEP_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.WELLNESS_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.COGNITIVE_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_INITIALIZED);
    // Re-initialize with fresh seed
    ensureInitialized();
  },
};
