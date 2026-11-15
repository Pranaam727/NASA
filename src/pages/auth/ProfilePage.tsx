import React from 'react';
import { PageContainer, PageHeader } from '@/components/layout/PageContainer';
import { DossierCard } from '@/components/common/DossierCard';
import { StatusIndicator } from '@/components/common/DataDisplay';
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Award, Clock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) return null;

  return (
    <PageContainer>
      <PageHeader
        title="Mission Personnel Profile"
        subtitle="Cryptographic credential manifest, security clearances, and operational assignments"
        badge={<StatusIndicator status="NOMINAL" label="ACTIVE CREDENTIAL" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card: Identity Card */}
        <div className="space-y-6">
          <DossierCard
            title="AUTHENTICATED IDENTITY"
            subtitle={`SECURITY CLEARANCE: ${currentUser.role}`}
            badge={<ShieldCheck className="w-4 h-4 text-astro-sage" />}
          >
            <div className="text-center py-4 space-y-3">
              <div className="w-20 h-20 rounded-full bg-astro-bg-subtle border-2 border-astro-border-hairline flex items-center justify-center text-astro-text-primary mx-auto font-display text-xl font-bold">
                {currentUser.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-astro-text-primary">
                  {currentUser.name}
                </h3>
                <span className="font-mono text-xs text-astro-text-secondary">
                  {currentUser.callsign} · {currentUser.badge}
                </span>
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-astro-sage/10 border border-astro-sage/30 rounded-sm font-mono text-[11px] text-astro-sage font-bold">
                <span>{currentUser.role.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-astro-border-hairline space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-astro-border-hairline/50">
                <span className="text-astro-text-tertiary">EMAIL:</span>
                <span className="text-astro-text-primary font-bold">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-astro-border-hairline/50">
                <span className="text-astro-text-tertiary">MISSION:</span>
                <span className="text-astro-text-primary font-bold">{currentUser.mission || 'Ares-VI Deep Space Transit'}</span>
              </div>
              {currentUser.astronautId && (
                <div className="flex justify-between py-1 border-b border-astro-border-hairline/50">
                  <span className="text-astro-text-tertiary">SUBJECT ID:</span>
                  <span className="text-astro-text-primary font-bold">{currentUser.astronautId}</span>
                </div>
              )}
              {currentUser.organization && (
                <div className="flex justify-between py-1 border-b border-astro-border-hairline/50">
                  <span className="text-astro-text-tertiary">ORGANIZATION:</span>
                  <span className="text-astro-text-primary font-bold">{currentUser.organization}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={logout}
              className="mt-6 w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-sm font-mono text-xs font-bold transition-colors"
            >
              Terminate Active Session (Logout)
            </button>
          </DossierCard>
        </div>

        {/* Right 2 Columns: Credentials & Approvals */}
        <div className="lg:col-span-2 space-y-6">
          <DossierCard
            title="SECURITY CLEARANCE & ACCESS ENVELOPES"
            subtitle="NASA-STD-3001 & ESA BIOMEDICAL PROTOCOLS ENFORCED"
            badge={<Award className="w-4 h-4 text-astro-sage" />}
          >
            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-[#06110F] border border-[rgba(55,210,185,0.2)] rounded-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#E8F4F0]">TELEMETRY ACCESS TIER</span>
                  <span className="text-[#21E6D0] font-bold">LEVEL-ALPHA (ACTIVE)</span>
                </div>
                <p className="font-body text-xs text-[#8CA8A0] leading-relaxed">
                  Cryptographic keys are bound to active mission elapsed time (MET) and refresh at each Sol transition.
                  All telemetry queries are logged to the immutable flight recorder.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-[#06110F] border border-[rgba(55,210,185,0.2)] rounded-sm space-y-1">
                  <div className="text-[10px] text-[#57766D]">MULTI-FACTOR AUTHENTICATION</div>
                  <div className="font-bold text-[#E8F4F0]">
                    {currentUser.mfaEnabled ? 'ENABLED (TIME-BASED TOKEN)' : 'OPTIONAL FOR IN-FLIGHT CREW'}
                  </div>
                  <div className="text-[10px] text-[#21E6D0]">Hardware Key Compatible</div>
                </div>

                <div className="p-3 bg-[#06110F] border border-[rgba(55,210,185,0.2)] rounded-sm space-y-1">
                  <div className="text-[10px] text-[#57766D]">SESSION EXPIRATION</div>
                  <div className="font-bold text-[#E8F4F0]">MARS SOL 142 (24.6 HRS)</div>
                  <div className="text-[10px] text-[#8CA8A0]">Auto-Revalidates Onboard</div>
                </div>
              </div>
            </div>
          </DossierCard>

          <DossierCard
            title="SYSTEM ACTIVITY & FLIGHT COMMUNICATOR"
            subtitle="AUDIT RECORD LOG"
            badge={<Clock className="w-4 h-4 text-[#21E6D0]" />}
          >
            <div className="space-y-2 font-mono text-xs">
              {[
                { time: 'MET 142d 08:30:12', event: 'Session authenticated via mission portal token' },
                { time: 'MET 142d 07:15:00', event: 'Biometric telemetry stream synchronized with local cache' },
                { time: 'MET 141d 23:45:10', event: 'Sol 141 diurnal circadian check-in finalized' },
              ].map((log, i) => (
                <div key={i} className="p-2.5 bg-[#06110F] border border-[rgba(55,210,185,0.18)] rounded-sm flex items-center justify-between">
                  <span className="text-[#8CA8A0]">{log.event}</span>
                  <span className="text-[10px] text-[#57766D]">{log.time}</span>
                </div>
              ))}
            </div>
          </DossierCard>
        </div>
      </div>
    </PageContainer>
  );
};
