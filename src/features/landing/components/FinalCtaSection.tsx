import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ArrowRight, Sparkles } from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-32 bg-[#0D0D0D] overflow-hidden border-t border-[#262626]">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#00A3FF]/10 blur-[130px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#151515] border border-[#00A3FF]/30">
          <Sparkles className="w-4 h-4 text-[#00A3FF]" />
          <span className="text-[11px] font-mono tracking-widest text-[#00A3FF] uppercase font-semibold">
            THE NASA SPACEFLIGHT HORIZON
          </span>
        </div>

        <h2 className="font-space font-extrabold text-4xl sm:text-6xl lg:text-7xl text-[#E2DED9] tracking-tight leading-[1.08]">
          THE NEXT FRONTIER
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] via-[#38BDF8] to-[#7B2CBF]">
            IS HUMAN.
          </span>
        </h2>

        <p className="max-w-2xl mx-auto text-[#C6C2BB] font-light text-base sm:text-xl leading-relaxed">
          Every great exploration begins with a bold step into the unknown. Every successful mission
          depends on protecting the crew who journey beyond our world.
        </p>

        {/* Primary and Secondary Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => navigate(ROUTES.DASHBOARD)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-mono font-bold tracking-wider text-black bg-[#00A3FF] hover:bg-[#38BDF8] shadow-glowCyan transition-all flex items-center justify-center space-x-2.5"
          >
            <span>LAUNCH MISSION CONSOLE</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => navigate(ROUTES.AUTH)}
            className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-mono font-medium text-[#E2DED9] bg-[#151515] border border-[#262626] hover:border-[#00A3FF]/60 hover:text-white transition-all flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>PERSONNEL AUTHENTICATION</span>
          </button>
        </div>
      </div>
    </section>
  );
};
