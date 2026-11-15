import { MissionScenario, ScenarioSimulationResult } from '../types';
import { DEMO_SCENARIOS, simulateMissionScenario } from '../data/demoScenarios';
import { safeStorage } from '../utils/safeStorage';

const STORAGE_KEY = 'astrocare_p17_scenarios';

class MissionScenarioService {
  private getStored(): MissionScenario[] {
    try {
      const data = safeStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read scenarios, using demo data.', e);
    }
    this.save(DEMO_SCENARIOS);
    return DEMO_SCENARIOS;
  }

  private save(scenarios: MissionScenario[]): void {
    try {
      safeStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
    } catch (e) {
      console.error('Failed to save scenarios', e);
    }
  }

  public getAll(): MissionScenario[] {
    return this.getStored();
  }

  public getById(id: string): MissionScenario | undefined {
    return this.getStored().find((s) => s.id === id);
  }

  public create(scenarioInput: Omit<MissionScenario, 'id' | 'createdAt' | 'isPreconfigured'>): MissionScenario {
    const list = this.getStored();
    const newScenario: MissionScenario = {
      ...scenarioInput,
      id: `scen-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      isPreconfigured: false,
    };
    list.push(newScenario);
    this.save(list);
    return newScenario;
  }

  public update(id: string, updates: Partial<MissionScenario>): MissionScenario | null {
    const list = this.getStored();
    const index = list.findIndex((s) => s.id === id);
    if (index === -1) return null;

    list[index] = { ...list[index], ...updates };
    this.save(list);
    return list[index];
  }

  public delete(id: string): boolean {
    const list = this.getStored();
    const filtered = list.filter((s) => s.id !== id);
    if (filtered.length === list.length) return false;
    this.save(filtered);
    return true;
  }

  public runSimulation(scenarioId: string): ScenarioSimulationResult | null {
    const scenario = this.getById(scenarioId);
    if (!scenario) return null;
    return simulateMissionScenario(scenario);
  }

  public resetToDemo(): MissionScenario[] {
    this.save(DEMO_SCENARIOS);
    return DEMO_SCENARIOS;
  }
}

export const missionScenarioService = new MissionScenarioService();
