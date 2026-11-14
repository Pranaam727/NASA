import {
  RadiationRiskTier,
  SolarParticleEventClass,
  RadiationEnvironmentType,
  ShieldingMaterialType,
  ShieldingScenarioConfig,
  ShieldingScenarioResult,
  BiologicalRiskEvaluation,
} from '../types/radiationTypes';

// NASA Permissible Exposure Limits (PEL) - STD-3001
export const NASA_RADIATION_LIMITS = {
  CAREER_EFFECTIVE_DOSE_MSV: 600, // NASA universal career limit (3% REID standard)
  THIRTY_DAY_LIMIT_MSV: 250,
  ONE_YEAR_LIMIT_MSV: 500,
  NOMINAL_GCR_LEO_USV_H: 0.052,
  NOMINAL_GCR_DEEP_SPACE_USV_H: 0.22,
};

// Material Mass Attenuation Coefficients (approximate cm²/g for space radiation spectrum)
const ATTENUATION_COEFFICIENTS: Record<ShieldingMaterialType, number> = {
  POLYETHYLENE: 0.082, // Superior hydrogen content for neutron & proton slowing
  WATER: 0.076,
  CARBON_COMPOSITE: 0.058,
  ALUMINUM: 0.045, // Standard aerospace structure baseline
  REGOLITH: 0.038, // In-situ lunar/Martian soil
};

const ENVIRONMENT_BACKGROUND_FLUX: Record<RadiationEnvironmentType, number> = {
  LEO: 0.052,
  LUNAR_SURFACE: 0.14,
  CISLUNAR: 0.22,
  MARS_TRANSIT: 0.24,
  MARS_SURFACE: 0.11,
};

export class RadiationAnalyticsEngine {
  /**
   * Evaluates deep biological risk metrics from accumulated dose & current flux.
   */
  public static evaluateBiologicalRisk(
    accumulatedDoseMsv: number,
    careerPriorDoseMsv: number = 42.0,
    currentFluxUsVh: number = 0.052
  ): BiologicalRiskEvaluation {
    const totalCareerDose = careerPriorDoseMsv + accumulatedDoseMsv;
    const careerDosePercent = parseFloat(
      ((totalCareerDose / NASA_RADIATION_LIMITS.CAREER_EFFECTIVE_DOSE_MSV) * 100).toFixed(1)
    );

    // Excess Lifetime Risk of Radiation-Induced Cancer Death (REID) ~ 3.5% per Sievert (1000 mSv)
    const excessLifetimeCancerRiskPercent = parseFloat(
      ((totalCareerDose / 1000) * 3.5).toFixed(2)
    );

    // DNA Double-Strand Breaks (DSBs) proxy: ~35 DSBs per Gy per human cell nucleus
    // 1 mSv space radiation proxy ~ 0.035 DSBs/cell
    const dnaDoubleStrandBreaksPerCell = parseFloat(
      (totalCareerDose * 0.038).toFixed(1)
    );

    // Acute Radiation Sickness (ARS) assessment (prodromal syndrome begins ~ 500-1000 mGy in acute window)
    let acuteRadiationSicknessRisk: BiologicalRiskEvaluation['acuteRadiationSicknessRisk'] = 'NEGLIGIBLE';
    if (accumulatedDoseMsv > 750) {
      acuteRadiationSicknessRisk = 'SEVERE';
    } else if (accumulatedDoseMsv > 350) {
      acuteRadiationSicknessRisk = 'MODERATE';
    } else if (accumulatedDoseMsv > 100) {
      acuteRadiationSicknessRisk = 'MILD_PRODROMAL';
    }

    // Tissue degradation score (lens, cardiac microvasculature, neurogenesis)
    const tissueDegradationScore = Math.min(
      100,
      Math.round((totalCareerDose / NASA_RADIATION_LIMITS.CAREER_EFFECTIVE_DOSE_MSV) * 100 * 0.85 + (currentFluxUsVh > 0.5 ? 20 : 0))
    );

    let biologicalRiskTier: RadiationRiskTier = 'NOMINAL';
    let recommendedAction = 'Nominal radiation environment. Continue routine personal dosimeter monitoring.';

    if (currentFluxUsVh > 10.0 || acuteRadiationSicknessRisk === 'SEVERE') {
      biologicalRiskTier = 'CRITICAL';
      recommendedAction = 'CRITICAL DOSIMETRY FLUX: Immediate evacuation to internal storm shelter module. Ingest radioprotectant countermeasures.';
    } else if (currentFluxUsVh > 1.0 || totalCareerDose > 450) {
      biologicalRiskTier = 'HAZARDOUS';
      recommendedAction = 'HAZARDOUS EXPOSURE: Restrict extravehicular activity (EVA). Prepare storm shelter water-wall ballast configuration.';
    } else if (currentFluxUsVh > 0.25 || careerDosePercent > 50) {
      biologicalRiskTier = 'ELEVATED';
      recommendedAction = 'ELEVATED GCR/SPE FLUX: Monitor solar observatory X-ray and proton feeds. Check personal dosimeters every 6 hours.';
    }

    return {
      careerLimitMsv: NASA_RADIATION_LIMITS.CAREER_EFFECTIVE_DOSE_MSV,
      careerDosePercent,
      acuteRadiationSicknessRisk,
      excessLifetimeCancerRiskPercent,
      dnaDoubleStrandBreaksPerCell,
      tissueDegradationScore,
      biologicalRiskTier,
      recommendedAction,
    };
  }

  /**
   * Computes exponential beam and heavy-ion attenuation through shielding materials.
   * I(x) = I_0 * exp(-mu * x)
   */
  public static calculateShieldingScenario(config: ShieldingScenarioConfig): ShieldingScenarioResult {
    const baseFlux = ENVIRONMENT_BACKGROUND_FLUX[config.environment];
    // Add additional shelter thickness if active
    const totalThickness = config.stormShelterActive ? config.thicknessGcm2 + 15 : config.thicknessGcm2;
    const mu = ATTENUATION_COEFFICIENTS[config.material];

    // Attenuation calculation
    const attenuationFactor = Math.exp(-mu * totalThickness);
    const attenuatedFlux = parseFloat((baseFlux * attenuationFactor).toFixed(4));
    const doseReductionPercentage = parseFloat(((1 - attenuationFactor) * 100).toFixed(1));

    // Daily projected dose (mSv/day) = attenuatedFlux (uSv/h) * 24 / 1000
    const dailyProjectedDoseMsv = parseFloat(((attenuatedFlux * 24) / 1000).toFixed(4));
    const timeToThirtyDayLimitDays = dailyProjectedDoseMsv > 0
      ? Math.round(NASA_RADIATION_LIMITS.THIRTY_DAY_LIMIT_MSV / dailyProjectedDoseMsv)
      : 9999;

    let mitigationEfficacy: ShieldingScenarioResult['mitigationEfficacy'] = 'ACCEPTABLE';
    if (doseReductionPercentage >= 65) {
      mitigationEfficacy = 'EXCELLENT';
    } else if (doseReductionPercentage < 35) {
      mitigationEfficacy = 'SUBOPTIMAL';
    }

    const engineeringNotes = `${config.material} at ${totalThickness} g/cm² areal density provides ${doseReductionPercentage}% flux attenuation in ${config.environment.replace(/_/g, ' ')}. ${config.material === 'POLYETHYLENE' || config.material === 'WATER' ? 'High hydrogen content minimizes hazardous secondary neutron spallation.' : 'Metallic atomic nuclei may produce secondary bremsstrahlung upon heavy ion impact.'}`;

    return {
      unshieldedFluxUsVh: baseFlux,
      attenuatedFluxUsVh: attenuatedFlux,
      doseReductionPercentage,
      dailyProjectedDoseMsv,
      timeToThirtyDayLimitDays,
      mitigationEfficacy,
      engineeringNotes,
    };
  }

  /**
   * Classifies NOAA Solar Radiation Storm Scale (S1 to S5).
   */
  public static classifySPEEvent(fluxUsVh: number): SolarParticleEventClass {
    if (fluxUsVh >= 100.0) return 'S5_EXTREME';
    if (fluxUsVh >= 25.0) return 'S4_SEVERE';
    if (fluxUsVh >= 5.0) return 'S3_STRONG';
    if (fluxUsVh >= 1.0) return 'S2_MODERATE';
    if (fluxUsVh >= 0.25) return 'S1_MINOR';
    return 'NONE';
  }
}
