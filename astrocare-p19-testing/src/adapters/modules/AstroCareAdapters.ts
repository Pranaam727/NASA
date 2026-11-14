/**
 * AstroCare Configurable Module Adapters & Integration Contracts
 * Section 4: Module Validation Framework
 * Provides stable service contracts, decoupled test adapters, and registration hooks
 * for Biomedical, AI Intelligence, Aerospace, and NASA Research modules.
 */

import { TelemetryRecord } from '../../types/biomedical';
import { HealthContextInput, AIResponsePayload } from '../../types/ai';
import { RadiationExposureRecord, RadiationSummaryResult } from '../../types/calculations';
import { NasaOsdrStudyMetadata, NasaNtrsCitation } from '../../types/nasa';

// 1. Biomedical Service Interface
export interface IBiomedicalService {
  ingestTelemetry(record: TelemetryRecord): Promise<{ accepted: boolean; recordId: string }>;
  getAstronautLatestVitals(astronautId: string): Promise<Record<string, TelemetryRecord>>;
  detectAnomalies(astronautId: string, metricType: string): Promise<Array<{ timestamp: string; score: number; flag: string }>>;
  assessHealthRisk(astronautId: string): Promise<{ riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL'; factors: string[] }>;
}

// 2. AI Intelligence Service Interface
export interface IAiIntelligenceService {
  constructHealthContext(astronautId: string): Promise<HealthContextInput>;
  generateClinicalReasoning(context: HealthContextInput): Promise<AIResponsePayload>;
  generateDeterministicFallback(context: HealthContextInput, reason: string): Promise<AIResponsePayload>;
}

// 3. Aerospace & Radiation Service Interface
export interface IAerospaceService {
  recordRadiationExposure(exposure: RadiationExposureRecord): Promise<void>;
  getCumulativeMissionExposure(missionId: string): Promise<RadiationSummaryResult>;
  assessSolarParticleEventRisk(): Promise<{ speRiskLevel: string; solarProtonFlux: number }>;
}

// 4. Research Service Interface
export interface IResearchService {
  searchNasaOsdr(query: string): Promise<NasaOsdrStudyMetadata[]>;
  searchNasaNtrs(query: string): Promise<NasaNtrsCitation[]>;
  validateCitation(identifier: string): Promise<{ valid: boolean; citation?: NasaNtrsCitation | NasaOsdrStudyMetadata }>;
}

/**
 * AstroCare Module Service Registry
 * Allows the master AstroCare application to plug in its actual service implementations,
 * or defaults to robust deterministic mock adapters.
 */
export class AstroCareModuleRegistry {
  private biomedicalService?: IBiomedicalService;
  private aiService?: IAiIntelligenceService;
  private aerospaceService?: IAerospaceService;
  private researchService?: IResearchService;

  // Setters for live application injection
  public registerBiomedicalService(service: IBiomedicalService): void {
    this.biomedicalService = service;
  }

  public registerAiService(service: IAiIntelligenceService): void {
    this.aiService = service;
  }

  public registerAerospaceService(service: IAerospaceService): void {
    this.aerospaceService = service;
  }

  public registerResearchService(service: IResearchService): void {
    this.researchService = service;
  }

  // Getters with default deterministic mock fallback
  public getBiomedicalService(): IBiomedicalService {
    if (this.biomedicalService) return this.biomedicalService;
    return new DefaultMockBiomedicalService();
  }

  public getAiService(): IAiIntelligenceService {
    if (this.aiService) return this.aiService;
    return new DefaultMockAiService();
  }

  public getAerospaceService(): IAerospaceService {
    if (this.aerospaceService) return this.aerospaceService;
    return new DefaultMockAerospaceService();
  }

  public getResearchService(): IResearchService {
    if (this.researchService) return this.researchService;
    return new DefaultMockResearchService();
  }
}

// Default Mock Implementations ensuring zero crashes when running standalone

class DefaultMockBiomedicalService implements IBiomedicalService {
  private store: Map<string, TelemetryRecord> = new Map();

  async ingestTelemetry(record: TelemetryRecord): Promise<{ accepted: boolean; recordId: string }> {
    this.store.set(record.recordId, record);
    return { accepted: true, recordId: record.recordId };
  }

  async getAstronautLatestVitals(astronautId: string): Promise<Record<string, TelemetryRecord>> {
    const result: Record<string, TelemetryRecord> = {};
    for (const rec of this.store.values()) {
      if (rec.astronautId === astronautId) {
        result[rec.metricType] = rec;
      }
    }
    return result;
  }

  async detectAnomalies(_astronautId: string, _metricType: string): Promise<Array<{ timestamp: string; score: number; flag: string }>> {
    return [
      { timestamp: new Date().toISOString(), score: 0.85, flag: 'ELEVATED_HEART_RATE_ALERT' },
    ];
  }

  async assessHealthRisk(_astronautId: string): Promise<{ riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'CRITICAL'; factors: string[] }> {
    return {
      riskLevel: 'LOW',
      factors: ['Nominal cardiovascular baseline', 'Acceptable sleep efficiency (7.5h)'],
    };
  }
}

class DefaultMockAiService implements IAiIntelligenceService {
  async constructHealthContext(astronautId: string): Promise<HealthContextInput> {
    return {
      astronautId,
      missionPhase: 'ISS-EXPEDITION-71',
      telemetrySummary: {
        heart_rate: { value: 68, unit: 'bpm', status: 'NOMINAL' },
        oxygen_saturation: { value: 98, unit: '%', status: 'NOMINAL' },
      },
      activeDeterministicAlerts: [],
    };
  }

  async generateClinicalReasoning(context: HealthContextInput): Promise<AIResponsePayload> {
    return {
      sourceModel: 'GEMINI_PRO',
      generatedAt: new Date().toISOString(),
      clinicalReasoningSummary: `Physiological parameters for ${context.astronautId} are within nominal bounds.`,
      highlightedObservations: ['Heart rate 68 bpm (NOMINAL)', 'SpO2 98% (NOMINAL)'],
      suggestedOperationalActions: ['Maintain routine exercise countermeasures.'],
      citations: [
        {
          sourceType: 'NASA_OSDR',
          identifier: 'OSD-379',
          title: 'Immune and cardiovascular adaptation in spaceflight',
          relevantExcerpt: 'Vascular tone exhibits stable adaptation.',
          confidenceScore: 0.95,
        },
      ],
      riskSeverityAssessment: 'LOW',
      provenance: {
        inputContextHash: `CTX-${context.astronautId}`,
        deterministicFallbackInvoked: false,
      },
      safetyDisclaimers: ['Operational decision support only. Consult flight surgeon for clinical orders.'],
    };
  }

  async generateDeterministicFallback(context: HealthContextInput, reason: string): Promise<AIResponsePayload> {
    return {
      sourceModel: 'DETERMINISTIC_FALLBACK',
      generatedAt: new Date().toISOString(),
      clinicalReasoningSummary: `[DETERMINISTIC FALLBACK: ${reason}] Telemetry for ${context.astronautId} processed via rule tree.`,
      highlightedObservations: ['Observation: Telemetry processed offline.'],
      suggestedOperationalActions: ['Review telemetry via Flight Surgeon console.'],
      citations: [],
      riskSeverityAssessment: 'LOW',
      provenance: {
        inputContextHash: `CTX-${context.astronautId}`,
        deterministicFallbackInvoked: true,
        fallbackReason: reason,
      },
      safetyDisclaimers: ['Deterministic rule fallback.'],
    };
  }
}

class DefaultMockAerospaceService implements IAerospaceService {
  private exposures: RadiationExposureRecord[] = [];

  async recordRadiationExposure(exposure: RadiationExposureRecord): Promise<void> {
    this.exposures.push(exposure);
  }

  async getCumulativeMissionExposure(_missionId: string): Promise<RadiationSummaryResult> {
    return {
      totalAbsorbedDoseGy: 0.042, // 42 mGy
      totalEquivalentDoseSv: 0.088, // 88 mSv
      dominantRadiationSource: 'proton',
      doseRateGyPerHour: 0.00005,
      doseRateSvPerHour: 0.0001,
      validIntervalSeconds: 86400 * 30,
      missingDataIntervalCount: 0,
    };
  }

  async assessSolarParticleEventRisk(): Promise<{ speRiskLevel: string; solarProtonFlux: number }> {
    return { speRiskLevel: 'NOMINAL_BACKGROUND', solarProtonFlux: 0.35 };
  }
}

class DefaultMockResearchService implements IResearchService {
  async searchNasaOsdr(_query: string): Promise<NasaOsdrStudyMetadata[]> {
    return [
      {
        accession: 'OSD-379',
        title: 'Microgravity Immune Profile Adaptation',
        description: 'Genomic transcriptomics of crew blood samples.',
        organism: 'Homo sapiens',
        assaysCount: 3,
        samplesCount: 36,
        releaseDate: '2023-01-01',
        dataFiles: [{ fileName: 'counts.tsv', fileSize: 1024, fileFormat: 'TSV', remoteUrl: 'https://osdr.nasa.gov/' }],
      },
    ];
  }

  async searchNasaNtrs(_query: string): Promise<NasaNtrsCitation[]> {
    return [
      {
        id: '20210018596',
        title: 'Risk of Adverse Health Effects Due to Host-Microorganism Interactions',
        authors: [{ name: 'Crucian, B.' }],
        publicationDate: '2021-05-01',
        abstract: 'Immune alterations in spaceflight.',
        subjectCategories: ['Aerospace Medicine'],
        documentType: 'Technical Report',
        pdfAvailable: true,
        landingPageUrl: 'https://ntrs.nasa.gov/citations/20210018596',
      },
    ];
  }

  async validateCitation(identifier: string): Promise<{ valid: boolean; citation?: NasaNtrsCitation | NasaOsdrStudyMetadata }> {
    if (identifier.startsWith('OSD-')) {
      const studies = await this.searchNasaOsdr(identifier);
      return { valid: studies.length > 0, citation: studies[0] };
    }
    const citations = await this.searchNasaNtrs(identifier);
    return { valid: citations.length > 0, citation: citations[0] };
  }
}
