-- ============================================================================
-- ASTROCARE MIGRATION 02: ROW LEVEL SECURITY & ACCESS POLICIES
-- ============================================================================

-- ENABLE RLS ACROSS SENSITIVE TABLES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE astronauts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE vital_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE radiation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wellness_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bone_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE muscle_health_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analysis_records ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- HELPER SECURITY FUNCTIONS
-- ============================================================================

-- Returns the authenticated user's assigned role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Returns the astronaut ID associated with the current authenticated user (if any)
CREATE OR REPLACE FUNCTION get_current_astronaut_id()
RETURNS UUID AS $$
    SELECT id FROM astronauts WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Checks if the authenticated user is a manifested member of a given mission
CREATE OR REPLACE FUNCTION is_user_in_mission(p_mission_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM mission_members mm
        JOIN astronauts a ON mm.astronaut_id = a.id
        WHERE mm.mission_id = p_mission_id AND a.profile_id = auth.uid()
    ) OR (
        -- Medical Officers and Mission Controllers have operational oversight
        get_current_user_role() IN ('MEDICAL_OFFICER', 'MISSION_CONTROLLER')
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ============================================================================
-- 1. PROFILES POLICIES
-- ============================================================================
CREATE POLICY "Profiles readable by authenticated mission personnel"
ON profiles FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Users can only modify own profile"
ON profiles FOR UPDATE TO authenticated
USING (auth.uid() = id);

-- ============================================================================
-- 2. MISSIONS & MEMBERS POLICIES
-- ============================================================================
CREATE POLICY "Missions visible to authenticated personnel"
ON missions FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Mission members visible to authenticated personnel"
ON mission_members FOR SELECT TO authenticated
USING (true);

-- ============================================================================
-- 3. ASTRONAUTS POLICIES
-- ============================================================================
CREATE POLICY "Astronaut records readable by authenticated crew and controllers"
ON astronauts FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Only Medical Officers can insert or update astronaut medical baselines"
ON astronauts FOR ALL TO authenticated
USING (get_current_user_role() = 'MEDICAL_OFFICER');

-- ============================================================================
-- 4. VITAL READINGS & RADIATION POLICIES
-- ============================================================================
-- All authenticated users in the mission can observe real-time telemetry
CREATE POLICY "Telemetry readable by assigned crew and flight control"
ON vital_readings FOR SELECT TO authenticated
USING (is_user_in_mission(mission_id));

-- Telemetry insertions allowed by Medical Officers, Controllers, or Simulation Engine
CREATE POLICY "Telemetry insertion gated to medical officers and simulation"
ON vital_readings FOR INSERT TO authenticated
WITH CHECK (
    get_current_user_role() IN ('MEDICAL_OFFICER', 'MISSION_CONTROLLER')
    OR is_simulated = TRUE
);

CREATE POLICY "Radiation logs readable by authenticated mission personnel"
ON radiation_logs FOR SELECT TO authenticated
USING (is_user_in_mission(mission_id));

-- ============================================================================
-- 5. WELLNESS JOURNAL ACCESS: STRICT USER-LEVEL PRIVACY GATING
-- ============================================================================
-- Astronauts have unrestricted access to their own private journals
CREATE POLICY "Astronauts full access to own private wellness journals"
ON wellness_journal_entries FOR ALL TO authenticated
USING (astronaut_id = get_current_astronaut_id());

-- Medical Officers can ONLY view journal entries if explicitly consented by astronaut
CREATE POLICY "Medical Officers view consented journal entries only"
ON wellness_journal_entries FOR SELECT TO authenticated
USING (
    get_current_user_role() = 'MEDICAL_OFFICER'
    AND share_with_medical_officer = TRUE
);

-- Note: Mission Controllers have NO policy granted for wellness_journal_entries,
-- resulting in an automatic denial (0 rows returned) at the PostgreSQL engine level.

-- General wellness scores (mood, fatigue) are accessible to flight surgeons for crew readiness
CREATE POLICY "Wellness scores viewable by medical officers and author"
ON wellness_assessments FOR SELECT TO authenticated
USING (
    astronaut_id = get_current_astronaut_id()
    OR get_current_user_role() = 'MEDICAL_OFFICER'
);

CREATE POLICY "Astronauts can submit own wellness check-in"
ON wellness_assessments FOR INSERT TO authenticated
WITH CHECK (astronaut_id = get_current_astronaut_id());

-- ============================================================================
-- 6. HEALTH ASSESSMENTS & LABS (Bone, Muscle, Labs)
-- ============================================================================
CREATE POLICY "Medical records readable by subject astronaut and flight surgeons"
ON bone_health_assessments FOR SELECT TO authenticated
USING (
    astronaut_id = get_current_astronaut_id()
    OR get_current_user_role() = 'MEDICAL_OFFICER'
);

CREATE POLICY "Only Medical Officers can log DXA bone health assessments"
ON bone_health_assessments FOR INSERT TO authenticated
WITH CHECK (get_current_user_role() = 'MEDICAL_OFFICER');

CREATE POLICY "Muscle health assessments viewable by subject and surgeons"
ON muscle_health_assessments FOR SELECT TO authenticated
USING (
    astronaut_id = get_current_astronaut_id()
    OR get_current_user_role() = 'MEDICAL_OFFICER'
);

CREATE POLICY "Lab results viewable by subject and flight surgeons"
ON lab_results FOR SELECT TO authenticated
USING (
    astronaut_id = get_current_astronaut_id()
    OR get_current_user_role() = 'MEDICAL_OFFICER'
);

-- ============================================================================
-- 7. ALERTS & INCIDENTS (Flight Safety)
-- ============================================================================
CREATE POLICY "Health alerts readable by all mission personnel"
ON health_alerts FOR SELECT TO authenticated
USING (is_user_in_mission(mission_id));

CREATE POLICY "Alert acknowledgements and updates restricted to medical officers & controllers"
ON health_alerts FOR UPDATE TO authenticated
USING (get_current_user_role() IN ('MEDICAL_OFFICER', 'MISSION_CONTROLLER'));

CREATE POLICY "Incidents readable by all authenticated mission personnel"
ON incidents FOR SELECT TO authenticated
USING (is_user_in_mission(mission_id));

CREATE POLICY "Incidents managed by Medical Officers and Flight Directors"
ON incidents FOR ALL TO authenticated
USING (get_current_user_role() IN ('MEDICAL_OFFICER', 'MISSION_CONTROLLER'));

-- ============================================================================
-- 8. AI ANALYSIS RECORDS
-- ============================================================================
CREATE POLICY "AI reports accessible to flight surgeons and requesting astronaut"
ON ai_analysis_records FOR SELECT TO authenticated
USING (
    astronaut_id = get_current_astronaut_id()
    OR get_current_user_role() IN ('MEDICAL_OFFICER', 'MISSION_CONTROLLER')
);
