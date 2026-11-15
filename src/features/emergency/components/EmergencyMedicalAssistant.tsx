import React, { useState } from 'react';
import { useRole } from '@/context/RoleContext';
import { SEED_MEDICAL_PROTOCOLS } from '@/data/seedData';
import { MedicalProtocol } from '@/types/database.types';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import {
  AlertOctagon,
  Search,
  CheckCircle2,
  AlertTriangle,
  Radio,
} from 'lucide-react';

export const EmergencyMedicalAssistant: React.FC = () => {
  const { currentRole, selectedAstronaut } = useRole();
  const [protocols] = useState<MedicalProtocol[]>(SEED_MEDICAL_PROTOCOLS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('proto-001');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [incidentReported, setIncidentReported] = useState(false);

  const filteredProtocols = protocols.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.indications.some((ind) => ind.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeProtocol =
    protocols.find((p) => p.id === selectedProtocolId) || protocols[0];

  const toggleStep = (stepNum: number) => {
    setCompletedSteps((prev) =>
      prev.includes(stepNum) ? prev.filter((s) => s !== stepNum) : [...prev, stepNum]
    );
  };

  const handleTriggerIncidentAlert = () => {
    setIncidentReported(true);
    setTimeout(() => setIncidentReported(false), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Critical Medical Emergency Banner */}
      <div className="p-4 rounded-sm bg-astro-status-critical/10 border border-astro-status-critical/40 flex items-start justify-between gap-4">
        <div className="flex items-start space-x-3">
          <AlertOctagon className="w-5 h-5 text-astro-status-critical shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-display text-xs font-bold text-astro-status-critical tracking-wider uppercase">
              SPACE MEDICAL EMERGENCY CONTINGENCY PROTOCOL
            </h3>
            <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
              Approved version-controlled clinical emergency protocols for deep-space missions. Protocols are curated by
              NASA Flight Medicine and operational medical controllers. AI layer provides retrieval indexing only and
              does not synthesize novel intervention procedures.
            </p>
            <div className="font-mono text-[10px] text-astro-text-secondary pt-1">
              OPERATOR ROLE: <strong className="text-astro-text-primary">{currentRole}</strong> | SUBJECT: <strong className="text-astro-text-primary">{selectedAstronaut.profile?.full_name}</strong>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleTriggerIncidentAlert}
          className="shrink-0 px-4 py-2 bg-astro-status-critical text-white rounded-sm font-mono text-xs font-bold hover:brightness-110 flex items-center space-x-2 shadow-sm"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span>BROADCAST RED ALERT</span>
        </button>
      </div>

      {incidentReported && (
        <div className="p-3.5 rounded-sm bg-astro-status-critical/20 border border-astro-status-critical text-xs font-mono text-astro-status-critical flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            EMERGENCY NOTIFICATION DISPATCHED: Ground Flight Surgeon and Crew Medical Officer alerted with telemetry
            snapshot.
          </span>
        </div>
      )}

      {/* Protocol Search and Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Protocol Catalog */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#57766D]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by symptom, code (NASA-MED), or title..."
              className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-[#06110F] border border-[rgba(55,210,185,0.2)] text-[#E8F4F0] placeholder:text-[#57766D] rounded-sm focus:outline-none focus:border-[#21E6D0]"
            />
          </div>

          <div className="space-y-2">
            {filteredProtocols.map((proto) => {
              const isSelected = proto.id === selectedProtocolId;
              return (
                <div
                  key={proto.id}
                  onClick={() => {
                    setSelectedProtocolId(proto.id);
                    setCompletedSteps([]);
                  }}
                  className={`p-3.5 rounded-sm border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0C2521] border-[#21E6D0] shadow-lg ring-1 ring-[#21E6D0]'
                      : 'bg-[#06110F] border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] font-bold text-astro-text-tertiary">
                      {proto.code} // v{proto.version}
                    </span>
                    <span
                      className={`font-mono text-[9px] px-1.5 py-0.2 rounded-sm border ${
                        proto.severity === 'CRITICAL'
                          ? 'bg-astro-status-critical/10 text-astro-status-critical border-astro-status-critical/30'
                          : 'bg-astro-status-caution/10 text-astro-status-caution border-astro-status-caution/30'
                      }`}
                    >
                      {proto.severity}
                    </span>
                  </div>

                  <h4 className="font-display text-xs font-bold text-astro-text-primary">
                    {proto.title}
                  </h4>

                  <div className="mt-2 text-[10px] font-mono text-astro-text-secondary truncate">
                    Indications: {proto.indications.join('; ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Step-by-Step Interactive Protocol Execution */}
        <div className="lg:col-span-7">
          <DossierCard
            title={`${activeProtocol.code} // ${activeProtocol.title.toUpperCase()}`}
            subtitle={`VERSION ${activeProtocol.version} | ESCALATION CHANNEL: ${activeProtocol.escalation_channel}`}
            action={
              <StatusIndicator
                status={activeProtocol.severity === 'CRITICAL' ? 'CRITICAL' : 'CAUTION'}
                label={activeProtocol.category}
              />
            }
          >
            <div className="space-y-6 pt-2">
              {/* Clinical Indications */}
              <div className="p-3.5 rounded-sm bg-astro-bg-subtle/50 border border-astro-border-hairline space-y-1.5">
                <span className="font-mono text-[10px] font-bold text-astro-text-primary uppercase block">
                  PRIMARY CLINICAL INDICATIONS
                </span>
                <ul className="space-y-1 text-xs font-body text-astro-text-secondary">
                  {activeProtocol.indications.map((ind, i) => (
                    <li key={i} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-astro-status-caution" />
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-astro-text-primary uppercase">
                    INTERACTIVE ACTION CHECKLIST ({completedSteps.length}/{activeProtocol.steps.length} COMPLETED)
                  </span>
                  <span className="text-[10px] font-mono text-astro-text-tertiary">
                    Click step to confirm execution
                  </span>
                </div>

                <div className="space-y-2">
                  {activeProtocol.steps.map((st) => {
                    const isDone = completedSteps.includes(st.stepNumber);
                    return (
                      <div
                        key={st.stepNumber}
                        onClick={() => toggleStep(st.stepNumber)}
                        className={`p-3 rounded-sm border cursor-pointer flex items-start space-x-3 transition-colors ${
                          isDone
                            ? 'bg-[#00AFA0]/10 border-[#00AFA0]/40'
                            : 'bg-[#06110F] border-[rgba(55,210,185,0.18)] hover:border-[#21E6D0]/50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-sm border flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5 ${
                            isDone
                              ? 'bg-[#00AFA0] text-[#030A09] border-[#00AFA0]'
                              : 'bg-[#0A1715] text-[#8CA8A0] border-[rgba(55,210,185,0.2)]'
                          }`}
                        >
                          {st.stepNumber}
                        </div>

                        <div className="space-y-0.5 flex-1">
                          <p
                            className={`text-xs font-body leading-relaxed ${
                              isDone ? 'line-through text-astro-text-tertiary' : 'text-astro-text-primary'
                            }`}
                          >
                            {st.instruction}
                          </p>
                          {st.critical && (
                            <span className="font-mono text-[9px] text-astro-status-critical font-bold uppercase">
                              [CRITICAL SAFETY STEP]
                            </span>
                          )}
                        </div>

                        {isDone && <CheckCircle2 className="w-4 h-4 text-astro-status-healthy shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contraindications */}
              {activeProtocol.contraindications.length > 0 && (
                <div className="p-3 rounded-sm bg-astro-status-caution/10 border border-astro-status-caution/30 text-xs font-body text-astro-text-secondary">
                  <span className="font-mono font-bold text-astro-status-caution uppercase block mb-1">
                    CONTRAINDICATIONS & RESTRICTIONS:
                  </span>
                  {activeProtocol.contraindications.join('; ')}
                </div>
              )}
            </div>
          </DossierCard>
        </div>
      </div>
    </div>
  );
};
