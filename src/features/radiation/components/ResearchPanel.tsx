import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { NASAResearchReference } from '../types/radiationTypes';
import { ExternalLink } from 'lucide-react';

interface ResearchPanelProps {
  references: NASAResearchReference[];
}

export const ResearchPanel: React.FC<ResearchPanelProps> = ({ references }) => {
  return (
    <div className="space-y-6">
      <DossierCard
        title="NASA HUMAN RESEARCH PROGRAM (HRP) SCIENTIFIC EVIDENCE BASE"
        subtitle="PEER-REVIEWED SPACE RADIATION BIOPHYSICS, GCR EPIDEMIOLOGY, AND CLINICAL COUNTERMEASURES"
        action={
          <span className="font-mono text-xs text-astro-text-secondary">
            {references.length} ARCHIVAL REFERENCES GROUNDED
          </span>
        }
      >
        <div className="space-y-4">
          <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
            All biological risk indices, threshold formulas, and shielding calculations in AstroCare are grounded in published scientific datasets from NASA HRP, Johnson Space Center Space Radiation Health Project, and the Artemis Medical Operations consortium.
          </p>

          <div className="space-y-3">
            {references.map((ref) => (
              <div
                key={ref.id}
                className="p-4 bg-astro-bg-surface border border-astro-border-hairline rounded-sm space-y-2 hover:border-astro-sage/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm bg-astro-sage/10 text-astro-sage font-bold uppercase">
                        {ref.nasaProgram}
                      </span>
                      <span className="font-mono text-[10px] text-astro-text-secondary">
                        {ref.id} // {ref.year}
                      </span>
                    </div>
                    <h4 className="font-mono text-xs font-bold text-astro-text-primary leading-snug">
                      {ref.title}
                    </h4>
                    <div className="font-mono text-[10px] text-astro-text-secondary">
                      Authors: {ref.authors}
                    </div>
                  </div>
                  <a
                    href={ref.doiOrUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-astro-text-secondary hover:text-astro-sage border border-astro-border-hairline rounded-sm hover:bg-astro-bg-subtle transition-colors shrink-0 ml-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
                  {ref.summary}
                </p>

                <div className="p-2.5 bg-astro-bg-subtle/50 rounded-sm border border-astro-border-hairline/80">
                  <span className="font-mono text-[10px] text-astro-sage font-bold uppercase block mb-0.5">
                    Key Clinical Finding:
                  </span>
                  <p className="font-body text-xs text-astro-text-primary italic">
                    "{ref.keyFinding}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DossierCard>
    </div>
  );
};
