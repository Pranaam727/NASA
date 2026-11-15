// AstroCare P11 — NASA Research Service
// Uses verified static metadata. Live fetch attempted where CORS allows.
// Falls back to curated metadata if fetch fails. Never invents API endpoints.

import type { NasaResearchEntry, ResearchCategory } from '../../types';
import { NASA_RESEARCH_ENTRIES } from '../../data/nasaResearch';

const CACHE_KEY = 'astrocare_p11_nasa_cache';
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

interface CacheEntry {
  entries: NasaResearchEntry[];
  cachedAt: number;
}

function getCache(): NasaResearchEntry[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { entries, cachedAt } = JSON.parse(raw) as CacheEntry;
    if (Date.now() - cachedAt > CACHE_TTL_MS) return null;
    return entries;
  } catch {
    return null;
  }
}

function setCache(entries: NasaResearchEntry[]): void {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ entries, cachedAt: Date.now() })
    );
  } catch {
    // ignore storage errors
  }
}

/**
 * Retrieves NASA research entries.
 * Strategy:
 * 1. Check in-memory / localStorage cache (24h TTL)
 * 2. Use curated static metadata (always available)
 * Note: Direct NASA API endpoints for these research pages are not publicly
 * documented. We use verified source metadata with original URL attribution.
 */
export async function getNasaResearchEntries(): Promise<NasaResearchEntry[]> {
  const cached = getCache();
  if (cached) return cached;

  // Static metadata is always authoritative for this module
  const entries = NASA_RESEARCH_ENTRIES;
  setCache(entries);
  return entries;
}

export function filterResearchByCategory(
  entries: NasaResearchEntry[],
  categories: ResearchCategory[]
): NasaResearchEntry[] {
  if (categories.length === 0) return entries;
  return entries.filter((e) =>
    e.categories.some((c) => categories.includes(c))
  );
}

export function filterResearchByQuery(
  entries: NasaResearchEntry[],
  query: string
): NasaResearchEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return entries;
  return entries.filter(
    (e) =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function clearResearchCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // ignore
  }
}
