// AstroCare P11 — Unit Tests: Local Demo Data Provider

import { describe, it, expect, beforeEach } from 'vitest';
import { localDemoProvider } from '../services/wellness/localDemoProvider';
import { DEMO_ASTRONAUT_ID, DEMO_MISSION_ID } from '../constants';

describe('LocalDemoProvider', () => {
  beforeEach(async () => {
    await localDemoProvider.resetDemoData();
  });

  it('loads seed sleep records for demo astronaut', async () => {
    const sleep = await localDemoProvider.getSleepRecords(DEMO_ASTRONAUT_ID);
    expect(sleep.length).toBeGreaterThan(0);
    expect(sleep[0].astronautId).toBe(DEMO_ASTRONAUT_ID);
  });

  it('loads seed wellness records for demo astronaut', async () => {
    const wellness = await localDemoProvider.getWellnessRecords(DEMO_ASTRONAUT_ID);
    expect(wellness.length).toBeGreaterThan(0);
    expect(wellness[0].moodScore).toBeGreaterThanOrEqual(1);
  });

  it('saves new sleep record and retrieves it', async () => {
    const initial = await localDemoProvider.getSleepRecords(DEMO_ASTRONAUT_ID);
    const newRecord = await localDemoProvider.saveSleepRecord({
      astronautId: DEMO_ASTRONAUT_ID,
      missionId: DEMO_MISSION_ID,
      timestamp: '2024-09-12T06:00:00.000Z',
      sleepStart: '2024-09-11T22:30:00.000Z',
      sleepEnd: '2024-09-12T06:00:00.000Z',
      totalSleepDurationMinutes: 450,
      sleepEfficiencyPercent: 90,
      missionDay: 181,
      source: 'SELF_REPORT',
      dataOrigin: 'USER_ENTERED',
    });

    expect(newRecord.id).toBeDefined();
    const updated = await localDemoProvider.getSleepRecords(DEMO_ASTRONAUT_ID);
    expect(updated.length).toBe(initial.length + 1);
  });

  it('saves new wellness record and retrieves it', async () => {
    const initial = await localDemoProvider.getWellnessRecords(DEMO_ASTRONAUT_ID);
    const saved = await localDemoProvider.saveWellnessRecord({
      astronautId: DEMO_ASTRONAUT_ID,
      missionId: DEMO_MISSION_ID,
      timestamp: '2024-09-12T08:00:00.000Z',
      missionDay: 181,
      moodScore: 8,
      stressScore: 3,
      energyScore: 8,
      wellbeingScore: 8,
      source: 'SELF_REPORT',
      dataOrigin: 'USER_ENTERED',
    });

    expect(saved.id).toBeDefined();
    const updated = await localDemoProvider.getWellnessRecords(DEMO_ASTRONAUT_ID);
    expect(updated.length).toBe(initial.length + 1);
  });

  it('resets demo data cleanly back to seed', async () => {
    await localDemoProvider.saveSleepRecord({
      astronautId: DEMO_ASTRONAUT_ID,
      missionId: DEMO_MISSION_ID,
      timestamp: '2024-09-12T06:00:00.000Z',
      sleepStart: '2024-09-11T22:30:00.000Z',
      sleepEnd: '2024-09-12T06:00:00.000Z',
      totalSleepDurationMinutes: 450,
      sleepEfficiencyPercent: 90,
      missionDay: 181,
      source: 'SELF_REPORT',
      dataOrigin: 'USER_ENTERED',
    });

    await localDemoProvider.resetDemoData();
    const sleep = await localDemoProvider.getSleepRecords(DEMO_ASTRONAUT_ID);
    expect(sleep.length).toBe(90);
  });
});
