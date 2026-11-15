// AstroCare P11 — Unit Tests: NASA Research Service

import { describe, it, expect } from 'vitest';
import {
  getNasaResearchEntries,
  filterResearchByCategory,
  filterResearchByQuery,
} from '../services/nasa/nasaResearchService';

describe('NASA Research Service', () => {
  it('retrieves verified official NASA research entries', async () => {
    const entries = await getNasaResearchEntries();
    expect(entries.length).toBeGreaterThanOrEqual(7);

    // Verify critical required sources are present
    const titles = entries.map((e) => e.title.toLowerCase());
    expect(titles.some((t) => t.includes('sleep') || t.includes('circadian'))).toBe(true);
    expect(titles.some((t) => t.includes('isolation') || t.includes('confinement'))).toBe(true);
  });

  it('filters entries by category correctly', async () => {
    const entries = await getNasaResearchEntries();
    const sleepEntries = filterResearchByCategory(entries, ['SLEEP']);

    expect(sleepEntries.length).toBeGreaterThan(0);
    sleepEntries.forEach((entry) => {
      expect(entry.categories).toContain('SLEEP');
    });
  });

  it('filters entries by keyword query', async () => {
    const entries = await getNasaResearchEntries();
    const osdrEntries = filterResearchByQuery(entries, 'OSDR');

    expect(osdrEntries.length).toBeGreaterThan(0);
    expect(osdrEntries[0].title.toLowerCase()).toContain('open science data repository');
  });

  it('preserves valid official NASA URLs', async () => {
    const entries = await getNasaResearchEntries();
    entries.forEach((e) => {
      expect(e.sourceUrl).toMatch(/^https:\/\/(www\.)?([a-z0-9-]+\.)?nasa\.gov/);
      expect(e.retrievedAt).toBeDefined();
      expect(e.keyFindings.length).toBeGreaterThan(0);
    });
  });
});
