import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { BiologicalRiskEvaluation, RadiationDoseReading } from '../types/radiationTypes';
import { Dna, Heart, Eye, Brain } from 'lucide-react';

interface BiologicalRiskPanelProps {
  risk: BiologicalRiskEvaluation;
  reading: RadiationDoseReading;
}

export const BiologicalRiskPanel: React.FC<BiologicalRiskPanelProps> = ({ risk, reading }) => {
  return (
    <div className="space-y-6">
      <DossierCard
        title="SPACEFLIGHT BIOLOGICAL RISK & TISSUE VULNERABILITY MODEL"
        subtitle="NASA NSCR-2022 BIO-PHYSICAL TARGET DEGRADATION CROSS-SECTIONS"
        action={
          <span className="font-mono text-xs text-astro-text-secondary">
            REID CONFIDENCE: 95% CI
          </span>
        }
      >
        <div className="space-y-6">
          {/* Career Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-mono text-xs">
              <span className="text-astro-text-secondary uppercase">NASA Career Radiation Dose Allocation</span>
              <span className="font-bold text-astro-text-primary">
                {reading.careerDoseMsv.toFixed(1)} / {risk.careerLimitMsv} mSv ({risk.careerDosePercent}%)
              </span>
            </div>
            <div className="w-full bg-astro-bg-subtle h-2.5 rounded-xs overflow-hidden border border-astro-border-hairline">
              <div
                className={`h-full transition-all duration-500 ${
                  risk.careerDosePercent > 80
                    ? 'bg-astro-status-critical'
                    : risk.careerDosePercent > 50
                    ? 'bg-astro-status-warning'
                    : 'bg-astro-sage'
                }`}
                style={{ width: `${Math.min(100, risk.careerDosePercent)}%` }}
              />
            </div>
          </div>

          {/* Organ Systems Degradation Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3.5 bg-astro-bg-surface border border-astro-border-hairline rounded-sm space-y-2">
              <div className="flex items-center space-x-2 text-astro-sage font-mono text-xs font-bold">
                <Dna className="w-4 h-4" />
                <span>HEMATOPOIETIC BFO</span>
              </div>
              <p className="text-xs font-body text-astro-text-secondary leading-relaxed">
                Bone marrow stem cell suppression and peripheral lymphocyte reduction. High-LET GCR induces persistent chromosomal translocations.
              </p>
              <div className="font-mono text-[10px] text-astro-text-primary pt-1 border-t border-astro-border-hairline">
                DSB Load: <span className="font-bold">{risk.dnaDoubleStrandBreaksPerCell} lesions/cell</span>
              </div>
            </div>

            <div className="p-3.5 bg-astro-bg-surface border border-astro-border-hairline rounded-sm space-y-2">
              <div className="flex items-center space-x-2 text-astro-blue font-mono text-xs font-bold">
                <Heart className="w-4 h-4" />
                <span>CARDIOVASCULAR</span>
              </div>
              <p className="text-xs font-body text-astro-text-secondary leading-relaxed">
                Vascular endothelial oxidative damage and microvascular rarefaction. Accelerates coronary fibrosis and baroreceptor sensitivity decay.
              </p>
              <div className="font-mono text-[10px] text-astro-text-primary pt-1 border-t border-astro-border-hairline">
                Endothelial Index: <span className="font-bold">{risk.tissueDegradationScore}/100</span>
              </div>
            </div>

            <div className="p-3.5 bg-astro-bg-surface border border-astro-border-hairline rounded-sm space-y-2">
              <div className="flex items-center space-x-2 text-astro-status-caution font-mono text-xs font-bold">
                <Brain className="w-4 h-4" />
                <span>CENTRAL NERVOUS</span>
              </div>
              <p className="text-xs font-body text-astro-text-secondary leading-relaxed">
                Synaptic plasticity degradation and neuro-inflammation in hippocampal dentate gyrus. Impairs spatial memory and executive decision-making.
              </p>
              <div className="font-mono text-[10px] text-astro-text-primary pt-1 border-t border-astro-border-hairline">
                Synaptic Risk: <span className="font-bold">MODERATE VULNERABILITY</span>
              </div>
            </div>

            <div className="p-3.5 bg-astro-bg-surface border border-astro-border-hairline rounded-sm space-y-2">
              <div className="flex items-center space-x-2 text-astro-text-primary font-mono text-xs font-bold">
                <Eye className="w-4 h-4 text-astro-sage" />
                <span>OCULAR LENS</span>
              </div>
              <p className="text-xs font-body text-astro-text-secondary leading-relaxed">
                Posterior subcapsular cataract risk following heavy particle strikes across the crystalline lens epithelial germinative zone.
              </p>
              <div className="font-mono text-[10px] text-astro-text-primary pt-1 border-t border-astro-border-hairline">
                Threshold: <span className="font-bold">500 mGy cumulative</span>
              </div>
            </div>
          </div>
        </div>
      </DossierCard>
    </div>
  );
};
