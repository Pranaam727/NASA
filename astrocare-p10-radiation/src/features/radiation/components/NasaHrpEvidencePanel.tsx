import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { ExternalLink, ShieldCheck, Check } from 'lucide-react';
import { HrpEvidenceReference } from '../types/radiationTypes';

interface NasaHrpEvidencePanelProps {
  evidenceRecords: HrpEvidenceReference[];
}

export const NasaHrpEvidencePanel: React.FC<NasaHrpEvidencePanelProps> = ({
  evidenceRecords,
}) => {
  return (
    <DossierCard
      title="NASA Human Research Program (HRP) Evidence & Space Radiation Risks"
      subtitle="HUMAN SPACEFLIGHT RISK MATRIX // NASA HUMAN RESEARCH ROADMAP EVIDENCE BASE"
      badge={
        <a
          href="https://humanresearchroadmap.nasa.gov/evidence/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 font-mono text-xs text-astro-ink hover:underline"
        >
          <span>NASA HRP Roadmap</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      }
    >
      <div className="space-y-4">
        <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
          The NASA Human Research Program conducts research and develops countermeasures to protect astronauts from space radiation risks during long-duration Artemis and Mars exploration missions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {evidenceRecords.map((ev) => (
            <div
              key={ev.id}
              className="p-3.5 bg-[#F3F0E8] border border-astro-border-hairline rounded flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-[#D16C48] block mb-1">
                  {ev.riskCategory}
                </span>

                <h4 className="font-heading font-semibold text-xs text-astro-ink leading-snug">
                  {ev.title}
                </h4>

                <p className="font-body text-xs text-astro-text-secondary mt-1.5 leading-relaxed">
                  {ev.summary}
                </p>

                <div className="mt-2.5 pt-2 border-t border-astro-border-hairline space-y-1">
                  {ev.keyFindings.map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-[11px] font-body text-astro-ink">
                      <Check className="w-3 h-3 text-astro-status-healthy mt-0.5 shrink-0" />
                      <span>{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-astro-border-hairline flex items-center justify-between">
                <span className="text-[10px] font-mono text-astro-text-secondary">
                  Updated: {ev.lastUpdated}
                </span>

                <a
                  href={ev.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] font-mono text-[#D16C48] hover:underline"
                >
                  <span>Evidence Report</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-[#EAE6DC]/60 rounded border border-astro-border-hairline flex items-center gap-2 text-xs font-mono text-astro-text-secondary">
          <ShieldCheck className="w-4 h-4 text-astro-status-healthy shrink-0" />
          <span>
            Countermeasure research links active shielding, onboard storm shelter protocols, and biological antioxidants to mission health readiness.
          </span>
        </div>
      </div>
    </DossierCard>
  );
};
