import React from 'react';
import { DossierCard } from '@/components/common/DossierCard';
import { ShieldAlert, Database, Cpu, BookOpen, AlertCircle } from 'lucide-react';

export const RadiationProvenancePanel: React.FC = () => {
  return (
    <DossierCard
      title="Radiation Data Provenance & Scientific Integrity Matrix"
      subtitle="DATA SOURCE DIFFERENTIATION // REGULATORY & CLINICAL BOUNDARIES"
    >
      <div className="space-y-4">
        {/* Provenance Matrix 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Simulation */}
          <div className="p-3 bg-[#F3F0E8] border border-astro-border-hairline rounded">
            <div className="flex items-center gap-2 text-astro-status-sandstone font-mono text-xs font-bold mb-1">
              <Cpu className="w-4 h-4" />
              <span>1. VIRTUAL SIMULATOR</span>
            </div>
            <p className="font-heading font-semibold text-xs text-astro-ink mb-1">
              AstroCare Math Engine
            </p>
            <p className="font-body text-[11px] text-astro-text-secondary leading-relaxed">
              Real-time physiological telemetry, 1Hz dosimeter flux, and SPE scenarios. Tagged with <code>isSimulated = true</code>.
            </p>
          </div>

          {/* 2. NASA RadLab */}
          <div className="p-3 bg-[#F3F0E8] border border-astro-border-hairline rounded">
            <div className="flex items-center gap-2 text-[#D16C48] font-mono text-xs font-bold mb-1">
              <Database className="w-4 h-4" />
              <span>2. NASA RADLAB API</span>
            </div>
            <p className="font-heading font-semibold text-xs text-astro-ink mb-1">
              Vehicle Telemetry Archive
            </p>
            <p className="font-body text-[11px] text-astro-text-secondary leading-relaxed">
              Historical environmental dosimeter readings from ISS instruments (DosTel, TEPC, Liulin-5, REM). Not personal astronaut dosimetry.
            </p>
          </div>

          {/* 3. NASA OSDR */}
          <div className="p-3 bg-[#F3F0E8] border border-astro-border-hairline rounded">
            <div className="flex items-center gap-2 text-astro-status-healthy font-mono text-xs font-bold mb-1">
              <BookOpen className="w-4 h-4" />
              <span>3. NASA OSDR REPOSITORY</span>
            </div>
            <p className="font-heading font-semibold text-xs text-astro-ink mb-1">
              Space-Biology Datasets
            </p>
            <p className="font-body text-[11px] text-astro-text-secondary leading-relaxed">
              Peer-reviewed open science studies covering DNA repair, heavy ion cytogenetics, and oxidative stress biomarkers.
            </p>
          </div>

          {/* 4. NASA HRP */}
          <div className="p-3 bg-[#F3F0E8] border border-astro-border-hairline rounded">
            <div className="flex items-center gap-2 text-astro-ink font-mono text-xs font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span>4. NASA HRP EVIDENCE</span>
            </div>
            <p className="font-heading font-semibold text-xs text-astro-ink mb-1">
              Human Research Roadmap
            </p>
            <p className="font-body text-[11px] text-astro-text-secondary leading-relaxed">
              Epidemiological evidence reports, Permissible Exposure Limits (PEL), REID model frameworks, and storm shelter guidelines.
            </p>
          </div>
        </div>

        {/* Disclaimer Alert */}
        <div className="p-3.5 bg-[#EAE6DC] rounded border border-astro-border-hairline flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-astro-text-secondary mt-0.5 shrink-0" />
          <div className="space-y-1 text-xs font-body text-astro-text-secondary leading-relaxed">
            <p className="font-semibold text-astro-ink">
              MANDATORY SCIENTIFIC INTEGRITY & REGULATORY NOTICE:
            </p>
            <p>
              AstroCare is a software simulation and research-information system engineered for academic and demonstration purposes. It is <strong>NOT</strong> a certified clinical medical device or physical radiation dosimeter.
            </p>
            <p>
              Simulated telemetry readings reflect synthetic mathematical generator outputs and must never be represented as actual human measurements. NASA RadLab records reflect vehicle environmental telemetry from past missions and do not imply NASA endorsement, certification, or operational partnership.
            </p>
          </div>
        </div>
      </div>
    </DossierCard>
  );
};
