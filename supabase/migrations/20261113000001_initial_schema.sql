-- ============================================================================
-- ASTROCARE MIGRATION 01: INITIAL SCHEMA & TABLE DEFINITIONS
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUMS FOR STRICT SCHEMA TYPING
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('ASTRONAUT', 'MEDICAL_OFFICER', 'MISSION_CONTROLLER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE data_source_type AS ENUM ('HARDWARE_STREAM', 'SIMULATOR', 'MANUAL_ENTRY', 'LAB_IMPORT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE quality_status_type AS ENUM ('NOMINAL', 'DEGRADED_SIGNAL', 'OUT_OF_BOUNDS', 'SENSOR_DISCONNECTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE alert_status AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mission_status AS ENUM ('PLANNING', 'ACTIVE', 'COMPLETED', 'ABORTED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. PROFILES (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    callsign VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'ASTRONAUT',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. MISSIONS
CREATE TABLE IF NOT EXISTS missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(120) NOT NULL,
    target_destination VARCHAR(120) NOT NULL,
    status mission_status NOT NULL DEFAULT 'ACTIVE',
    launch_date TIMESTAMPTZ NOT NULL,
    scheduled_end_date TIMESTAMPTZ NOT NULL,
    actual_end_date TIMESTAMPTZ,
    radiation_threshold_limit_msv NUMERIC(6, 2) NOT NULL DEFAULT 500.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ASTRONAUTS
CREATE TABLE IF NOT EXISTS astronauts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    badge_number VARCHAR(30) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    blood_type VARCHAR(5) NOT NULL,
    height_cm NUMERIC(5, 2) NOT NULL,
    baseline_mass_kg NUMERIC(5, 2) NOT NULL,
    baseline_resting_hr INT NOT NULL DEFAULT 65 CHECK (baseline_resting_hr BETWEEN 30 AND 120),
    baseline_bp_systolic INT NOT NULL DEFAULT 115 CHECK (baseline_bp_systolic BETWEEN 80 AND 160),
    baseline_bp_diastolic INT NOT NULL DEFAULT 75 CHECK (baseline_bp_diastolic BETWEEN 50 AND 100),
    baseline_spo2 INT NOT NULL DEFAULT 98 CHECK (baseline_spo2 BETWEEN 90 AND 100),
    emergency_contact JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MISSION_MEMBERS
CREATE TABLE IF NOT EXISTS mission_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    assigned_role VARCHAR(60) NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (mission_id, astronaut_id)
);

-- 5. TELEMETRY_SOURCES
CREATE TABLE IF NOT EXISTS telemetry_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(80) NOT NULL,
    source_type data_source_type NOT NULL DEFAULT 'SIMULATOR',
    model_identifier VARCHAR(60) NOT NULL,
    firmware_version VARCHAR(40),
    is_hardware BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. SIMULATION_SESSIONS
CREATE TABLE IF NOT EXISTS simulation_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    scenario_id VARCHAR(60) NOT NULL,
    scenario_name VARCHAR(120) NOT NULL,
    started_by UUID NOT NULL REFERENCES profiles(id),
    time_multiplier NUMERIC(3, 1) NOT NULL DEFAULT 1.0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- 7. VITAL_READINGS (Time-series telemetry table)
CREATE TABLE IF NOT EXISTS vital_readings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    simulation_session_id UUID REFERENCES simulation_sessions(id) ON DELETE SET NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    data_source data_source_type NOT NULL DEFAULT 'SIMULATOR',
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
    heart_rate_bpm INT CHECK (heart_rate_bpm BETWEEN 20 AND 250),
    blood_pressure_systolic INT CHECK (blood_pressure_systolic BETWEEN 50 AND 260),
    blood_pressure_diastolic INT CHECK (blood_pressure_diastolic BETWEEN 30 AND 180),
    spo2_percentage INT CHECK (spo2_percentage BETWEEN 50 AND 100),
    respiratory_rate_rpm INT CHECK (respiratory_rate_rpm BETWEEN 4 AND 60),
    core_temp_celsius NUMERIC(4, 2) CHECK (core_temp_celsius BETWEEN 32.00 AND 43.00),
    ecg_rhythm_strip JSONB,
    quality_status quality_status_type NOT NULL DEFAULT 'NOMINAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. RADIATION_LOGS
CREATE TABLE IF NOT EXISTS radiation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL,
    data_source data_source_type NOT NULL DEFAULT 'SIMULATOR',
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
    dosimeter_id VARCHAR(50) NOT NULL,
    ambient_flux_usv_per_hour NUMERIC(8, 3) NOT NULL CHECK (ambient_flux_usv_per_hour >= 0),
    accumulated_dose_msv NUMERIC(8, 4) NOT NULL CHECK (accumulated_dose_msv >= 0),
    solar_particle_event_active BOOLEAN NOT NULL DEFAULT FALSE,
    radiation_type VARCHAR(40) NOT NULL DEFAULT 'GALACTIC_COSMIC',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. SOLAR_EVENTS
CREATE TABLE IF NOT EXISTS solar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    detected_at TIMESTAMPTZ NOT NULL,
    peak_flux_usv_per_hour NUMERIC(8, 3) NOT NULL,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
    flare_classification VARCHAR(20) NOT NULL,
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
    active_countermeasures_taken JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. EXERCISE_LOGS
CREATE TABLE IF NOT EXISTS exercise_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    session_start TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL CHECK (duration_minutes > 0),
    modality VARCHAR(50) NOT NULL,
    avg_heart_rate_bpm INT NOT NULL,
    peak_heart_rate_bpm INT NOT NULL,
    work_load_joules NUMERIC(10, 2),
    calories_burned_kcal INT,
    resistance_load_kg NUMERIC(6, 2),
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. SLEEP_LOGS
CREATE TABLE IF NOT EXISTS sleep_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    sleep_start TIMESTAMPTZ NOT NULL,
    sleep_end TIMESTAMPTZ NOT NULL,
    total_sleep_minutes INT NOT NULL CHECK (total_sleep_minutes > 0),
    rem_minutes INT,
    deep_sleep_minutes INT,
    light_sleep_minutes INT,
    awakenings_count INT NOT NULL DEFAULT 0,
    sleep_quality_score INT CHECK (sleep_quality_score BETWEEN 0 AND 100),
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. WELLNESS_ASSESSMENTS
CREATE TABLE IF NOT EXISTS wellness_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mood_score INT NOT NULL CHECK (mood_score BETWEEN 1 AND 10),
    stress_level INT NOT NULL CHECK (stress_level BETWEEN 1 AND 10),
    fatigue_level INT NOT NULL CHECK (fatigue_level BETWEEN 1 AND 10),
    cognitive_clarity_score INT NOT NULL CHECK (cognitive_clarity_score BETWEEN 1 AND 10),
    is_simulated BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. WELLNESS_JOURNAL_ENTRIES (Strict Personal Privacy)
CREATE TABLE IF NOT EXISTS wellness_journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    journal_text TEXT NOT NULL,
    sentiment_label VARCHAR(40),
    share_with_medical_officer BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. BONE_HEALTH_ASSESSMENTS
CREATE TABLE IF NOT EXISTS bone_health_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL,
    measurement_modality VARCHAR(60) NOT NULL DEFAULT 'DXA_SCAN_SIMULATED',
    femoral_neck_bmd_g_cm2 NUMERIC(4, 3) NOT NULL,
    lumbar_spine_bmd_g_cm2 NUMERIC(4, 3) NOT NULL,
    t_score NUMERIC(3, 1) NOT NULL,
    z_score NUMERIC(3, 1) NOT NULL,
    percentage_loss_from_baseline NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. MUSCLE_HEALTH_ASSESSMENTS
CREATE TABLE IF NOT EXISTS muscle_health_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    assessment_date DATE NOT NULL,
    isometric_grip_strength_kg NUMERIC(4, 1) NOT NULL,
    quadriceps_peak_torque_nm NUMERIC(5, 1) NOT NULL,
    calf_circumference_cm NUMERIC(4, 1) NOT NULL,
    percentage_strength_loss NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    evaluator_id UUID REFERENCES profiles(id),
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. LAB_RESULTS (Biochemical & Hematological)
CREATE TABLE IF NOT EXISTS lab_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    sample_collected_at TIMESTAMPTZ NOT NULL,
    test_type VARCHAR(60) NOT NULL,
    wbc_count_10e3_ul NUMERIC(5, 2),
    lymphocytes_percentage NUMERIC(4, 1),
    neutrophils_percentage NUMERIC(4, 1),
    crp_mg_l NUMERIC(5, 2),
    cortisol_ug_dl NUMERIC(5, 2),
    raw_panel_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. HEALTH_ALERTS (Deterministic Rule Engine Output)
CREATE TABLE IF NOT EXISTS health_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rule_code VARCHAR(60) NOT NULL,
    severity alert_severity NOT NULL,
    status alert_status NOT NULL DEFAULT 'ACTIVE',
    title VARCHAR(160) NOT NULL,
    description TEXT NOT NULL,
    triggering_value VARCHAR(100) NOT NULL,
    baseline_expected VARCHAR(100),
    acknowledged_by UUID REFERENCES profiles(id),
    acknowledged_at TIMESTAMPTZ,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. INCIDENTS
CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    astronaut_id UUID REFERENCES astronauts(id) ON DELETE SET NULL,
    alert_id UUID REFERENCES health_alerts(id) ON DELETE SET NULL,
    incident_number VARCHAR(40) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    severity alert_severity NOT NULL,
    root_cause_category VARCHAR(60) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'INVESTIGATING',
    opened_by UUID NOT NULL REFERENCES profiles(id),
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    action_log JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 19. AI_ANALYSIS_RECORDS
CREATE TABLE IF NOT EXISTS ai_analysis_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    astronaut_id UUID NOT NULL REFERENCES astronauts(id) ON DELETE CASCADE,
    mission_id UUID NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
    report_type VARCHAR(60) NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    prompt_context_summary TEXT NOT NULL,
    ai_response_markdown TEXT NOT NULL,
    model_version VARCHAR(60) NOT NULL,
    disclaimer_acknowledged BOOLEAN NOT NULL DEFAULT TRUE,
    citations_json JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- 20. AUDIT_LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(60) NOT NULL,
    entity_name VARCHAR(60) NOT NULL,
    entity_id UUID NOT NULL,
    ip_address VARCHAR(45),
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- TIME-SERIES AND ACCESS OPTIMIZATION INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_vital_readings_astro_time ON vital_readings(astronaut_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vital_readings_mission_time ON vital_readings(mission_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_radiation_logs_astro_time ON radiation_logs(astronaut_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_health_alerts_active ON health_alerts(mission_id, status) WHERE status = 'ACTIVE';
CREATE INDEX IF NOT EXISTS idx_health_alerts_astro_time ON health_alerts(astronaut_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_astro ON exercise_logs(astronaut_id, session_start DESC);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_astro ON sleep_logs(astronaut_id, sleep_start DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_astro_time ON wellness_assessments(astronaut_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_wellness_journal_astro ON wellness_journal_entries(astronaut_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_time ON audit_logs(user_id, created_at DESC);
