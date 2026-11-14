import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator, MeasurementDisplay } from '@/components/common/DataDisplay';
import { ArrowLeft } from 'lucide-react';

export const AstronautDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <PageContainer>
      <div className="mb-2">
        <Link
          to="/astronauts"
          className="inline-flex items-center space-x-1 font-mono text-xs text-astro-text-secondary hover:text-astro-text-primary transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO ROSTER</span>
        </Link>
      </div>

      <PageHeader
        title={`Astronaut Clinical Dossier: ${id || 'ASTRO-01'}`}
        subtitle="Individual baseline calibration, medical history, and clinical tolerance limits"
        badge={<StatusIndicator status="NOMINAL" label="ACTIVE FLIGHT STATUS" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DossierCard title="PERSONAL HEALTH BASELINE" subtitle="ESTABLISHED PRE-LAUNCH">
          <div className="space-y-1">
            <MeasurementDisplay label="Resting Heart Rate" value="64" unit="bpm" />
            <MeasurementDisplay label="Blood Pressure (Resting)" value="114/74" unit="mmHg" />
            <MeasurementDisplay label="Oxygen Saturation (SpO2)" value="98.5" unit="%" />
            <MeasurementDisplay label="Core Temperature" value="36.7" unit="°C" />
            <MeasurementDisplay label="Respiratory Rate" value="14" unit="rpm" />
          </div>
        </DossierCard>

        <DossierCard title="SPACE MEDICINE ADAPTATION PROFILE" subtitle="MICROGRAVITY TOLERANCE">
          <div className="space-y-1">
            <MeasurementDisplay label="Bone Mineral Density (T-Score)" value="-0.2" unit="SD" />
            <MeasurementDisplay label="Peak Quadriceps Torque" value="210" unit="Nm" />
            <MeasurementDisplay label="Cumulative Mission Radiation" value="12.4" unit="mSv" />
            <MeasurementDisplay label="EVA Certification" value="CLASS 1" unit="ACTIVE" />
          </div>
        </DossierCard>
      </div>
    </PageContainer>
  );
};
