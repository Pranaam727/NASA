/**
 * AstroCare Module Compatibility & Regression Validator
 * Section 13: Detects conflicting types, duplicate routes, missing dependencies,
 * duplicate services, and broken integration contracts across registered AstroCare modules.
 */

import {
  AstroCareModuleManifest,
  ModuleCompatibilityCheckResult,
} from '../types/modules';

export class ModuleCompatibilityValidator {
  private registeredModules: Map<string, AstroCareModuleManifest> = new Map();

  public registerModule(manifest: AstroCareModuleManifest): void {
    if (this.registeredModules.has(manifest.moduleId)) {
      throw new Error(`Module with ID "${manifest.moduleId}" is already registered.`);
    }
    this.registeredModules.set(manifest.moduleId, manifest);
  }

  public getModules(): AstroCareModuleManifest[] {
    return Array.from(this.registeredModules.values());
  }

  public clear(): void {
    this.registeredModules.clear();
  }

  /**
   * Run comprehensive cross-module compatibility audit
   */
  public validateAll(): ModuleCompatibilityCheckResult {
    const modules = this.getModules();
    const serviceProviders = new Map<string, string[]>();
    const routeRegistrations = new Map<string, string[]>();
    const typeDefinitions = new Map<string, string[]>();

    const duplicateServices: Array<{ serviceName: string; moduleIds: string[] }> = [];
    const duplicateRoutes: Array<{ routePath: string; moduleIds: string[] }> = [];
    const conflictingTypes: Array<{ typeName: string; moduleIds: string[] }> = [];
    const missingDependencies: Array<{ moduleId: string; missingService: string }> = [];
    const contractBreaks: Array<{ contractId: string; reason: string }> = [];
    const warnings: string[] = [];

    // 1. Index services, routes, and exported types
    for (const mod of modules) {
      // Provided services
      for (const service of mod.providedServices) {
        if (!serviceProviders.has(service)) {
          serviceProviders.set(service, []);
        }
        serviceProviders.get(service)!.push(mod.moduleId);
      }

      // Registered routes
      for (const route of mod.registeredRoutes) {
        if (!routeRegistrations.has(route)) {
          routeRegistrations.set(route, []);
        }
        routeRegistrations.get(route)!.push(mod.moduleId);
      }

      // Exported types
      for (const tName of mod.exportedTypes) {
        if (!typeDefinitions.has(tName)) {
          typeDefinitions.set(tName, []);
        }
        typeDefinitions.get(tName)!.push(mod.moduleId);
      }
    }

    // 2. Identify duplicate services
    for (const [service, modIds] of serviceProviders.entries()) {
      if (modIds.length > 1) {
        duplicateServices.push({ serviceName: service, moduleIds: modIds });
      }
    }

    // 3. Identify duplicate routes (route collisions)
    for (const [route, modIds] of routeRegistrations.entries()) {
      if (modIds.length > 1) {
        duplicateRoutes.push({ routePath: route, moduleIds: modIds });
      }
    }

    // 4. Identify conflicting exported types
    for (const [typeName, modIds] of typeDefinitions.entries()) {
      if (modIds.length > 1) {
        conflictingTypes.push({ typeName, moduleIds: modIds });
      }
    }

    // 5. Verify required dependencies are provided by some registered module
    for (const mod of modules) {
      for (const req of mod.requiredServices) {
        if (!serviceProviders.has(req)) {
          missingDependencies.push({ moduleId: mod.moduleId, missingService: req });
        }
      }

      // Check data contract specifications
      for (const contract of mod.dataContracts) {
        if (!contract.contractId || !contract.version) {
          contractBreaks.push({
            contractId: contract.contractId || 'UNKNOWN_CONTRACT',
            reason: `Module ${mod.moduleId} defines contract with missing contractId or version.`,
          });
        }
      }
    }

    const isCompatible =
      duplicateServices.length === 0 &&
      duplicateRoutes.length === 0 &&
      conflictingTypes.length === 0 &&
      missingDependencies.length === 0 &&
      contractBreaks.length === 0;

    return {
      isCompatible,
      totalModulesRegistered: modules.length,
      duplicateServices,
      duplicateRoutes,
      conflictingTypes,
      missingDependencies,
      contractBreaks,
      warnings,
    };
  }
}
