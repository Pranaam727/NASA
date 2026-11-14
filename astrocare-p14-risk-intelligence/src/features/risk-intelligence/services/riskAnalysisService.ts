import { 
  MissionProfile, 
  MissionAssessmentReport, 
  RiskRelevanceAssessment, 
  QualitativeRiskRelevance 
} from '../types/mission.types';
import { NASA_RISK_CATEGORIES } from '../data/nasaRiskCategories';
import { evaluateMissionRiskRelevance, PRESET_MISSION_PROFILES } from '../data/missionProfiles';

export class RiskAnalysisService {
  /**
   * Run a full qualitative risk evaluation across all 8 NASA HRP categories for a configured mission profile.
   */
  public static analyzeMission(mission: MissionProfile): MissionAssessmentReport {
    const assessments: RiskRelevanceAssessment[] = NASA_RISK_CATEGORIES.map(category => {
      return evaluateMissionRiskRelevance(mission, category.code);
    });

    // Derive qualitative summary
    const criticalRisks = assessments.filter(a => a.qualitativeRelevance === 'CRITICAL');
    const highRisks = assessments.filter(a => a.qualitativeRelevance === 'HIGH');
    
    let qualitativeSummary = '';
    if (criticalRisks.length > 0) {
      qualitativeSummary = `Mission profile involves ${criticalRisks.length} CRITICAL biomedical risk domains (${criticalRisks.map(r => r.riskCategoryId).join(', ')}) driven primarily by radiation environment, duration (${mission.durationDays} days), and evacuation constraints (${mission.environment.evacuationTimeDays} days). Mandatory operational countermeasures and autonomous clinical protocols required.`;
    } else if (highRisks.length > 0) {
      qualitativeSummary = `Mission profile presents ${highRisks.length} HIGH-relevance physiological domains (${highRisks.map(r => r.riskCategoryId).join(', ')}). Validated countermeasure protocols (ARED, aerobic interval conditioning, SSLA lighting) provide significant risk reduction for LEO baseline operations.`;
    } else {
      qualitativeSummary = 'Mission profile falls within standard short-duration physiological bounds with established flight operational flight rules.';
    }

    const missionOperationalConstraints: string[] = [
      `Daily exercise allocation requirement: ~2.0 hours crew time`,
      `Communication round-trip latency: ${(mission.environment.communicationLatencyMinutes * 2).toFixed(2)} minutes`,
      `Emergency medical evacuation timeline: ${mission.environment.evacuationTimeDays} days`,
      `Atmospheric carbon dioxide control limit: < 2.0 mmHg (to mitigate SANS exacerbation)`
    ];

    const deepSpaceUniqueChallenges: string[] = [];
    if (mission.environment.radiationFieldType === 'INTERPLANETARY_GCR_SPE') {
      deepSpaceUniqueChallenges.push('Unshielded Galactic Cosmic Ray (GCR) exposure with potential cumulative doses approaching or exceeding career limits.');
      deepSpaceUniqueChallenges.push('Unpredictable Solar Particle Events (SPEs) requiring dedicated hydrogenous storm shelter protocol.');
    }
    if (mission.environment.communicationLatencyMinutes > 0.5) {
      deepSpaceUniqueChallenges.push('High communication latency preventing synchronous telemedicine consultations during acute medical events.');
    }
    if (mission.environment.evacuationTimeDays > 10) {
      deepSpaceUniqueChallenges.push('No abort-to-Earth option; crew must function as an entirely autonomous healthcare and life-support unit.');
    }

    return {
      mission,
      generatedDate: new Date().toISOString(),
      qualitativeSummary,
      assessments,
      missionOperationalConstraints,
      deepSpaceUniqueChallenges,
      disclaimerNotice: 'SCIENTIFIC INTEGRITY NOTICE: This assessment provides a qualitative, research-grounded synthesis derived from NASA Human Research Program publications and historical spaceflight data. In accordance with NASA scientific standards, this tool does NOT calculate speculative numerical illness probabilities. All assessments represent research-based qualitative relevance grounded in peer-reviewed aerospace evidence.'
    };
  }

  /**
   * Retrieve preset mission profiles.
   */
  public static getPresetMissions(): MissionProfile[] {
    return [...PRESET_MISSION_PROFILES];
  }

  /**
   * Compare two mission configurations side-by-side.
   */
  public static compareMissions(missionA: MissionProfile, missionB: MissionProfile): {
    missionA: MissionAssessmentReport;
    missionB: MissionAssessmentReport;
    deltaRiskSummary: {
      riskCategoryId: string;
      riskTitle: string;
      relevanceA: QualitativeRiskRelevance;
      relevanceB: QualitativeRiskRelevance;
      severityDelta: 'HIGHER_IN_B' | 'HIGHER_IN_A' | 'IDENTICAL';
      comparativeDrivers: string;
    }[];
  } {
    const reportA = this.analyzeMission(missionA);
    const reportB = this.analyzeMission(missionB);

    const severityRanks: Record<QualitativeRiskRelevance, number> = {
      'LOW': 1,
      'MONITORED_CONTROLLED': 2,
      'MODERATE': 3,
      'HIGH': 4,
      'CRITICAL': 5
    };

    const deltaRiskSummary = NASA_RISK_CATEGORIES.map(category => {
      const assessA = reportA.assessments.find(a => a.riskCategoryId === category.code);
      const assessB = reportB.assessments.find(a => a.riskCategoryId === category.code);
      const relA = assessA?.qualitativeRelevance || 'MODERATE';
      const relB = assessB?.qualitativeRelevance || 'MODERATE';

      const rankA = severityRanks[relA];
      const rankB = severityRanks[relB];

      let severityDelta: 'HIGHER_IN_B' | 'HIGHER_IN_A' | 'IDENTICAL' = 'IDENTICAL';
      if (rankB > rankA) severityDelta = 'HIGHER_IN_B';
      else if (rankA > rankB) severityDelta = 'HIGHER_IN_A';

      const comparativeDrivers = `${missionB.missionName} has ${missionB.durationDays}d duration vs ${missionA.durationDays}d, in ${missionB.environment.radiationFieldType} vs ${missionA.environment.radiationFieldType}.`;

      return {
        riskCategoryId: category.code,
        riskTitle: category.title,
        relevanceA: relA,
        relevanceB: relB,
        severityDelta,
        comparativeDrivers
      };
    });

    return {
      missionA: reportA,
      missionB: reportB,
      deltaRiskSummary
    };
  }
}
