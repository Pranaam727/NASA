/**
 * AstroCare Module Compatibility & Integration Types
 * Section 13: Regression and Module Compatibility Testing
 */

export interface AstroCareDataContract {
  contractId: string;
  version: string;
  schemaDefinition: string;
  inputTypes: string[];
  outputTypes: string[];
}

export interface AstroCareModuleManifest {
  moduleId: string;
  moduleName: string;
  moduleVersion: string;
  category: 'BIOMEDICAL' | 'AI_INTELLIGENCE' | 'AEROSPACE' | 'RESEARCH' | 'CORE';
  requiredServices: string[];
  providedServices: string[];
  exportedTypes: string[];
  registeredRoutes: string[];
  dataContracts: AstroCareDataContract[];
  testEntryPoints?: string[];
  maintainer?: string;
}

export interface ModuleCompatibilityCheckResult {
  isCompatible: boolean;
  totalModulesRegistered: number;
  duplicateServices: Array<{ serviceName: string; moduleIds: string[] }>;
  duplicateRoutes: Array<{ routePath: string; moduleIds: string[] }>;
  conflictingTypes: Array<{ typeName: string; moduleIds: string[] }>;
  missingDependencies: Array<{ moduleId: string; missingService: string }>;
  contractBreaks: Array<{ contractId: string; reason: string }>;
  warnings: string[];
}
