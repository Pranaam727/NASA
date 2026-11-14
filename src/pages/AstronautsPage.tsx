import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { ArrowRight, User } from 'lucide-react';

const CREW = [
  {
    id: 'ASTRO-01',
    name: 'Cmdr. Marcus Chen',
    callsign: 'COMMANDER',
    role: 'Mission Commander',
    bloodType: 'O+',
    restingHr: 64,
    status: 'NOMINAL' as const,
  },
  {
    id: 'ASTRO-02',
    name: 'Dr. Sarah Vance',
    callsign: 'FLIGHT SURGEON',
    role: 'Chief Medical Officer',
    bloodType: 'A-',
    restingHr: 68,
    status: 'NOMINAL' as const,
  },
  {
    id: 'ASTRO-03',
    name: 'Dr. Elena Rostova',
    callsign: 'ASTROBIOLOGY',
    role: 'Payload Specialist',
    bloodType: 'B+',
    restingHr: 71,
    status: 'NOMINAL' as const,
  },
  {
    id: 'ASTRO-04',
    name: 'Lt. James Wilson',
    callsign: 'FLIGHT ENGINEER',
    role: 'EVA & Systems Lead',
    bloodType: 'AB+',
    restingHr: 62,
    status: 'NOMINAL' as const,
  },
];

export const AstronautsPage: React.FC = () => {
  return (
    <PageContainer>
      <PageHeader
        title="Astronaut Medical Roster"
        subtitle="Individual clinical identities, baselines, and biometric profiles"
        badge={<StatusIndicator status="NOMINAL" label="4 CREW MONITORED" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CREW.map((member) => (
          <DossierCard
            key={member.id}
            title={member.name}
            subtitle={`CALLSIGN: ${member.callsign} // ID: ${member.id}`}
            badge={<StatusIndicator status={member.status} label={member.status} size="sm" />}
            action={
              <Link
                to={`/astronauts/${member.id}`}
                className="inline-flex items-center space-x-1 font-mono text-xs text-astro-text-secondary hover:text-astro-text-primary transition-colors"
              >
                <span>DOSSIER</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            }
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-sm bg-astro-bg-subtle border border-astro-border-hairline flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-astro-text-secondary" />
              </div>
              <div className="space-y-1 font-mono text-xs">
                <div>
                  <span className="text-astro-text-tertiary uppercase">Role:</span>{' '}
                  <span className="font-semibold text-astro-text-primary">{member.role}</span>
                </div>
                <div className="flex space-x-4 text-[11px]">
                  <span>
                    <span className="text-astro-text-tertiary">Blood:</span>{' '}
                    <span className="text-astro-text-primary">{member.bloodType}</span>
                  </span>
                  <span>
                    <span className="text-astro-text-tertiary">Resting HR:</span>{' '}
                    <span className="text-astro-text-primary">{member.restingHr} bpm</span>
                  </span>
                </div>
              </div>
            </div>
          </DossierCard>
        ))}
      </div>
    </PageContainer>
  );
};
