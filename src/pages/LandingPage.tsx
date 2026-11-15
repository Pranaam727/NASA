import React, { useEffect } from 'react';
import { CyberNavbar } from '@/components/cyber/CyberNavbar';
import { CyberHeroSection } from '@/features/cyber-landing/CyberHeroSection';
import { SpaceChangesEverythingSection } from '@/features/cyber-landing/SpaceChangesEverythingSection';
import { EverySignalMattersSection } from '@/features/cyber-landing/EverySignalMattersSection';
import { PersonalHealthTwinSection } from '@/features/cyber-landing/PersonalHealthTwinSection';
import { MissionIntelligenceSection } from '@/features/cyber-landing/MissionIntelligenceSection';
import { FinalCtaSection } from '@/features/cyber-landing/FinalCtaSection';
import { CyberFooter } from '@/components/cyber/CyberFooter';

export const LandingPage: React.FC = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020807] text-[#F4FAF8] overflow-x-hidden font-body selection:bg-[#24E6D0] selection:text-[#020807]">
      {/* 1. Transparent / Blurring Cyber Navigation */}
      <CyberNavbar />

      <main className="flex-1">
        {/* 2. Hero: Massive 3D Earth Centerpiece with Floating Glass HUD */}
        <CyberHeroSection />

        {/* 3. Section 01: Space Changes Everything (5 Hazards) */}
        <SpaceChangesEverythingSection />

        {/* 4. Section 02: Every Signal Matters (5 Health Pillars) */}
        <EverySignalMattersSection />

        {/* 5. Section 03: Understand Your Body in Orbit (Holographic 3D Anatomy) */}
        <PersonalHealthTwinSection />

        {/* 6. Section 04: One Mission Complete Health Visibility (Triage & ECLSS) */}
        <MissionIntelligenceSection />

        {/* 7. Section 05: Final CTA with Dark Earth */}
        <FinalCtaSection />
      </main>

      {/* 8. Technical Telemetry Footer */}
      <CyberFooter />
    </div>
  );
};

export default LandingPage;
