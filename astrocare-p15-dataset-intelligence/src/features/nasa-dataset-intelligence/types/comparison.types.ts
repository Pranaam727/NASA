import { DatasetRecord } from './dataset.types';
import { MeasurementVariable } from './observation.types';

export type CompatibilityStatus = 'COMPATIBLE' | 'PARTIALLY_COMPATIBLE' | 'INCOMPATIBLE';

export interface ScientificCompatibilityReport {
  status: CompatibilityStatus;
  allowDirectNumericalMerge: boolean;
  blockingReasons: string[];
  scientificNotes: string[];
  checks: {
    organismCheck: {
      passed: boolean;
      organisms: string[];
      message: string;
    };
    populationCheck: {
      passed: boolean;
      populations: string[];
      message: string;
    };
    unitCheck: {
      passed: boolean;
      units: string[];
      message: string;
    };
    environmentCheck: {
      passed: boolean;
      environments: string[];
      message: string;
    };
    temporalCheck: {
      passed: boolean;
      phases: string[];
      message: string;
    };
  };
}

export interface DatasetComparisonState {
  selectedDatasets: DatasetRecord[];
  selectedVariableId?: string;
  selectedVariable?: MeasurementVariable;
  compatibilityReport: ScientificCompatibilityReport | null;
}
