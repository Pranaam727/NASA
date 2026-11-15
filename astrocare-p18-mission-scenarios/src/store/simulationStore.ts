/**
 * AstroCare P18 — Zustand Simulation Store
 * Global reactive state derived from SimulationEngine.
 */

import { create } from 'zustand';
import { SimulationEngine, BASELINE_ENVIRONMENT, BASELINE_RADIATION, BASELINE_CREW, BASELINE_RESOURCES } from '../engine/SimulationEngine';
import { PREDEFINED_SCENARIOS } from '../data/scenarios';
import type {
  ScenarioDefinition,
  SimulationTelemetrySnapshot,
  MissionProfile,
} from '../contracts/index';

const engine = new SimulationEngine(42);

const DEFAULT_PROFILE: MissionProfile = {
  id: 'MP-ARTEMIS-III',
  name: 'Artemis III Extended',
  identifier: 'AC-ART-III-E',
  spacecraftType: 'Orion MPCV',
  durationDays: 30,
  currentDay: 1,
  phase: 'Deep Space Cruise',
  crewSize: 4,
  crewMembers: [
    { id: 'cm-01', name: 'Commander A. Hayes', role: 'Commander', baselineVO2Max: 52 },
    { id: 'cm-02', name: 'Pilot R. Vasquez', role: 'Pilot', baselineVO2Max: 50 },
    { id: 'cm-03', name: 'Dr. M. Chen', role: 'Mission Specialist / Medical', baselineVO2Max: 48 },
    { id: 'cm-04', name: 'Eng. P. Okafor', role: 'Systems Engineer', baselineVO2Max: 51 },
  ],
};

export type SimSpeedOption = 1 | 2 | 5 | 10 | 60 | 300;

interface SimulationStore {
  // Core state
  isRunning: boolean;
  isPaused: boolean;
  speed: SimSpeedOption;
  elapsedSec: number;
  missionProfile: MissionProfile;
  selectedScenario: ScenarioDefinition | null;
  currentTelemetry: SimulationTelemetrySnapshot | null;
  telemetryHistory: SimulationTelemetrySnapshot[];
  customScenarios: ScenarioDefinition[];
  _intervalId: ReturnType<typeof setInterval> | null;

  // Actions
  loadScenario: (scenario: ScenarioDefinition) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  stepSimulation: () => void;
  setSpeed: (speed: SimSpeedOption) => void;
  setMissionProfile: (profile: MissionProfile) => void;
  applyRecoveryAction: (actionId: string, params?: Record<string, any>) => void;
  saveCustomScenario: (scenario: ScenarioDefinition) => void;
  deleteCustomScenario: (id: string) => void;
  _tick: () => void;
}

const TICK_MS = 100; // Real-time tick interval

export const useSimStore = create<SimulationStore>((set, get) => ({
  isRunning: false,
  isPaused: false,
  speed: 10,
  elapsedSec: 0,
  missionProfile: DEFAULT_PROFILE,
  selectedScenario: null,
  currentTelemetry: null,
  telemetryHistory: [],
  customScenarios: loadCustomScenarios(),
  _intervalId: null,

  loadScenario: (scenario) => {
    get().pauseSimulation();
    engine.loadScenario(scenario);
    const snap = engine.snapshot();
    set({
      selectedScenario: scenario,
      currentTelemetry: snap,
      telemetryHistory: [snap],
      elapsedSec: 0,
      isRunning: false,
      isPaused: false,
    });
  },

  startSimulation: () => {
    const { selectedScenario, _intervalId, isRunning } = get();
    if (!selectedScenario || isRunning) return;

    // Load fresh if no history
    if (engine.getElapsedSec() === 0) engine.loadScenario(selectedScenario);

    const intervalId = setInterval(get()._tick, TICK_MS);
    set({ isRunning: true, isPaused: false, _intervalId: intervalId });
  },

  pauseSimulation: () => {
    const { _intervalId } = get();
    if (_intervalId) clearInterval(_intervalId);
    set({ isRunning: false, isPaused: true, _intervalId: null });
  },

  resumeSimulation: () => {
    const { isPaused, selectedScenario } = get();
    if (!isPaused || !selectedScenario) return;
    const intervalId = setInterval(get()._tick, TICK_MS);
    set({ isRunning: true, isPaused: false, _intervalId: intervalId });
  },

  resetSimulation: () => {
    const { _intervalId, selectedScenario } = get();
    if (_intervalId) clearInterval(_intervalId);
    if (selectedScenario) {
      engine.loadScenario(selectedScenario);
      const snap = engine.snapshot();
      set({
        isRunning: false,
        isPaused: false,
        _intervalId: null,
        elapsedSec: 0,
        currentTelemetry: snap,
        telemetryHistory: [snap],
      });
    } else {
      set({ isRunning: false, isPaused: false, _intervalId: null, elapsedSec: 0 });
    }
  },

  stepSimulation: () => {
    const { selectedScenario, speed } = get();
    if (!selectedScenario) return;
    if (engine.getElapsedSec() === 0) engine.loadScenario(selectedScenario);
    // Step 10 seconds of simulation time
    engine.step(10);
    const snap = engine.snapshot();
    set(state => ({
      elapsedSec: engine.getElapsedSec(),
      currentTelemetry: snap,
      telemetryHistory: [...state.telemetryHistory, snap].slice(-500),
    }));
  },

  setSpeed: (speed) => set({ speed }),

  setMissionProfile: (profile) => set({ missionProfile: profile }),

  applyRecoveryAction: (actionId, params) => {
    engine.applyRecoveryAction(actionId, params);
    const snap = engine.snapshot();
    set(state => ({
      currentTelemetry: snap,
      telemetryHistory: [...state.telemetryHistory, snap].slice(-500),
    }));
  },

  saveCustomScenario: (scenario) => {
    const updated = get().customScenarios.filter(s => s.id !== scenario.id);
    updated.push({ ...scenario, isCustom: true });
    persistCustomScenarios(updated);
    set({ customScenarios: updated });
  },

  deleteCustomScenario: (id) => {
    const updated = get().customScenarios.filter(s => s.id !== id);
    persistCustomScenarios(updated);
    set({ customScenarios: updated });
  },

  _tick: () => {
    const { speed } = get();
    // Each TICK_MS of real time advances (speed * TICK_MS/1000) sim seconds
    const simDelta = speed * (TICK_MS / 1000);
    engine.step(simDelta);
    const snap = engine.snapshot();
    set(state => ({
      elapsedSec: engine.getElapsedSec(),
      currentTelemetry: snap,
      telemetryHistory: [...state.telemetryHistory, snap].slice(-500),
      missionProfile: {
        ...state.missionProfile,
        currentDay: Math.floor(engine.getElapsedSec() / 86400) + 1,
      },
    }));
  },
}));

function loadCustomScenarios(): ScenarioDefinition[] {
  try {
    const raw = localStorage.getItem('astrocare_p18_custom_scenarios');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistCustomScenarios(scenarios: ScenarioDefinition[]) {
  try {
    localStorage.setItem('astrocare_p18_custom_scenarios', JSON.stringify(scenarios));
  } catch { /* ignore */ }
}

export { PREDEFINED_SCENARIOS, DEFAULT_PROFILE };
export { BASELINE_ENVIRONMENT, BASELINE_RADIATION, BASELINE_CREW, BASELINE_RESOURCES };
