import React, { useState, useEffect } from 'react';
import { useRole } from '@/context/RoleContext';
import { useOfflineSync } from '@/context/OfflineSyncContext';
import { SEED_SELF_ASSESSMENTS } from '@/data/seedData';
import { DailySelfAssessment as SelfAssessmentType } from '@/types/database.types';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import {
  AlertTriangle,
  Send,
  Info,
  CheckCircle2,
} from 'lucide-react';

export const DailySelfAssessment: React.FC = () => {
  const { selectedAstronaut } = useRole();
  const { enqueueSyncItem } = useOfflineSync();

  // Load existing records or local drafts
  const [history, setHistory] = useState<SelfAssessmentType[]>(() => {
    try {
      const saved = localStorage.getItem(`astrocare_self_assessments_${selectedAstronaut.id}`);
      return saved ? JSON.parse(saved) : SEED_SELF_ASSESSMENTS;
    } catch {
      return SEED_SELF_ASSESSMENTS;
    }
  });

  // Current Form State
  const [wellbeing, setWellbeing] = useState<number>(8);
  const [sleepQuality, setSleepQuality] = useState<number>(7);
  const [sleepHours, setSleepHours] = useState<number>(7.0);
  const [fatigue, setFatigue] = useState<number>(3);
  const [painLevel, setPainLevel] = useState<number>(1);
  const [painLocations, setPainLocations] = useState<string[]>([]);
  const [dizziness, setDizziness] = useState<boolean>(false);
  const [visionChanges, setVisionChanges] = useState<boolean>(false);
  const [stress, setStress] = useState<number>(3);
  const [mood, setMood] = useState<number>(8);
  const [exerciseCompleted, setExerciseCompleted] = useState<boolean>(true);
  const [exerciseDuration, setExerciseDuration] = useState<number>(120);
  const [notes, setNotes] = useState<string>('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Auto-save draft in localStorage
  useEffect(() => {
    const draft = {
      wellbeing,
      sleepQuality,
      sleepHours,
      fatigue,
      painLevel,
      painLocations,
      dizziness,
      visionChanges,
      stress,
      mood,
      exerciseCompleted,
      exerciseDuration,
      notes,
    };
    localStorage.setItem(`astrocare_draft_assessment_${selectedAstronaut.id}`, JSON.stringify(draft));
  }, [
    wellbeing,
    sleepQuality,
    sleepHours,
    fatigue,
    painLevel,
    painLocations,
    dizziness,
    visionChanges,
    stress,
    mood,
    exerciseCompleted,
    exerciseDuration,
    notes,
    selectedAstronaut.id,
  ]);

  const togglePainLocation = (loc: string) => {
    setPainLocations((prev) =>
      prev.includes(loc) ? prev.filter((p) => p !== loc) : [...prev, loc]
    );
  };

  const isEscalationTriggered = dizziness || visionChanges || painLevel >= 6 || fatigue >= 8;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRecord: SelfAssessmentType = {
      id: `sa-${Date.now()}`,
      astronaut_id: selectedAstronaut.id,
      date: new Date().toISOString().split('T')[0],
      overall_wellbeing: wellbeing,
      sleep_quality: sleepQuality,
      sleep_hours: sleepHours,
      fatigue_level: fatigue,
      pain_level: painLevel,
      pain_locations: painLocations,
      dizziness_or_vertigo: dizziness,
      vision_changes: visionChanges,
      stress_level: stress,
      mood_score: mood,
      exercise_completed: exerciseCompleted,
      exercise_duration_minutes: exerciseDuration,
      notes,
      escalated_to_medical: isEscalationTriggered,
      escalation_reason: isEscalationTriggered
        ? `${dizziness ? 'Vertigo reported. ' : ''}${visionChanges ? 'Vision alteration reported. ' : ''}${
            painLevel >= 6 ? 'Significant pain reported. ' : ''
          }`.trim()
        : undefined,
      created_at: new Date().toISOString(),
    };

    const updated = [newRecord, ...history];
    setHistory(updated);
    localStorage.setItem(
      `astrocare_self_assessments_${selectedAstronaut.id}`,
      JSON.stringify(updated)
    );

    // Enqueue in offline sync queue
    enqueueSyncItem('SELF_ASSESSMENT', newRecord as unknown as Record<string, unknown>);

    setSubmittedMessage(
      isEscalationTriggered
        ? 'Daily assessment logged. CONCERNING SYMPTOMS FLAGGED: Medical review notification dispatched to Flight Surgeon.'
        : 'Daily assessment submitted successfully. Vitals baseline updated.'
    );

    setTimeout(() => setSubmittedMessage(null), 6000);
  };

  const painOptions = ['Lumbar Spine', 'Neck / Cervical', 'Shoulders', 'Knees', 'Head / Sinus', 'Feet / Calcaneus'];

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="p-3.5 rounded-sm bg-astro-bg-subtle/80 border border-astro-border-hairline flex items-start space-x-3 text-xs text-astro-text-secondary">
        <Info className="w-4 h-4 text-astro-text-primary shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-astro-text-primary">ASSESSMENT PROTOCOL GUIDANCE:</span> Daily
          self-assessments provide subjective grounding for continuous sensor telemetry. If acute pain, visual
          disturbances, or persistent disorientation occur, the system automatically routes observation alerts to the
          onboard medical station.
        </div>
      </div>

      {submittedMessage && (
        <div
          className={`p-4 rounded-sm border text-xs font-mono flex items-center space-x-2 ${
            isEscalationTriggered
              ? 'bg-astro-status-caution/15 border-astro-status-caution text-astro-status-caution'
              : 'bg-astro-status-healthy/15 border-astro-status-healthy text-astro-status-healthy'
          }`}
        >
          {isEscalationTriggered ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{submittedMessage}</span>
        </div>
      )}

      {/* Guided Self-Assessment Form */}
      <DossierCard
        title={`DAILY HEALTH SELF-ASSESSMENT // ${selectedAstronaut.profile?.full_name.toUpperCase()}`}
        subtitle="ASTRONAUT SUBJECTIVE WELLNESS CHECK-IN PROTOCOL"
        action={
          <StatusIndicator
            status={isEscalationTriggered ? 'CAUTION' : 'NOMINAL'}
            label={isEscalationTriggered ? 'ESCALATION CRITERIA MET' : 'ROUTINE CHECK-IN'}
          />
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          {/* Section 1: Wellbeing, Sleep & Fatigue */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-sm bg-astro-bg-subtle/30 border border-astro-border-hairline">
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-semibold text-astro-text-primary block">
                1. Overall Wellbeing (1–10)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={wellbeing}
                  onChange={(e) => setWellbeing(Number(e.target.value))}
                  className="w-full accent-astro-text-primary"
                />
                <span className="font-mono text-xs font-bold text-astro-text-primary w-6 text-right">
                  {wellbeing}
                </span>
              </div>
              <span className="text-[10px] font-mono text-astro-text-tertiary">
                {wellbeing >= 8 ? 'Optimal' : wellbeing >= 5 ? 'Moderate' : 'Impaired'}
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-semibold text-astro-text-primary block">
                2. Sleep Duration (Hours)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  step="0.5"
                  min="3"
                  max="12"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full px-2.5 py-1 text-xs font-mono bg-[#06110F] border border-[rgba(55,210,185,0.2)] text-[#E8F4F0] rounded-sm focus:border-[#21E6D0] outline-none"
                />
                <span className="font-mono text-xs text-astro-text-secondary">hrs</span>
              </div>
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-[10px] font-mono text-astro-text-tertiary">Quality:</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(Number(e.target.value))}
                  className="w-20 accent-astro-text-primary"
                />
                <span className="text-[10px] font-mono font-bold text-astro-text-primary">{sleepQuality}/10</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-semibold text-astro-text-primary block">
                3. Physical Fatigue Level (1–10)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={fatigue}
                  onChange={(e) => setFatigue(Number(e.target.value))}
                  className="w-full accent-astro-text-primary"
                />
                <span className="font-mono text-xs font-bold text-astro-text-primary w-6 text-right">
                  {fatigue}
                </span>
              </div>
              <span className="text-[10px] font-mono text-astro-text-tertiary">
                {fatigue >= 7 ? 'High Exhaustion' : fatigue >= 4 ? 'Moderate' : 'Rested'}
              </span>
            </div>
          </div>

          {/* Section 2: Pain & Neuro-Vestibular Symptoms */}
          <div className="p-4 rounded-sm bg-astro-bg-subtle/30 border border-astro-border-hairline space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="font-mono text-xs font-semibold text-astro-text-primary">
                4. Pain / Discomfort Intensity (0–10)
              </label>
              <div className="flex items-center space-x-3 w-48">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full accent-astro-text-primary"
                />
                <span className="font-mono text-xs font-bold text-astro-text-primary w-6 text-right">
                  {painLevel}
                </span>
              </div>
            </div>

            {/* Pain Location Selector */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-astro-text-secondary">
                Anatomical Location of Discomfort (if applicable):
              </span>
              <div className="flex flex-wrap gap-2">
                {painOptions.map((loc) => {
                  const selected = painLocations.includes(loc);
                  return (
                    <button
                      type="button"
                      key={loc}
                      onClick={() => togglePainLocation(loc)}
                      className={`px-2.5 py-1 text-xs font-mono rounded-sm border transition-colors ${
                        selected
                          ? 'bg-[#21E6D0] text-[#030A09] font-bold border-[#21E6D0]'
                          : 'bg-[#06110F] text-[#8CA8A0] border-[rgba(55,210,185,0.2)] hover:border-[#21E6D0]/50 hover:text-[#E8F4F0]'
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Critical SANS & Vertigo Checkboxes */}
            <div className="pt-2 border-t border-astro-border-hairline grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center space-x-2 text-xs font-mono text-astro-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={dizziness}
                  onChange={(e) => setDizziness(e.target.checked)}
                  className="accent-astro-status-caution w-4 h-4"
                />
                <span className={dizziness ? 'text-astro-status-caution font-bold' : ''}>
                  Unusual Dizziness / Spatial Vertigo
                </span>
              </label>

              <label className="flex items-center space-x-2 text-xs font-mono text-astro-text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={visionChanges}
                  onChange={(e) => setVisionChanges(e.target.checked)}
                  className="accent-astro-status-caution w-4 h-4"
                />
                <span className={visionChanges ? 'text-astro-status-caution font-bold' : ''}>
                  Vision Blurring / SANS Globe Fullness
                </span>
              </label>
            </div>
          </div>

          {/* Section 3: Stress, Mood, & Exercise */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-sm bg-astro-bg-subtle/30 border border-astro-border-hairline">
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-semibold text-astro-text-primary block">
                5. Perceived Stress (1–10)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={stress}
                  onChange={(e) => setStress(Number(e.target.value))}
                  className="w-full accent-astro-text-primary"
                />
                <span className="font-mono text-xs font-bold text-astro-text-primary w-6 text-right">
                  {stress}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-semibold text-astro-text-primary block">
                6. Emotional Resilience (1–10)
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={mood}
                  onChange={(e) => setMood(Number(e.target.value))}
                  className="w-full accent-astro-text-primary"
                />
                <span className="font-mono text-xs font-bold text-astro-text-primary w-6 text-right">
                  {mood}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-xs font-semibold text-astro-text-primary block">
                7. Countermeasure Workout
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={exerciseCompleted}
                  onChange={(e) => setExerciseCompleted(e.target.checked)}
                  className="accent-astro-text-primary w-4 h-4"
                />
                <span className="text-xs font-mono text-astro-text-primary">
                  Completed
                </span>
                {exerciseCompleted && (
                  <div className="flex items-center space-x-1 pl-2">
                    <input
                      type="number"
                      min="15"
                      max="240"
                      step="15"
                      value={exerciseDuration}
                      onChange={(e) => setExerciseDuration(Number(e.target.value))}
                      className="w-16 px-1.5 py-0.5 text-xs font-mono bg-[#06110F] border border-[rgba(55,210,185,0.2)] text-[#E8F4F0] rounded-sm focus:border-[#21E6D0] outline-none"
                    />
                    <span className="text-[10px] font-mono text-astro-text-tertiary">min</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 4: Qualitative Subjective Notes */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-semibold text-astro-text-primary block">
              8. Subjective Health Notes & Mission Context
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record any microgravity adaptation sensations, sleep disruptions, hydration comments, or equipment ergonomic notes..."
              className="w-full p-3 text-xs font-body bg-[#06110F] border border-[rgba(55,210,185,0.2)] text-[#E8F4F0] placeholder:text-[#57766D] rounded-sm focus:outline-none focus:border-[#21E6D0]"
            />
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[rgba(55,210,185,0.15)]">
            <span className="text-[11px] font-mono text-astro-text-tertiary">
              Draft auto-saved to local offline storage
            </span>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                type="submit"
                className={`w-full sm:w-auto px-5 py-2 rounded-sm text-xs font-mono font-semibold transition-all flex items-center justify-center space-x-2 ${
                  isEscalationTriggered
                    ? 'bg-[#FF6475] text-white hover:brightness-110'
                    : 'bg-[#21E6D0] text-[#030A09] hover:bg-[#00AFA0] hover:text-white'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isEscalationTriggered ? 'SUBMIT & ESCALATE TO SURGEON' : 'SUBMIT DAILY ASSESSMENT'}
                </span>
              </button>
            </div>
          </div>
        </form>
      </DossierCard>

      {/* Historical Assessment Timeline */}
      <DossierCard
        title="HISTORICAL DAILY CHECK-IN TIMELINE"
        subtitle="PREVIOUS 7-SOL SUBJECTIVE HEALTH TRENDS"
      >
        <div className="space-y-3 pt-2">
          {history.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-sm bg-[#06110F] border border-[rgba(55,210,185,0.18)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="font-bold text-astro-text-primary">{item.date}</span>
                  <span className="text-astro-text-tertiary">|</span>
                  <span className="text-astro-text-secondary">Wellbeing: {item.overall_wellbeing}/10</span>
                  <span className="text-astro-text-tertiary">|</span>
                  <span className="text-astro-text-secondary">Sleep: {item.sleep_hours}h</span>
                  <span className="text-astro-text-tertiary">|</span>
                  <span className="text-astro-text-secondary">Fatigue: {item.fatigue_level}/10</span>
                </div>
                <p className="font-body text-astro-text-secondary line-clamp-1 italic">
                  "{item.notes || 'No qualitative notes recorded.'}"
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {item.escalated_to_medical ? (
                  <span className="px-2 py-0.5 rounded-sm font-mono text-[9px] bg-astro-status-caution/15 text-astro-status-caution border border-astro-status-caution/30 font-bold">
                    ESCALATED
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-sm font-mono text-[9px] bg-astro-status-healthy/15 text-astro-status-healthy border border-astro-status-healthy/30">
                    NOMINAL
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </DossierCard>
    </div>
  );
};
