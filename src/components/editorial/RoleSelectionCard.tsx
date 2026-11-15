import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, LucideIcon } from 'lucide-react';

interface RoleSelectionCardProps {
  clearanceLevel: string;
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  continueRoute: string;
  buttonLabel: string;
  demoCallsign: string;
  demoRoleKey: 'ASTRONAUT' | 'MEDICAL_OFFICER' | 'MISSION_COMMANDER';
  onQuickLogin: (role: 'ASTRONAUT' | 'MEDICAL_OFFICER' | 'MISSION_COMMANDER') => void;
  accentColor?: string;
}

export const RoleSelectionCard: React.FC<RoleSelectionCardProps> = ({
  clearanceLevel,
  title,
  description,
  icon: Icon,
  features,
  continueRoute,
  buttonLabel,
  demoCallsign,
  demoRoleKey,
  onQuickLogin,
  accentColor = '#24E6D0',
}) => {
  return (
    <div className="relative rounded-2xl bg-[#0D1D1B] border border-[#24E6D0]/25 p-6 flex flex-col justify-between shadow-cyberCard hover:border-[#24E6D0] hover:shadow-cyberCardHover transition-all duration-300">
      <div className="space-y-4">
        {/* Top Header & Icon */}
        <div className="flex items-center justify-between">
          <div
            className="w-12 h-12 rounded-xl bg-[#071311] border-2 flex items-center justify-center transition-all shadow-cyberGlow"
            style={{ borderColor: accentColor, color: accentColor }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span className="font-mono text-[9px] font-bold text-[#8BFFE9] tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-[#071311] border border-[#24E6D0]/30">
            {clearanceLevel}
          </span>
        </div>

        <div>
          <h3 className="font-display font-extrabold text-xl text-[#F4FAF8]">
            {title}
          </h3>
          <p className="font-body text-xs text-[#91A9A4] mt-1.5 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Feature bullets */}
        <div className="pt-3 border-t border-[#24E6D0]/15 space-y-1.5 font-mono text-[11px] text-[#91A9A4]">
          {features.map((f, i) => (
            <div key={i} className="flex items-center space-x-2">
              <span className="text-[#24E6D0]">▸</span>
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-2.5">
        <Link
          to={continueRoute}
          className="w-full py-3 px-4 bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-cyberGlow hover:scale-[1.01]"
        >
          <span>{buttonLabel}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <button
          type="button"
          onClick={() => onQuickLogin(demoRoleKey)}
          className="w-full py-2 px-3 bg-[#071311] hover:bg-[#0A1716] text-[#91A9A4] hover:text-[#F4FAF8] border border-[#24E6D0]/20 rounded-xl font-mono text-[10px] transition-colors flex items-center justify-center space-x-1.5"
        >
          <Zap className="w-3 h-3 text-[#24E6D0]" />
          <span>1-Click Station Login ({demoCallsign})</span>
        </button>
      </div>
    </div>
  );
};
