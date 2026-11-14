import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { PrimaryButton } from '@/components/common/Buttons';
import { Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="py-12 max-w-lg mx-auto text-center">
        <DossierCard title="TELEMETRY VECTOR NOT FOUND // 404">
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <Compass className="w-10 h-10 text-astro-status-caution stroke-1" />
            <div className="space-y-1">
              <h3 className="font-display text-base font-bold text-astro-text-primary">
                ORBITAL COORDINATES UNRESOLVED
              </h3>
              <p className="font-body text-xs text-astro-text-secondary">
                The requested mission telemetry endpoint does not correspond to an authorized
                subsystem or flight roster dossier.
              </p>
            </div>
            <Link to="/overview">
              <PrimaryButton size="sm">RETURN TO MISSION OVERVIEW</PrimaryButton>
            </Link>
          </div>
        </DossierCard>
      </div>
    </PageContainer>
  );
};
