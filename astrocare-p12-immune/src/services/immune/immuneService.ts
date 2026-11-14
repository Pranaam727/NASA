import {
  ImmuneCellRecord,
  BiomarkerRecord,
  LongitudinalMetricSummary,
  LongitudinalTimelinePoint,
  MissionPhase,
} from '../../types';
import { DEMO_IMMUNE_CELLS, DEMO_BIOMARKERS } from '../../data/mockImmuneData';
import { calculateAbsoluteChange, calculatePercentChange, determineMonitoringState } from '../../utils/calculations';
import { IMMUNE_REFERENCES } from '../../constants/immuneConstants';

class ImmuneService {
  private immuneCells: ImmuneCellRecord[] = [];
  private biomarkers: BiomarkerRecord[] = [];

  constructor() {
    this.immuneCells = [...DEMO_IMMUNE_CELLS];
    this.biomarkers = [...DEMO_BIOMARKERS];
  }

  public getImmuneCellRecords(filters?: {
    astronautId?: string;
    category?: 'LEUKOCYTE' | 'LYMPHOCYTE_SUBSET' | 'FUNCTIONAL_ASSAY' | 'ALL';
    phase?: MissionPhase | 'ALL';
    cellType?: string;
  }): ImmuneCellRecord[] {
    let list = [...this.immuneCells];

    if (filters?.astronautId) {
      list = list.filter((r) => r.astronautId === filters.astronautId);
    }
    if (filters?.category && filters.category !== 'ALL') {
      list = list.filter((r) => r.category === filters.category);
    }
    if (filters?.phase && filters.phase !== 'ALL') {
      list = list.filter((r) => r.missionPhase === filters.phase);
    }
    if (filters?.cellType && filters.cellType !== 'ALL') {
      list = list.filter((r) => r.cellType === filters.cellType);
    }

    return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  public getBiomarkerRecords(filters?: {
    astronautId?: string;
    category?: 'CYTOKINE' | 'INFLAMMATORY' | 'STRESS_HORMONAL' | 'ALL';
    phase?: MissionPhase | 'ALL';
    biomarker?: string;
  }): BiomarkerRecord[] {
    let list = [...this.biomarkers];

    if (filters?.astronautId) {
      list = list.filter((b) => b.astronautId === filters.astronautId);
    }
    if (filters?.category && filters.category !== 'ALL') {
      list = list.filter((b) => b.category === filters.category);
    }
    if (filters?.phase && filters.phase !== 'ALL') {
      list = list.filter((b) => b.missionPhase === filters.phase);
    }
    if (filters?.biomarker && filters.biomarker !== 'ALL') {
      list = list.filter((b) => b.biomarker === filters.biomarker);
    }

    return list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }

  /**
   * Get latest recorded values for each key metric for an astronaut.
   */
  public getLatestImmuneProfile(astronautId: string): {
    cells: Record<string, ImmuneCellRecord>;
    biomarkers: Record<string, BiomarkerRecord>;
  } {
    const userCells = this.immuneCells.filter((c) => c.astronautId === astronautId);
    const userBiomarkers = this.biomarkers.filter((b) => b.astronautId === astronautId);

    const latestCells: Record<string, ImmuneCellRecord> = {};
    for (const cell of userCells) {
      if (
        !latestCells[cell.cellType] ||
        new Date(cell.timestamp) > new Date(latestCells[cell.cellType].timestamp)
      ) {
        latestCells[cell.cellType] = cell;
      }
    }

    const latestBiomarkers: Record<string, BiomarkerRecord> = {};
    for (const bio of userBiomarkers) {
      if (
        !latestBiomarkers[bio.biomarker] ||
        new Date(bio.timestamp) > new Date(latestBiomarkers[bio.biomarker].timestamp)
      ) {
        latestBiomarkers[bio.biomarker] = bio;
      }
    }

    return { cells: latestCells, biomarkers: latestBiomarkers };
  }

  /**
   * Calculates longitudinal statistics for a given metric key.
   */
  public calculateLongitudinalMetric(astronautId: string, metricKey: string): LongitudinalMetricSummary | null {
    const ref = IMMUNE_REFERENCES[metricKey];
    if (!ref) return null;

    // Is it in cells or biomarkers?
    const isCell = ref.category === 'LEUKOCYTE' || ref.category === 'LYMPHOCYTE_SUBSET' || ref.category === 'FUNCTIONAL';
    const series = isCell
      ? this.immuneCells
          .filter((c) => c.astronautId === astronautId && c.cellType === metricKey)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .map((c) => ({
            timestamp: c.timestamp,
            phase: c.missionPhase,
            value: c.absoluteCount,
          }))
      : this.biomarkers
          .filter((b) => b.astronautId === astronautId && b.biomarker === metricKey)
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .map((b) => ({
            timestamp: b.timestamp,
            phase: b.missionPhase,
            value: b.value,
          }));

    if (series.length === 0) {
      return {
        metricKey,
        metricName: ref.name,
        category: ref.category,
        unit: ref.unit,
        preFlightBaseline: null,
        latestValue: null,
        absoluteChange: null,
        percentChange: null,
        isCalculable: false,
        totalMeasurements: 0,
        expectedMeasurements: 6,
        missingDataPercent: 100,
        phaseAverages: { preFlight: null, inFlight: null, postFlight: null, recovery: null },
        trendPattern: 'VARIABLE',
        monitoringState: 'INSUFFICIENT_DATA',
        referenceLow: ref.low,
        referenceHigh: ref.high,
        notes: 'No records recorded for this astronaut.',
      };
    }

    // Baseline: average of PRE_FLIGHT readings or the earliest pre-flight reading
    const preFlightReadings = series.filter((s) => s.phase === 'PRE_FLIGHT');
    const inFlightReadings = series.filter((s) => s.phase === 'IN_FLIGHT');
    const postFlightReadings = series.filter((s) => s.phase === 'POST_FLIGHT');
    const recoveryReadings = series.filter((s) => s.phase === 'RECOVERY');

    const avg = (items: { value: number }[]) =>
      items.length > 0 ? Number((items.reduce((acc, i) => acc + i.value, 0) / items.length).toFixed(2)) : null;

    const preBaseline = avg(preFlightReadings);
    const inAvg = avg(inFlightReadings);
    const postAvg = avg(postFlightReadings);
    const recAvg = avg(recoveryReadings);

    const latest = series[series.length - 1].value;
    const absChange = calculateAbsoluteChange(latest, preBaseline);
    const pctChange = calculatePercentChange(latest, preBaseline);

    // Trend classification
    let trend: LongitudinalMetricSummary['trendPattern'] = 'STABLE';
    if (inAvg !== null && preBaseline !== null) {
      if (inAvg > preBaseline * 1.3) trend = 'ELEVATED_IN_FLIGHT';
      else if (inAvg < preBaseline * 0.7) trend = 'DEPRESSED_IN_FLIGHT';
      else trend = 'STABLE';
    }

    // Expected scheduled checkpoints: 6
    const expected = 6;
    const total = series.length;
    const missingPct = Math.max(0, Math.round(((expected - total) / expected) * 100));

    const state = determineMonitoringState(latest, ref.low, ref.high, preBaseline);

    return {
      metricKey,
      metricName: ref.name,
      category: ref.category,
      unit: ref.unit,
      preFlightBaseline: preBaseline,
      latestValue: latest,
      absoluteChange: absChange,
      percentChange: pctChange,
      isCalculable: preBaseline !== null && preBaseline > 0,
      totalMeasurements: total,
      expectedMeasurements: expected,
      missingDataPercent: missingPct,
      phaseAverages: {
        preFlight: preBaseline,
        inFlight: inAvg,
        postFlight: postAvg,
        recovery: recAvg,
      },
      trendPattern: trend,
      monitoringState: state,
      referenceLow: ref.low,
      referenceHigh: ref.high,
      notes: ref.clinicalNote,
    };
  }

  /**
   * Retrieves summary for all key tracked metrics for longitudinal comparison table.
   */
  public getAllLongitudinalMetrics(astronautId: string): LongitudinalMetricSummary[] {
    const keys = Object.keys(IMMUNE_REFERENCES);
    const results: LongitudinalMetricSummary[] = [];

    for (const k of keys) {
      const summary = this.calculateLongitudinalMetric(astronautId, k);
      if (summary) results.push(summary);
    }

    return results;
  }

  /**
   * Formats consolidated timeline points for multi-metric charting across mission days.
   */
  public getLongitudinalTimeline(astronautId: string): LongitudinalTimelinePoint[] {
    const pointsMap = new Map<number, LongitudinalTimelinePoint>();

    const userCells = this.immuneCells.filter((c) => c.astronautId === astronautId);
    for (const c of userCells) {
      if (!pointsMap.has(c.missionDay)) {
        pointsMap.set(c.missionDay, {
          date: c.timestamp.split('T')[0],
          missionDay: c.missionDay,
          missionPhase: c.missionPhase,
          sampleId: c.sampleId,
          values: {},
        });
      }
      pointsMap.get(c.missionDay)!.values[c.cellType] = c.absoluteCount;
    }

    const userBiomarkers = this.biomarkers.filter((b) => b.astronautId === astronautId);
    for (const b of userBiomarkers) {
      if (!pointsMap.has(b.missionDay)) {
        pointsMap.set(b.missionDay, {
          date: b.timestamp.split('T')[0],
          missionDay: b.missionDay,
          missionPhase: b.missionPhase,
          sampleId: b.sampleId,
          values: {},
        });
      }
      pointsMap.get(b.missionDay)!.values[b.biomarker] = b.value;
    }

    return Array.from(pointsMap.values()).sort((a, b) => a.missionDay - b.missionDay);
  }
}

export const immuneService = new ImmuneService();
