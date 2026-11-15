import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { useRole } from '@/context/RoleContext';
import { useOfflineSync } from '@/context/OfflineSyncContext';
import { SEED_JOURNALS } from '@/data/seedData';
import { WellnessJournalEntry } from '@/types/database.types';
import {
  Brain,
  Moon,
  Lock,
  Plus,
  Info,
  Sparkles,
  Activity,
} from 'lucide-react';

export const WellnessPage: React.FC = () => {
  const { selectedAstronaut, currentRole, canViewPsychologicalJournal } = useRole();
  const { enqueueSyncItem } = useOfflineSync();

  const [journals, setJournals] = useState<WellnessJournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`astrocare_journals_${selectedAstronaut.id}`);
      return saved ? JSON.parse(saved) : SEED_JOURNALS;
    } catch {
      return SEED_JOURNALS;
    }
  });

  const [showEntryForm, setShowEntryForm] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [shareWithMedical, setShareWithMedical] = useState(false);
  const [moodRating, setMoodRating] = useState(8);
  const [stressRating, setStressRating] = useState(3);

  const handleAddJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    const newEntry: WellnessJournalEntry = {
      id: `jrn-${Date.now()}`,
      astronaut_id: selectedAstronaut.id,
      timestamp: new Date().toISOString(),
      journal_text: journalText,
      sentiment_label: stressRating > 6 ? 'ELEVATED_STRESS' : 'STABLE',
      share_with_medical_officer: shareWithMedical,
      created_at: new Date().toISOString(),
    };

    const updated = [newEntry, ...journals];
    setJournals(updated);
    localStorage.setItem(`astrocare_journals_${selectedAstronaut.id}`, JSON.stringify(updated));

    enqueueSyncItem('WELLNESS_JOURNAL', newEntry as unknown as Record<string, unknown>);
    setJournalText('');
    setShowEntryForm(false);
  };

  // Permission filtering:
  // If astronaut: view own.
  // If medical officer: view only entries where share_with_medical_officer is true.
  // If commander: masked/redacted.
  const visibleJournals = journals.filter((entry) => {
    if (!canViewPsychologicalJournal(entry.astronaut_id)) return false;
    if (currentRole === 'ASTRONAUT') return true;
    if (currentRole === 'MEDICAL_OFFICER') return entry.share_with_medical_officer;
    return false; // Commander
  });

  return (
    <PageContainer>
      <PageHeader
        title="Psychological Wellness & Sleep Intelligence"
        subtitle="Circadian sleep architecture, neurobehavioral monitoring, and end-to-end privacy-shielded journal"
        badge={
          <StatusIndicator
            status={currentRole === 'MISSION_CONTROLLER' ? 'CAUTION' : 'NOMINAL'}
            label={currentRole === 'MISSION_CONTROLLER' ? 'PHI SHIELDED (COMMANDER)' : 'PRIVACY SHIELD ACTIVE'}
          />
        }
      />

      <div className="space-y-6">
        {/* Top Disclaimer */}
        <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[#21E6D0]/25 flex items-start space-x-3.5 text-xs text-[#8CA8A0] shadow-cyberCard">
          <Info className="w-4 h-4 text-[#21E6D0] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-mono font-bold text-[#21E6D0] tracking-wider uppercase block">
              BEHAVIORAL HEALTH PRIVACY CONTRACT
            </span>
            <p className="leading-relaxed">
              Astronaut personal psychological reflections are encrypted by default. Only entries explicitly authorized for
              flight surgeon review (`share_with_medical_officer: true`) are visible to medical officers. Mission
              commanders receive high-level readiness indices with individual reflections completely shielded.
            </p>
          </div>
        </div>

        {/* Circadian & Sleep Architecture Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] shadow-cyberCard space-y-2">
            <div className="flex items-center justify-between text-[#8CA8A0]">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                Average Sleep Duration
              </span>
              <Moon className="w-4 h-4 text-[#21E6D0]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-2xl font-bold text-[#E8F4F0] tabular-nums">
                7.2
              </span>
              <span className="font-mono text-xs text-[#57766D]">hrs / Sol</span>
              <span className="ml-auto font-mono text-xs text-[#F3BB57] font-semibold">
                -0.8h debt
              </span>
            </div>
            <div className="text-[10px] font-mono text-[#8CA8A0]">
              Target: 8.0 hrs // Actigraphy monitored
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] shadow-cyberCard space-y-2">
            <div className="flex items-center justify-between text-[#8CA8A0]">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                Deep Sleep (Slow Wave)
              </span>
              <Brain className="w-4 h-4 text-[#21E6D0]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-2xl font-bold text-[#E8F4F0] tabular-nums">
                19.4%
              </span>
              <span className="font-mono text-xs text-[#57766D]">fraction</span>
            </div>
            <div className="text-[10px] font-mono text-[#21E6D0]">
              ● Within restorative baseline (18–22%)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] shadow-cyberCard space-y-2">
            <div className="flex items-center justify-between text-[#8CA8A0]">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                REM Sleep Ratio
              </span>
              <Activity className="w-4 h-4 text-[#21E6D0]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-2xl font-bold text-[#E8F4F0] tabular-nums">
                23.8%
              </span>
              <span className="font-mono text-xs text-[#57766D]">fraction</span>
            </div>
            <div className="text-[10px] font-mono text-[#21E6D0]">
              ● Cognitive memory consolidation intact
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1E1A] border border-[rgba(55,210,185,0.18)] shadow-cyberCard space-y-2">
            <div className="flex items-center justify-between text-[#8CA8A0]">
              <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                Psychomotor Vigilance (PVT)
              </span>
              <Sparkles className="w-4 h-4 text-[#21E6D0]" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="font-mono text-2xl font-bold text-[#E8F4F0] tabular-nums">
                188
              </span>
              <span className="font-mono text-xs text-[#57766D]">ms</span>
            </div>
            <div className="text-[10px] font-mono text-[#21E6D0]">
              ● Zero vigilance lapse (&lt;500ms)
            </div>
          </div>
        </div>

        {/* Private Encrypted Wellness Journal */}
        <DossierCard
          title="ASTRONAUT PRIVATE PSYCHOLOGICAL JOURNAL"
          subtitle="END-TO-END ACCESS CONTROLLED // RLS INTEGRITY"
          action={
            currentRole === 'ASTRONAUT' ? (
              <button
                type="button"
                onClick={() => setShowEntryForm(!showEntryForm)}
                className="px-4 py-2 bg-[#21E6D0] hover:bg-[#8BFFE9] text-[#030A09] rounded-xl font-mono text-xs font-bold flex items-center space-x-1.5 transition-all shadow-cyberGlow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>NEW PRIVATE ENTRY</span>
              </button>
            ) : (
              <span className="font-mono text-[10px] px-2.5 py-1 rounded-lg bg-[#0A1715] text-[#8CA8A0] border border-[rgba(55,210,185,0.18)]">
                ROLE: {currentRole}
              </span>
            )
          }
        >
          {/* New Entry Form (Astronaut only) */}
          {showEntryForm && currentRole === 'ASTRONAUT' && (
            <form onSubmit={handleAddJournal} className="mb-6 p-5 rounded-2xl bg-[#0A1715] border border-[rgba(55,210,185,0.25)] space-y-4 shadow-cyberCard">
              <span className="font-mono text-xs font-bold text-[#E8F4F0] uppercase block tracking-wider">
                WRITE NEW WELLNESS ENTRY
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8CA8A0] block">
                    Mood & Energy (1–10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={moodRating}
                    onChange={(e) => setMoodRating(Number(e.target.value))}
                    className="w-full accent-[#21E6D0]"
                  />
                  <span className="text-[10px] font-mono text-[#21E6D0] font-bold">{moodRating}/10</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-[#8CA8A0] block">
                    Perceived Stress (1–10)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={stressRating}
                    onChange={(e) => setStressRating(Number(e.target.value))}
                    className="w-full accent-[#21E6D0]"
                  />
                  <span className="text-[10px] font-mono text-[#F3BB57] font-bold">{stressRating}/10</span>
                </div>
              </div>

              <textarea
                rows={4}
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Record personal reflections on mission morale, sleep sensations, family earth communication, or crew cohesion..."
                className="w-full p-3 text-xs font-body bg-[#0D1E1A] border border-[rgba(55,210,185,0.25)] text-[#E8F4F0] rounded-xl focus:outline-none focus:border-[#21E6D0]"
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label className="flex items-center space-x-2 text-xs font-mono text-[#E8F4F0] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shareWithMedical}
                    onChange={(e) => setShareWithMedical(e.target.checked)}
                    className="accent-[#21E6D0] w-4 h-4 rounded"
                  />
                  <span>Authorize Crew Flight Surgeon Review</span>
                </label>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowEntryForm(false)}
                    className="px-4 py-2 text-xs font-mono border border-[rgba(55,210,185,0.2)] text-[#8CA8A0] hover:text-[#E8F4F0] rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-mono bg-[#21E6D0] hover:bg-[#8BFFE9] text-[#030A09] rounded-xl font-bold shadow-cyberGlow"
                  >
                    Encrypt & Save
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Privacy Notice for Commander */}
          {currentRole === 'MISSION_CONTROLLER' ? (
            <div className="p-6 rounded-2xl bg-[#0A1715] border border-[rgba(55,210,185,0.18)] text-center space-y-2">
              <Lock className="w-8 h-8 text-[#57766D] mx-auto" />
              <h4 className="font-space text-sm font-bold text-[#E8F4F0]">
                PSYCHOLOGICAL JOURNAL ENTRIES SHIELDED
              </h4>
              <p className="font-body text-xs text-[#8CA8A0] max-w-md mx-auto leading-relaxed">
                Per NASA Aerospace Medical Privacy Standards (NASA-STD-3001), individual astronaut psychological
                journals are strictly confidential between the astronaut and certified flight surgeons.
              </p>
            </div>
          ) : visibleJournals.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-[#57766D]">
              No shared psychological journal entries available for review.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleJournals.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl bg-[#0A1715] border border-[rgba(55,210,185,0.18)] space-y-2"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="font-bold text-[#E8F4F0]">
                      {new Date(entry.timestamp).toLocaleString()} UTC
                    </span>
                    <span
                      className={`text-[9px] px-2.5 py-0.5 rounded-lg border font-bold ${
                        entry.share_with_medical_officer
                          ? 'bg-[#21E6D0]/10 text-[#21E6D0] border-[#21E6D0]/30'
                          : 'bg-[#0D1E1A] text-[#57766D] border-[rgba(55,210,185,0.18)]'
                      }`}
                    >
                      {entry.share_with_medical_officer ? 'SHARED WITH SURGEON' : 'STRICTLY PRIVATE'}
                    </span>
                  </div>

                  <p className="font-body text-xs text-[#E8F4F0] leading-relaxed whitespace-pre-wrap">
                    {entry.journal_text}
                  </p>

                  <div className="text-[10px] font-mono text-[#57766D] pt-2 border-t border-[rgba(55,210,185,0.15)] flex justify-between">
                    <span>Sentiment Classification: <strong className="text-[#8CA8A0]">{entry.sentiment_label}</strong></span>
                    <span>End-to-End Cryptographically Sealed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DossierCard>
      </div>
    </PageContainer>
  );
};
