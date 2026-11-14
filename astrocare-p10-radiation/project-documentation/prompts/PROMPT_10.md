# PROMPT 10 — ASTROCARE
# SPACE RADIATION HEALTH INTELLIGENCE, NASA RADLAB INTEGRATION & PROJECT CONTINUITY

## Specification Summary
Prompt 10 expands AstroCare with an integrated Space Radiation Health Intelligence module, connecting:
1. AstroCare's real-time simulated astronaut health telemetry (virtual dosimeter).
2. Real NASA RadLab radiation telemetry API (`https://visualization.osdr.nasa.gov/radlab/api/`).
3. Real NASA Open Science Data Repository (OSDR) space-biology study discovery (`https://osdr.nasa.gov/`).
4. Real NASA Human Research Program (HRP) evidence reports and cancer risk documentation.
5. Historical radiation exposure analytics, numerical dose integration (trapezoidal rule), and risk awareness.
6. AI-ready structured research information adapter for future Prompt 13 Gemini integration.
7. Swiss Editorial-compliant UI with live dose waveforms, cumulative dose tracking, alert panels, and mission limit projections.

## Target Architecture & Standards
- **Framework:** React 18, TypeScript (strict mode), Tailwind CSS, Lucide icons, Recharts.
- **Physical Quantities:**
  - Absorbed Dose: $\mu\text{Gy}$, $\text{mGy}$, $\text{Gy}$
  - Equivalent Dose: $\mu\text{Sv}$, $\text{mSv}$, $\text{Sv}$
  - Dose Rate: $\mu\text{Sv/h}$
  - Radiation Quality Factor: $Q = 1.7$ (spaceflight mixed field reference)
  - Career Limit: $500\text{ mSv}$ (NASA LEO / Deep Space standard)
- **Data Provenance:**
  - Explicit boolean `isSimulated: true` for simulated virtual crew dosimeter telemetry.
  - Distinct provenance tagging for NASA RadLab historical spacecraft instrument archives (`NASA_RADLAB`).
  - Clear scientific attribution and direct links to NASA OSDR and NASA HRP evidence repositories.
  - Strict medical / clinical disclaimer: Not a certified clinical diagnostic or mission-critical radiation dosimeter.
