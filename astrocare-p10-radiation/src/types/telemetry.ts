import { z } from 'zod';

/**
 * ============================================================================
 * ASTROCARE CANONICAL TELEMETRY DATA CONTRACT
 * ============================================================================
 * Standardized schema governing all telemetry generation, validation,
 * persistence, and transmission across AstroCare subsystems.
 */

// 1. Core Enumerations & Literals
export type DataSourceType = 'HARDWARE_STREAM' | 'SIMULATOR' | 'MANUAL_ENTRY' | 'LAB_IMPORT';
export type QualityStatus = 'NOMINAL' | 'DEGRADED_SIGNAL' | 'OUT_OF_BOUNDS' | 'SENSOR_DISCONNECTED';

export type MeasurementType =
  | 'HEART_RATE'
  | 'SPO2'
  | 'BLOOD_PRESSURE_SYS'
  | 'BLOOD_PRESSURE_DIA'
  | 'CORE_TEMP'
  | 'RESPIRATORY_RATE'
  | 'RADIATION_FLUX'
  | 'ECG_WAVEFORM';

export type MeasurementUnit = 'bpm' | '%' | 'mmHg' | '°C' | 'rpm' | 'uSv/h' | 'mV';

export interface MeasurementUnitMap {
  HEART_RATE: 'bpm';
  SPO2: '%';
  BLOOD_PRESSURE_SYS: 'mmHg';
  BLOOD_PRESSURE_DIA: 'mmHg';
  CORE_TEMP: '°C';
  RESPIRATORY_RATE: 'rpm';
  RADIATION_FLUX: 'uSv/h';
  ECG_WAVEFORM: 'mV';
}

// 2. Physiological Invariant Boundaries for Validation
export const PHYSIOLOGICAL_BOUNDS = {
  HEART_RATE: { min: 20, max: 250, unit: 'bpm' as const },
  SPO2: { min: 50, max: 100, unit: '%' as const },
  BLOOD_PRESSURE_SYS: { min: 50, max: 260, unit: 'mmHg' as const },
  BLOOD_PRESSURE_DIA: { min: 30, max: 180, unit: 'mmHg' as const },
  CORE_TEMP: { min: 32.0, max: 43.0, unit: '°C' as const },
  RESPIRATORY_RATE: { min: 4, max: 60, unit: 'rpm' as const },
  RADIATION_FLUX: { min: 0.0, max: 1000.0, unit: 'uSv/h' as const },
} as const;

// 3. Zod Invariant Validation Schemas

export const DataSourceTypeSchema = z.enum([
  'HARDWARE_STREAM',
  'SIMULATOR',
  'MANUAL_ENTRY',
  'LAB_IMPORT',
]);

export const QualityStatusSchema = z.enum([
  'NOMINAL',
  'DEGRADED_SIGNAL',
  'OUT_OF_BOUNDS',
  'SENSOR_DISCONNECTED',
]);

export const MeasurementTypeSchema = z.enum([
  'HEART_RATE',
  'SPO2',
  'BLOOD_PRESSURE_SYS',
  'BLOOD_PRESSURE_DIA',
  'CORE_TEMP',
  'RESPIRATORY_RATE',
  'RADIATION_FLUX',
  'ECG_WAVEFORM',
]);

/**
 * Atomic Single Telemetry Measurement Schema
 */
export const SingleTelemetryReadingSchema = z
  .object({
    readingId: z.string().min(1, 'Reading ID required'),
    astronautId: z.string().min(1, 'Astronaut ID required'),
    missionId: z.string().min(1, 'Mission ID required'),
    timestamp: z.string().datetime({ message: 'Must be ISO 8601 UTC timestamp' }),
    dataSource: DataSourceTypeSchema,
    isSimulated: z.boolean(),
    measurementType: MeasurementTypeSchema,
    value: z.number(),
    unit: z.string(),
    qualityStatus: QualityStatusSchema,
  })
  .refine(
    (data) => {
      // Validate physiological boundary invariants
      switch (data.measurementType) {
        case 'HEART_RATE':
          return (
            data.value >= PHYSIOLOGICAL_BOUNDS.HEART_RATE.min &&
            data.value <= PHYSIOLOGICAL_BOUNDS.HEART_RATE.max
          );
        case 'SPO2':
          return (
            data.value >= PHYSIOLOGICAL_BOUNDS.SPO2.min &&
            data.value <= PHYSIOLOGICAL_BOUNDS.SPO2.max
          );
        case 'BLOOD_PRESSURE_SYS':
          return (
            data.value >= PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_SYS.min &&
            data.value <= PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_SYS.max
          );
        case 'BLOOD_PRESSURE_DIA':
          return (
            data.value >= PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_DIA.min &&
            data.value <= PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_DIA.max
          );
        case 'CORE_TEMP':
          return (
            data.value >= PHYSIOLOGICAL_BOUNDS.CORE_TEMP.min &&
            data.value <= PHYSIOLOGICAL_BOUNDS.CORE_TEMP.max
          );
        case 'RESPIRATORY_RATE':
          return (
            data.value >= PHYSIOLOGICAL_BOUNDS.RESPIRATORY_RATE.min &&
            data.value <= PHYSIOLOGICAL_BOUNDS.RESPIRATORY_RATE.max
          );
        case 'RADIATION_FLUX':
          return (
            data.value >= PHYSIOLOGICAL_BOUNDS.RADIATION_FLUX.min &&
            data.value <= PHYSIOLOGICAL_BOUNDS.RADIATION_FLUX.max
          );
        default:
          return true;
      }
    },
    {
      message: 'Measurement value violates physiological safety boundaries',
    }
  );

/**
 * Grouped Vital Signs Packet Schema (Broadcast Frame)
 */
export const VitalSignsPacketSchema = z.object({
  packetId: z.string().uuid(),
  astronautId: z.string().min(1),
  missionId: z.string().min(1),
  timestamp: z.string().datetime(),
  dataSource: DataSourceTypeSchema,
  isSimulated: z.boolean(),
  vitals: z.object({
    heartRate: z.object({
      value: z
        .number()
        .min(PHYSIOLOGICAL_BOUNDS.HEART_RATE.min)
        .max(PHYSIOLOGICAL_BOUNDS.HEART_RATE.max),
      unit: z.literal('bpm'),
      quality: QualityStatusSchema,
    }),
    bloodPressure: z.object({
      systolic: z
        .number()
        .min(PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_SYS.min)
        .max(PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_SYS.max),
      diastolic: z
        .number()
        .min(PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_DIA.min)
        .max(PHYSIOLOGICAL_BOUNDS.BLOOD_PRESSURE_DIA.max),
      unit: z.literal('mmHg'),
      quality: QualityStatusSchema,
    }),
    spo2: z.object({
      value: z.number().min(PHYSIOLOGICAL_BOUNDS.SPO2.min).max(PHYSIOLOGICAL_BOUNDS.SPO2.max),
      unit: z.literal('%'),
      quality: QualityStatusSchema,
    }),
    respiratoryRate: z.object({
      value: z
        .number()
        .min(PHYSIOLOGICAL_BOUNDS.RESPIRATORY_RATE.min)
        .max(PHYSIOLOGICAL_BOUNDS.RESPIRATORY_RATE.max),
      unit: z.literal('rpm'),
      quality: QualityStatusSchema,
    }),
    coreTemp: z.object({
      value: z
        .number()
        .min(PHYSIOLOGICAL_BOUNDS.CORE_TEMP.min)
        .max(PHYSIOLOGICAL_BOUNDS.CORE_TEMP.max),
      unit: z.literal('°C'),
      quality: QualityStatusSchema,
    }),
    ecgStrip: z
      .object({
        values: z.array(z.number()),
        sampleRateHz: z.number().positive(),
      })
      .optional(),
  }),
});

/**
 * Radiation Telemetry Packet Schema
 */
export const RadiationPacketSchema = z.object({
  packetId: z.string().uuid(),
  astronautId: z.string().min(1),
  missionId: z.string().min(1),
  timestamp: z.string().datetime(),
  dataSource: DataSourceTypeSchema,
  isSimulated: z.boolean(),
  ambientFluxUsVh: z
    .number()
    .min(PHYSIOLOGICAL_BOUNDS.RADIATION_FLUX.min)
    .max(PHYSIOLOGICAL_BOUNDS.RADIATION_FLUX.max),
  accumulatedDoseMSv: z.number().nonnegative(),
  solarParticleEventActive: z.boolean(),
  quality: QualityStatusSchema,
});

/**
 * Telemetry Batch Container Schema
 */
export const TelemetryBatchSchema = z.object({
  batchId: z.string().uuid(),
  missionId: z.string().min(1),
  sentAt: z.string().datetime(),
  readings: z.array(SingleTelemetryReadingSchema),
});

// 4. Inferred TypeScript Types from Zod Schemas
export type SingleTelemetryMeasurement<T extends MeasurementType = MeasurementType> = z.infer<
  typeof SingleTelemetryReadingSchema
> & {
  measurementType: T;
  unit: MeasurementUnitMap[T];
};

export type TelemetryReading = z.infer<typeof SingleTelemetryReadingSchema>;
export type VitalSignsPacket = z.infer<typeof VitalSignsPacketSchema>;
export type RadiationPacket = z.infer<typeof RadiationPacketSchema>;
export type TelemetryBatch = z.infer<typeof TelemetryBatchSchema>;

/**
 * Pluggable Telemetry Adapter Interface
 * Decouples virtual simulation from live hardware sensor streams.
 */
export interface ITelemetrySource {
  init(): Promise<void>;
  startStream(astronautId: string, intervalMs: number): void;
  stopStream(): void;
  onPacketReceived(callback: (packet: VitalSignsPacket) => void): () => void;
  onRadiationReceived(callback: (packet: RadiationPacket) => void): () => void;
  setScenario?(scenarioId: string): void;
  setSpeedMultiplier?(speed: number): void;
}
