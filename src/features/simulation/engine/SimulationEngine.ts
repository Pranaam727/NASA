import { SeededPRNG } from '../math/prng';
import { HeartRateSensor } from '../generators/HeartRateSensor';
import { BloodOxygenSensor } from '../generators/BloodOxygenSensor';
import { BloodPressureSensor } from '../generators/BloodPressureSensor';
import { BodyTempSensor } from '../generators/BodyTempSensor';
import { RespiratorySensor } from '../generators/RespiratorySensor';
import { EcgGenerator } from '../generators/EcgGenerator';
import { RadiationSensor } from '../generators/RadiationSensor';
import { ActivitySensor } from '../generators/ActivitySensor';
import { SleepGenerator } from '../generators/SleepGenerator';
import { ScenarioId, SimulationScenarioDefinition } from '../scenarios/scenarioTypes';
import { SIMULATION_SCENARIOS } from '../scenarios/scenarioDefinitions';
import {
  VitalSignsPacket,
  RadiationPacket,
  VitalSignsPacketSchema,
  RadiationPacketSchema,
} from '@/types/telemetry';
import { SEED_ASTRONAUTS } from '@/data/seedData';
import { telemetryService, radiationService } from '@/services/dataProvider';

export type SimulationStatus = 'STOPPED' | 'RUNNING' | 'PAUSED';

export interface SimulationTimelineEvent {
  id: string;
  timestamp: string;
  type: 'SESSION_START' | 'SCENARIO_SWITCH' | 'PARAMETER_RAMP' | 'ALERT_TRIGGER' | 'PAUSE' | 'RESUME';
  title: string;
  detail: string;
}

export interface SimulationState {
  status: SimulationStatus;
  scenario: SimulationScenarioDefinition;
  astronautId: string;
  speedMultiplier: number;
  elapsedSeconds: number;
  seed: number;
}

export class SimulationEngine {
  private prng: SeededPRNG;
  private status: SimulationStatus = 'STOPPED';
  private currentScenario: SimulationScenarioDefinition;
  private currentAstronautId: string = 'ASTRO-01';
  private speedMultiplier: number = 1.0;
  private elapsedSeconds: number = 0;
  private currentSeed: number = 19690720;

  // Sensor Generators
  private hrSensor: HeartRateSensor;
  private spo2Sensor: BloodOxygenSensor;
  private bpSensor: BloodPressureSensor;
  private tempSensor: BodyTempSensor;
  private respSensor: RespiratorySensor;
  private ecgGen: EcgGenerator;
  private radSensor: RadiationSensor;
  public activitySensor: ActivitySensor;
  public sleepGenerator: SleepGenerator;

  // Timers & Interval Handles
  private tickIntervalHandle: ReturnType<typeof setInterval> | null = null;
  private ecgIntervalHandle: ReturnType<typeof setInterval> | null = null;

  // Latest Cached Values
  private latestVitalsPacket: VitalSignsPacket | null = null;
  private latestRadiationPacket: RadiationPacket | null = null;
  private ecgRingBuffer: number[] = new Array(200).fill(0);
  private sampleCounter: number = 0;

  // Event Listeners
  private telemetryListeners = new Set<(packet: VitalSignsPacket) => void>();
  private radiationListeners = new Set<(packet: RadiationPacket) => void>();
  private ecgListeners = new Set<(sample: number, index: number) => void>();
  private eventListeners = new Set<(event: SimulationTimelineEvent) => void>();
  private stateListeners = new Set<(state: SimulationState) => void>();

  constructor(seed: number = 19690720) {
    this.currentSeed = seed;
    this.prng = new SeededPRNG(seed);
    this.currentScenario = SIMULATION_SCENARIOS[0];

    // Initialize generators
    this.hrSensor = new HeartRateSensor(this.prng, 65);
    this.spo2Sensor = new BloodOxygenSensor(this.prng, 98);
    this.bpSensor = new BloodPressureSensor(this.prng, 115, 75);
    this.tempSensor = new BodyTempSensor(this.prng, 36.8);
    this.respSensor = new RespiratorySensor(this.prng, 14);
    this.ecgGen = new EcgGenerator(this.prng, 50);
    this.radSensor = new RadiationSensor(this.prng, 0.052, 48.64);
    this.activitySensor = new ActivitySensor(this.prng);
    this.sleepGenerator = new SleepGenerator(this.prng);

    this.configureAstronautBaseline(this.currentAstronautId);
  }

  // --------------------------------------------------------------------------
  // LIFECYCLE CONTROLS
  // --------------------------------------------------------------------------

  public start(scenarioId?: ScenarioId, astronautId?: string): void {
    if (this.status === 'RUNNING') return;

    if (scenarioId) {
      const found = SIMULATION_SCENARIOS.find((s) => s.id === scenarioId);
      if (found) this.currentScenario = found;
    }
    if (astronautId) {
      this.currentAstronautId = astronautId;
      this.configureAstronautBaseline(astronautId);
    }

    this.status = 'RUNNING';
    this.notifyState();
    this.logEvent('SESSION_START', 'Simulation Session Activated', `Target: ${this.currentScenario.name}`);

    this.scheduleTimers();
  }

  public pause(): void {
    if (this.status !== 'RUNNING') return;
    this.status = 'PAUSED';
    this.clearTimers();
    this.notifyState();
    this.logEvent('PAUSE', 'Simulation Paused', 'Telemetry streams suspended');
  }

  public resume(): void {
    if (this.status !== 'PAUSED') return;
    this.status = 'RUNNING';
    this.notifyState();
    this.logEvent('RESUME', 'Simulation Resumed', 'Continuous telemetry stream restored');
    this.scheduleTimers();
  }

  public reset(): void {
    this.stop();
    this.prng.setSeed(this.currentSeed);
    this.elapsedSeconds = 0;
    this.sampleCounter = 0;
    this.ecgRingBuffer = new Array(200).fill(0);

    this.hrSensor.reset();
    this.spo2Sensor.reset();
    this.tempSensor.reset();
    this.respSensor.reset();
    this.ecgGen.reset();
    this.radSensor.reset();

    this.notifyState();
  }

  public stop(): void {
    this.status = 'STOPPED';
    this.clearTimers();
    this.notifyState();
  }

  public setSpeed(multiplier: number): void {
    this.speedMultiplier = multiplier;
    if (this.status === 'RUNNING') {
      this.clearTimers();
      this.scheduleTimers();
    }
    this.notifyState();
  }

  public setScenario(scenarioId: ScenarioId): void {
    const found = SIMULATION_SCENARIOS.find((s) => s.id === scenarioId);
    if (!found) return;

    this.currentScenario = found;
    this.notifyState();
    this.logEvent('SCENARIO_SWITCH', `Scenario: ${found.name}`, found.description);

    // Instant initial pulse upon scenario shift
    if (this.status === 'RUNNING') {
      this.tick();
    }
  }

  public setAstronaut(astronautId: string): void {
    this.currentAstronautId = astronautId;
    this.configureAstronautBaseline(astronautId);
    this.notifyState();
  }

  public setSeed(seed: number): void {
    this.currentSeed = seed;
    this.prng.setSeed(seed);
    this.notifyState();
  }

  // --------------------------------------------------------------------------
  // TIMER SCHEDULING (Centralized without drift)
  // --------------------------------------------------------------------------

  private scheduleTimers(): void {
    this.clearTimers();

    // 1. Nominal Vitals Tick: 1000ms / speedMultiplier
    const tickIntervalMs = Math.max(50, Math.round(1000 / this.speedMultiplier));
    this.tickIntervalHandle = setInterval(() => {
      this.tick();
    }, tickIntervalMs);

    // 2. High-Frequency ECG Waveform: 50Hz (20ms interval)
    // Run at ~20ms adjusted by speed
    const ecgIntervalMs = Math.max(10, Math.round(20 / Math.min(this.speedMultiplier, 2.0)));
    this.ecgIntervalHandle = setInterval(() => {
      this.tickEcg();
    }, ecgIntervalMs);
  }

  private clearTimers(): void {
    if (this.tickIntervalHandle) {
      clearInterval(this.tickIntervalHandle);
      this.tickIntervalHandle = null;
    }
    if (this.ecgIntervalHandle) {
      clearInterval(this.ecgIntervalHandle);
      this.ecgIntervalHandle = null;
    }
  }

  // --------------------------------------------------------------------------
  // SYNCHRONIZED TICK DISPATCHER
  // --------------------------------------------------------------------------

  public tick(): void {
    this.elapsedSeconds += 1;
    const mod = this.currentScenario.modulators;
    const astro = SEED_ASTRONAUTS.find((a) => a.id === this.currentAstronautId) || SEED_ASTRONAUTS[0];

    // 1. Generate physiological sensor values
    const hrOut = this.hrSensor.generate(this.elapsedSeconds, mod.hrTargetOffset, mod.stressFactor);
    const bpOut = this.bpSensor.generate(hrOut.heartRate, astro.baseline_resting_hr, mod.bpStressDelta);
    const spo2Out = this.spo2Sensor.generate(this.elapsedSeconds, mod.spo2Drop);
    const respOut = this.respSensor.generate(hrOut.heartRate, astro.baseline_resting_hr, mod.spo2Drop);
    const tempOut = this.tempSensor.generate(this.elapsedSeconds, mod.thermalDelta);

    // 2. Generate 1-second 50Hz ECG frame for the packet
    const ecgStripSamples = this.ecgGen.generateBatch(hrOut.heartRate, 50);

    // 3. Assemble and Validate VitalSignsPacket
    const vitalsPacket: VitalSignsPacket = {
      packetId: crypto.randomUUID(),
      astronautId: this.currentAstronautId,
      missionId: 'm-ares-06',
      timestamp: new Date().toISOString(),
      dataSource: 'SIMULATOR',
      isSimulated: true,
      vitals: {
        heartRate: { value: hrOut.heartRate, unit: 'bpm', quality: hrOut.qualityStatus },
        bloodPressure: { systolic: bpOut.systolic, diastolic: bpOut.diastolic, unit: 'mmHg', quality: bpOut.qualityStatus },
        spo2: { value: spo2Out.spo2, unit: '%', quality: spo2Out.qualityStatus },
        respiratoryRate: { value: respOut.respiratoryRate, unit: 'rpm', quality: respOut.qualityStatus },
        coreTemp: { value: tempOut.coreTemp, unit: '°C', quality: tempOut.qualityStatus },
        ecgStrip: { values: ecgStripSamples, sampleRateHz: 50 },
      },
    };

    // Zod validation (Ensures zero contract violations before broadcast)
    const validVitals = VitalSignsPacketSchema.safeParse(vitalsPacket);
    if (validVitals.success) {
      this.latestVitalsPacket = vitalsPacket;
      // Broadcast to in-memory listeners
      this.telemetryListeners.forEach((fn) => fn(vitalsPacket));
      // Persist to repository (asynchronously)
      telemetryService.recordVitalPacket(vitalsPacket).catch((err) => {
        console.error('Error persisting simulated vitals:', err);
      });
    } else {
      console.warn('Telemetry packet failed validation schema:', validVitals.error);
    }

    // 4. Generate & Validate RadiationPacket
    const radOut = this.radSensor.generate(1.0, mod.isSpeActive, mod.speSurgeFlux);
    const radPacket: RadiationPacket = {
      packetId: crypto.randomUUID(),
      astronautId: this.currentAstronautId,
      missionId: 'm-ares-06',
      timestamp: new Date().toISOString(),
      dataSource: 'SIMULATOR',
      isSimulated: true,
      ambientFluxUsVh: radOut.ambientFluxUsVh,
      accumulatedDoseMSv: radOut.accumulatedDoseMSv,
      solarParticleEventActive: radOut.solarParticleEventActive,
      quality: radOut.qualityStatus,
    };

    const validRad = RadiationPacketSchema.safeParse(radPacket);
    if (validRad.success) {
      this.latestRadiationPacket = radPacket;
      this.radiationListeners.forEach((fn) => fn(radPacket));
      radiationService.recordRadiationPacket(radPacket).catch((err) => {
        console.error('Error persisting simulated radiation:', err);
      });
    }

    this.notifyState();
  }

  private tickEcg(): void {
    const hr = this.latestVitalsPacket?.vitals.heartRate.value || 68;
    const sample = this.ecgGen.generateSample(hr);

    this.ecgRingBuffer[this.sampleCounter % this.ecgRingBuffer.length] = sample;
    this.sampleCounter++;

    this.ecgListeners.forEach((fn) => fn(sample, this.sampleCounter));
  }

  // --------------------------------------------------------------------------
  // SUBSCRIPTION & EVENT BUS
  // --------------------------------------------------------------------------

  public onTelemetryPacket(callback: (packet: VitalSignsPacket) => void): () => void {
    this.telemetryListeners.add(callback);
    if (this.latestVitalsPacket) callback(this.latestVitalsPacket);
    return () => this.telemetryListeners.delete(callback);
  }

  public onRadiationPacket(callback: (packet: RadiationPacket) => void): () => void {
    this.radiationListeners.add(callback);
    if (this.latestRadiationPacket) callback(this.latestRadiationPacket);
    return () => this.radiationListeners.delete(callback);
  }

  public onEcgSample(callback: (sample: number, index: number) => void): () => void {
    this.ecgListeners.add(callback);
    return () => this.ecgListeners.delete(callback);
  }

  public onSimulationEvent(callback: (event: SimulationTimelineEvent) => void): () => void {
    this.eventListeners.add(callback);
    return () => this.eventListeners.delete(callback);
  }

  public onStateChange(callback: (state: SimulationState) => void): () => void {
    this.stateListeners.add(callback);
    callback(this.getState());
    return () => this.stateListeners.delete(callback);
  }

  public getState(): SimulationState {
    return {
      status: this.status,
      scenario: this.currentScenario,
      astronautId: this.currentAstronautId,
      speedMultiplier: this.speedMultiplier,
      elapsedSeconds: this.elapsedSeconds,
      seed: this.currentSeed,
    };
  }

  public getLatestVitals(): VitalSignsPacket | null {
    return this.latestVitalsPacket;
  }

  public getLatestRadiation(): RadiationPacket | null {
    return this.latestRadiationPacket;
  }

  public getEcgBuffer(): number[] {
    return [...this.ecgRingBuffer];
  }

  private notifyState(): void {
    const state = this.getState();
    this.stateListeners.forEach((fn) => fn(state));
  }

  private logEvent(type: SimulationTimelineEvent['type'], title: string, detail: string): void {
    const event: SimulationTimelineEvent = {
      id: `evt-${Date.now()}-${Math.floor(this.prng.next() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      title,
      detail,
    };
    this.eventListeners.forEach((fn) => fn(event));
  }

  private configureAstronautBaseline(astronautId: string): void {
    const astro = SEED_ASTRONAUTS.find((a) => a.id === astronautId) || SEED_ASTRONAUTS[0];
    this.hrSensor.setBaseline(astro.baseline_resting_hr);
    this.spo2Sensor.setBaseline(astro.baseline_spo2);
    this.bpSensor.setBaseline(astro.baseline_bp_systolic, astro.baseline_bp_diastolic);
  }
}

// Global Singleton Instance for application-wide telemetry distribution
export const simulationEngine = new SimulationEngine();
