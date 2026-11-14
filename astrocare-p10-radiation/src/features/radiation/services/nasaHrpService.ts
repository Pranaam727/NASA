import { HrpEvidenceReference } from '../types/radiationTypes';
import { NASA_HRP_EVIDENCE_RECORDS } from '../data/osdrFixtures';

class NasaHrpService {
  /**
   * Retrieves all verified NASA Human Research Program radiation evidence records
   */
  public getEvidenceRecords(): HrpEvidenceReference[] {
    return [...NASA_HRP_EVIDENCE_RECORDS];
  }

  /**
   * Finds specific evidence topic by risk category keyword
   */
  public getEvidenceByCategory(category: string): HrpEvidenceReference[] {
    const q = category.toLowerCase();
    return NASA_HRP_EVIDENCE_RECORDS.filter(
      (ev) =>
        ev.riskCategory.toLowerCase().includes(q) ||
        ev.title.toLowerCase().includes(q) ||
        ev.summary.toLowerCase().includes(q)
    );
  }
}

export const nasaHrpService = new NasaHrpService();
