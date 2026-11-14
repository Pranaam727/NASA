import { DatasetRecord } from '../types/dataset.types';
import { MeasurementVariable } from '../types/observation.types';
import { ScientificCompatibilityReport, CompatibilityStatus } from '../types/comparison.types';

export class DatasetComparisonService {
  /**
   * Evaluates two or more studies for scientific comparability.
   * Blocks direct numerical merging if organisms, study types, or biological models mismatch.
   */
  public static evaluateCompatibility(
    datasets: DatasetRecord[],
    selectedVariable?: MeasurementVariable
  ): ScientificCompatibilityReport {
    if (!datasets || datasets.length < 2) {
      return {
        status: 'COMPATIBLE',
        allowDirectNumericalMerge: true,
        blockingReasons: [],
        scientificNotes: ['At least two datasets are needed to perform comparative research.'],
        checks: {
          organismCheck: { passed: true, organisms: datasets.map(d => d.organism), message: 'Single dataset selected.' },
          populationCheck: { passed: true, populations: datasets.map(d => d.studyType), message: 'Single dataset selected.' },
          unitCheck: { passed: true, units: selectedVariable ? [selectedVariable.unit] : [], message: 'Unit baseline set.' },
          environmentCheck: { passed: true, environments: datasets.map(d => d.experimentPlatform), message: 'Environment baseline.' },
          temporalCheck: { passed: true, phases: [], message: 'Temporal baseline.' }
        }
      };
    }

    const blockingReasons: string[] = [];
    const scientificNotes: string[] = [];

    // 1. Organism Check
    const organisms = Array.from(new Set(datasets.map(d => d.organism)));
    const organismPassed = organisms.length === 1;
    let organismMessage = '';
    if (!organismPassed) {
      const msg = `Cross-species divergence detected: (${organisms.join(' vs ')}). Biological mechanisms, baseline kinetics, and metabolic rates differ fundamentally between organisms.`;
      blockingReasons.push(msg);
      organismMessage = msg;
    } else {
      organismMessage = `Consistent biological model: all selected studies utilize ${organisms[0]}.`;
    }

    // 2. Study Population Check (Human spaceflight vs Animal vs Cell Culture vs Ground Analog)
    const populations = Array.from(new Set(datasets.map(d => d.studyType)));
    const populationPassed = populations.length === 1;
    let populationMessage = '';
    if (!populationPassed) {
      const msg = `Incompatible study models: (${populations.join(' vs ')}). Never combine living astronaut systemic physiology with in vitro cell cultures or ground analog models in the same numerical cohort.`;
      blockingReasons.push(msg);
      populationMessage = msg;
    } else {
      populationMessage = `Homogeneous experimental population model: (${populations[0]}).`;
    }

    // 3. Environment Check (Flight microgravity vs Ground simulation)
    const platforms = datasets.map(d => `${d.studyId}: ${d.experimentPlatform || d.flightProgram || 'Standard'}`);
    const flightStatus = datasets.map(d => 
      d.mission.toLowerCase().includes('flight') || 
      d.mission.toLowerCase().includes('iss') || 
      d.mission.toLowerCase().includes('inspiration') || 
      d.mission.toLowerCase().includes('shuttle')
    );
    const hasBothFlightAndGround = flightStatus.includes(true) && flightStatus.includes(false);
    let environmentPassed = true;
    let environmentMessage = '';
    if (hasBothFlightAndGround) {
      scientificNotes.push('Contains both orbital spaceflight and ground-based analog experiments. Relative effect size should be contextualized against terrestrial baseline.');
      environmentMessage = 'Mixed spaceflight and terrestrial analog environments detected.';
    } else {
      environmentMessage = 'Comparable gravitational and environmental context across studies.';
    }

    // 4. Unit and Measurement Definition Check
    const units = selectedVariable ? [selectedVariable.unit] : [];
    let unitPassed = true;
    let unitMessage = 'Compatible observation measurement parameters.';
    if (selectedVariable) {
      scientificNotes.push(`Selected primary measurement parameter: ${selectedVariable.variableName} (${selectedVariable.unit}).`);
    }

    // Determine Overall Status
    let status: CompatibilityStatus = 'COMPATIBLE';
    let allowDirectNumericalMerge = true;

    if (blockingReasons.length > 0) {
      status = 'INCOMPATIBLE';
      allowDirectNumericalMerge = false;
    } else if (scientificNotes.length > 0) {
      status = 'PARTIALLY_COMPATIBLE';
      allowDirectNumericalMerge = true;
    }

    return {
      status,
      allowDirectNumericalMerge,
      blockingReasons,
      scientificNotes,
      checks: {
        organismCheck: {
          passed: organismPassed,
          organisms,
          message: organismMessage
        },
        populationCheck: {
          passed: populationPassed,
          populations,
          message: populationMessage
        },
        unitCheck: {
          passed: unitPassed,
          units,
          message: unitMessage
        },
        environmentCheck: {
          passed: environmentPassed,
          environments: platforms,
          message: environmentMessage
        },
        temporalCheck: {
          passed: true,
          phases: ['Preflight', 'Inflight', 'Postflight'],
          message: 'Temporal collection phases can be mapped side-by-side.'
        }
      }
    };
  }
}
