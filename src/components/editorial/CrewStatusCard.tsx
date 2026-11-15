import React from 'react';
import { User, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface CrewMemberData {
  id: string;
  name: string;
  callsign: string;
  role: string;
  status: 'NOMINAL' | 'CAUTION' | 'CRITICAL';
  heartRate: number;
  radiationDose: number; // mSv
  lastAssessment: string;
  activeAlertCount: number;
}

interface CrewStatusCardProps {
  member: CrewMemberData;
  onSelect?: (memberId: string) => void;
  className?: string;
}

export const CrewStatusCard: React.FC<CrewStatusCardProps> = ({
  member,
  onSelect,
  className = '',
}) => {
  const isCaution = member.status === 'CAUTION';
  const isCritical = member.status === 'CRITICAL';

  return (
    <div
      onClick={() => onSelect?.(member.id)}
      className={`p-4 rounded-2xl bg-[#FFFFFF] border transition-all duration-200 cursor-pointer shadow-subtle ${
        isCritical
          ? 'border-[#E03616] hover:border-[#E03616]'
          : isCaution
            ? 'border-[#FF6B35] hover:border-[#FF6B35]'
            : 'border-[#DCD8CD] hover:border-[#111111]'
      } hover:shadow-editorial ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2F0EA] border border-[#DCD8CD] flex items-center justify-center text-[#111111]">
            <User className="w-5 h-5 text-[#111111]" />
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-[#111111]">
              {member.name}
            </h4>
            <div className="font-mono text-[10px] text-[#888882] tracking-wider uppercase">
              {member.callsign} · {member.role}
            </div>
          </div>
        </div>

        <span
          className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
            isCritical
              ? 'bg-[#E03616]/10 text-[#E03616] border-[#E03616]/40'
              : isCaution
                ? 'bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/40'
                : 'bg-[#75D8DC]/20 text-[#111111] border-[#75D8DC]/40'
          }`}
        >
          {member.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#DCD8CD] font-mono text-center">
        <div>
          <span className="text-[9px] text-[#888882] block">HEART RATE</span>
          <span className="font-bold text-xs text-[#111111] tabular-nums">
            {member.heartRate} BPM
          </span>
        </div>
        <div>
          <span className="text-[9px] text-[#888882] block">DOSE (mSv)</span>
          <span className="font-bold text-xs text-[#111111] tabular-nums">
            {member.radiationDose}
          </span>
        </div>
        <div>
          <span className="text-[9px] text-[#888882] block">ALERTS</span>
          <span
            className={`font-bold text-xs tabular-nums ${
              member.activeAlertCount > 0 ? 'text-[#FF6B35]' : 'text-[#75D8DC]'
            }`}
          >
            {member.activeAlertCount} ACTIVE
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#DCD8CD]/60 flex items-center justify-between font-mono text-[10px] text-[#888882]">
        <span className="flex items-center space-x-1">
          {member.activeAlertCount === 0 ? (
            <CheckCircle2 className="w-3 h-3 text-[#75D8DC]" />
          ) : (
            <AlertCircle className="w-3 h-3 text-[#FF6B35]" />
          )}
          <span>CHECK-IN: {member.lastAssessment}</span>
        </span>
        <span className="text-[#111111] font-semibold group-hover:underline">
          VIEW PROFILE →
        </span>
      </div>
    </div>
  );
};
