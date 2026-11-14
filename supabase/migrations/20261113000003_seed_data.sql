-- ============================================================================
-- ASTROCARE MIGRATION 03: SEED DATA FOR ARES-VI EXPEDITION
-- ============================================================================

-- 1. SEED MISSION
INSERT INTO missions (id, code, name, target_destination, status, launch_date, scheduled_end_date, radiation_threshold_limit_msv)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'ARES-VI',
    'Ares Expedition VI - Deep Space Mars Transit',
    'Mars Jezero Crater Base',
    'ACTIVE',
    '2026-06-24 09:30:00+00',
    '2028-01-15 18:00:00+00',
    500.00
) ON CONFLICT (code) DO NOTHING;

-- 2. SEED TELEMETRY SOURCES
INSERT INTO telemetry_sources (id, name, source_type, model_identifier, firmware_version, is_hardware, status)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'AstroCare Virtual Telemetry Engine', 'SIMULATOR', 'ASTRO-SIM-V2', '2.4.0', FALSE, 'ACTIVE'),
    ('b0000000-0000-0000-0000-000000000002', 'Hexoskin Bio-Vest Sensor Suite', 'HARDWARE_STREAM', 'HEXO-SMART-IV', '4.1.2', TRUE, 'STANDBY'),
    ('b0000000-0000-0000-0000-000000000003', 'BioSticker Continuous Vital Monitor', 'HARDWARE_STREAM', 'BIO-STICK-GEN3', '3.0.8', TRUE, 'STANDBY')
ON CONFLICT DO NOTHING;

-- 3. SEED 7 STANDARDIZED SIMULATION SCENARIOS
INSERT INTO simulation_sessions (id, mission_id, scenario_id, scenario_name, started_by, time_multiplier, is_active, started_at)
SELECT
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000001',
    'SCENARIO_1_NOMINAL',
    'Nominal Baseline Microgravity Operations',
    id,
    1.0,
    TRUE,
    NOW()
FROM profiles LIMIT 1;
