import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Radio, ShieldCheck, Orbit } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  backTo?: string;
  backLabel?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  badge = 'STATION ACCESS PORTAL',
  backTo = ROUTES.AUTH,
  backLabel = '← STATION SELECTION',
}) => {
  return (
    <div className="min-h-screen bg-[#020807] text-[#F4FAF8] flex flex-col justify-between p-4 sm:p-6 lg:p-10 relative overflow-hidden font-body cyber-dots cyber-grid selection:bg-[#24E6D0] selection:text-[#020807]">
      {/* Ambient Emerald Flare */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,_rgba(36,230,208,0.12)_0%,_rgba(0,175,160,0.04)_40%,_transparent_70%)] pointer-events-none blur-3xl -z-10" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl mx-auto w-full flex items-center justify-between pb-6 border-b border-[#24E6D0]/18">
        <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
          <div className="w-8 h-8 rounded-xl bg-[#071311] border border-[#24E6D0]/40 flex items-center justify-center text-[#24E6D0] group-hover:shadow-cyberGlow transition-all">
            <Orbit className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-extrabold text-sm tracking-widest text-[#F4FAF8]">
              ASTRO<span className="text-[#24E6D0]">CARE</span>
            </span>
            <span className="block font-mono text-[8px] uppercase tracking-wider text-[#91A9A4]">
              SPACE HEALTH INTELLIGENCE
            </span>
          </div>
        </Link>

        <Link
          to={backTo}
          className="px-4 py-1.5 text-xs font-mono font-semibold text-[#8BFFE9] hover:text-[#020807] hover:bg-[#24E6D0] bg-[#071311] border border-[#24E6D0]/30 rounded-full transition-all shadow-cyberGlow"
        >
          {backLabel}
        </Link>
      </header>

      {/* Main Form Centerpiece */}
      <main className="relative z-10 max-w-lg mx-auto w-full py-10 flex-1 flex flex-col justify-center">
        <div className="cyber-glass-glow bg-[#0A1716]/90 p-8 sm:p-10 border border-[#24E6D0]/30 shadow-cyberCardHover rounded-2xl space-y-6">
          <div className="space-y-2 text-center">
            {badge && (
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#071311] border border-[#24E6D0]/30 text-[#8BFFE9] font-mono text-[9px] uppercase font-bold tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5 text-[#24E6D0]" />
                <span>{badge}</span>
              </div>
            )}
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#F4FAF8] uppercase tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="font-body text-xs sm:text-sm text-[#91A9A4] leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {children}
        </div>
      </main>

      {/* Footer Security Seal */}
      <footer className="relative z-10 max-w-6xl mx-auto w-full pt-4 border-t border-[#24E6D0]/18 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-[#5B7B75] gap-2">
        <div className="flex items-center space-x-2">
          <Radio className="w-3.5 h-3.5 text-[#24E6D0] animate-pulse" />
          <span>Ares-VI Biomedical Ground Station · End-to-End Cryptographically Sealed</span>
        </div>
        <div>NASA-STD-3001 & ESA Medical Data Privacy Enforced</div>
      </footer>
    </div>
  );
};
