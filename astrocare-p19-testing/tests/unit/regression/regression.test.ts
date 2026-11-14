import { describe, it, expect } from 'vitest';
import { ModuleCompatibilityValidator } from '../../../src/regression/ModuleCompatibilityValidator';
import { SYNTHETIC_SAMPLE_MANIFESTS } from '../../../src/fixtures';

describe('Regression & Module Interface Compatibility', () => {
  it('registers AstroCare modules and resolves dependency graph', () => {
    const validator = new ModuleCompatibilityValidator();
    SYNTHETIC_SAMPLE_MANIFESTS.forEach((m) => validator.registerModule(m));

    // Register satisfying core service
    validator.registerModule({
      moduleId: 'astrocare-core-telemetry',
      moduleName: 'Core Telemetry Ingestion Service',
      moduleVersion: '1.0.0',
      category: 'CORE',
      requiredServices: [],
      providedServices: ['telemetry-stream-service'],
      exportedTypes: ['RawTelemetryPacket'],
      registeredRoutes: ['/ingest'],
      dataContracts: [],
    });

    const result = validator.validateAll();
    expect(result.isCompatible).toBe(true);
    expect(result.missingDependencies).toHaveLength(0);
    expect(result.duplicateServices).toHaveLength(0);
    expect(result.duplicateRoutes).toHaveLength(0);
  });

  it('detects duplicate service providers across modules', () => {
    const validator = new ModuleCompatibilityValidator();
    validator.registerModule({
      moduleId: 'module-a',
      moduleName: 'Module A',
      moduleVersion: '1.0.0',
      category: 'BIOMEDICAL',
      requiredServices: [],
      providedServices: ['shared-vital-service'],
      exportedTypes: [],
      registeredRoutes: ['/route-a'],
      dataContracts: [],
    });

    validator.registerModule({
      moduleId: 'module-b',
      moduleName: 'Module B',
      moduleVersion: '1.0.0',
      category: 'AEROSPACE',
      requiredServices: [],
      providedServices: ['shared-vital-service'], // Duplicate!
      exportedTypes: [],
      registeredRoutes: ['/route-b'],
      dataContracts: [],
    });

    const result = validator.validateAll();
    expect(result.isCompatible).toBe(false);
    expect(result.duplicateServices).toHaveLength(1);
    expect(result.duplicateServices[0].serviceName).toBe('shared-vital-service');
  });

  it('detects route collisions between registered modules', () => {
    const validator = new ModuleCompatibilityValidator();
    validator.registerModule({
      moduleId: 'mod-1',
      moduleName: 'Mod 1',
      moduleVersion: '1.0.0',
      category: 'AI_INTELLIGENCE',
      requiredServices: [],
      providedServices: ['ai-service-1'],
      exportedTypes: [],
      registeredRoutes: ['/dashboard/overview'],
      dataContracts: [],
    });

    validator.registerModule({
      moduleId: 'mod-2',
      moduleName: 'Mod 2',
      moduleVersion: '1.0.0',
      category: 'RESEARCH',
      requiredServices: [],
      providedServices: ['research-service-1'],
      exportedTypes: [],
      registeredRoutes: ['/dashboard/overview'], // Route collision!
      dataContracts: [],
    });

    const result = validator.validateAll();
    expect(result.isCompatible).toBe(false);
    expect(result.duplicateRoutes).toHaveLength(1);
    expect(result.duplicateRoutes[0].routePath).toBe('/dashboard/overview');
  });

  it('flags missing dependencies when a required service is not registered', () => {
    const validator = new ModuleCompatibilityValidator();
    validator.registerModule({
      moduleId: 'mod-orphan',
      moduleName: 'Orphan Module',
      moduleVersion: '1.0.0',
      category: 'BIOMEDICAL',
      requiredServices: ['non-existent-telemetry-broker'],
      providedServices: [],
      exportedTypes: [],
      registeredRoutes: ['/orphan'],
      dataContracts: [],
    });

    const result = validator.validateAll();
    expect(result.isCompatible).toBe(false);
    expect(result.missingDependencies).toHaveLength(1);
    expect(result.missingDependencies[0].missingService).toBe('non-existent-telemetry-broker');
  });
});
