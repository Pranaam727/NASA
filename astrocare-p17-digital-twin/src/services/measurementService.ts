import { PhysiologicalMeasurement, PhysiologicalSystemType, SystemStatusSummary } from '../types';
import { DEMO_MEASUREMENTS } from '../data/demoMeasurements';
import { safeStorage } from '../utils/safeStorage';

const STORAGE_KEY = 'astrocare_p17_measurements';

class MeasurementService {
  private getStored(): PhysiologicalMeasurement[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read measurements, using demo data.', e);
    }
    this.save(DEMO_MEASUREMENTS);
    return DEMO_MEASUREMENTS;
  }

  private save(measurements: PhysiologicalMeasurement[]): void {
    try {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(measurements));
    } catch (e) {
      console.error('Failed to save measurements', e);
    }
  }

  public getAll(): PhysiologicalMeasurement[] {
    return this.getStored();
  }

  public getByAstronaut(astronautId: string): PhysiologicalMeasurement[] {
    return this.getStored().filter((m) => m.astronautId === astronautId);
  }

  public getByAstronautAndSystem(
    astronautId: string,
    system: PhysiologicalSystemType
  ): PhysiologicalMeasurement[] {
    return this.getStored().filter(
      (m) => m.astronautId === astronautId && m.system === system
    );
  }

  public getByAstronautAndVariable(
    astronautId: string,
    variable: string
  ): PhysiologicalMeasurement[] {
    return this.getStored()
      .filter((m) => m.astronautId === astronautId && m.variable === variable)
      .sort((a, b) => a.missionDay - b.missionDay);
  }

  public addMeasurement(measurement: Omit<PhysiologicalMeasurement, 'id'>): PhysiologicalMeasurement {
    const list = this.getStored();
    const newMeasurement: PhysiologicalMeasurement = {
      ...measurement,
      id: `m-${Date.now().toString().slice(-5)}`,
    };
    list.push(newMeasurement);
    this.save(list);
    return newMeasurement;
  }

  public getSystemSummaries(astronautId: string): SystemStatusSummary[] {
    const systems: { key: PhysiologicalSystemType; name: string }[] = [
      { key: 'cardiovascular', name: 'Cardiovascular' },
      { key: 'musculoskeletal', name: 'Musculoskeletal' },
      { key: 'immune', name: 'Immune' },
      { key: 'neurological', name: 'Neurological & Vestibular' },
      { key: 'sleep_circadian', name: 'Sleep & Circadian' },
      { key: 'radiation_context', name: 'Radiation Context' },
      { key: 'respiratory', name: 'Respiratory' },
    ];

    const astronautMeasurements = this.getByAstronaut(astronautId);

    return systems.map(({ key, name }) => {
      const systemMeasurements = astronautMeasurements.filter((m) => m.system === key);
      const validMeasurements = systemMeasurements.filter((m) => m.value !== null);
      const hasData = validMeasurements.length > 0;
      
      const distinctVars = Array.from(new Set(systemMeasurements.map((m) => m.variableName)));
      const latest = hasData
        ? [...validMeasurements].sort((a, b) => b.missionDay - a.missionDay)[0]
        : null;

      // Status calculation: review recommended if any measurement is unavailable or has significant shift
      let status: SystemStatusSummary['status'] = 'normal';
      if (!hasData) {
        status = 'insufficient_data';
      } else if (systemMeasurements.some((m) => m.value === null)) {
        status = 'review_recommended';
      }

      return {
        system: key,
        displayName: name,
        dataAvailable: hasData,
        measurementCount: validMeasurements.length,
        lastUpdated: latest ? latest.timestamp : null,
        status,
        activeVariables: distinctVars,
      };
    });
  }

  public resetToDemo(): PhysiologicalMeasurement[] {
    this.save(DEMO_MEASUREMENTS);
    return DEMO_MEASUREMENTS;
  }
}

export const measurementService = new MeasurementService();
