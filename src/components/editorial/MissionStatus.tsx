import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';

interface MissionStatusProps {
  className?: string;
  variant?: 'pill' | 'expanded';
}

export const MissionStatus: React.FC<MissionStatusProps> = ({
  className = '',
  variant = 'pill',
}) => {
  // Real-time Sol counter base
  const [sol, setSol] = useState(142);
  const [sec, setSec] = useState(18 * 3600 + 22 * 60 + 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setSec((prev) => {
        if (prev >= 86400) {
          setSol((s) => s + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  if (variant === 'expanded') {
    return (
      <div
        className={`bg-[#FFFFFF] border border-[#111111] rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-subtle ${className}`}
      >
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-full bg-[#75D8DC] animate-ping" />
          <div>
            <span className="font-mono text-[10px] tracking-widest uppercase text-[#888882] block">
              MISSION STATUS
            </span>
            <span className="font-display font-bold text-sm text-[#111111]">
              ARES-VI // TRANSIT PHASE // NOMINAL
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6 font-mono text-xs">
          <div>
            <span className="text-[10px] text-[#888882] block">SOL ELAPSED</span>
            <span className="font-bold text-[#111111] tabular-nums">
              SOL {sol} · {formatTime(sec)}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-[#888882] block">ONE-WAY DELAY</span>
            <span className="font-bold text-[#FF6B35] tabular-nums">04m 12s</span>
          </div>
          <div>
            <span className="text-[10px] text-[#888882] block">CREW READINESS</span>
            <span className="font-bold text-[#75D8DC] tabular-nums">98.4%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#FFFFFF] border border-[#DCD8CD] shadow-sm font-mono text-[11px] text-[#111111] ${className}`}
    >
      <span className="w-2 h-2 rounded-full bg-[#75D8DC] animate-pulse" />
      <span className="font-bold tracking-wider">ARES-VI</span>
      <span className="text-[#B8B8B3]">/</span>
      <span className="text-[#444444] tabular-nums">SOL {sol} · {formatTime(sec)}</span>
      <span className="text-[#B8B8B3]">/</span>
      <span className="text-[#75D8DC] font-semibold flex items-center space-x-1">
        <Radio className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
        <span>LINK ACTIVE</span>
      </span>
    </div>
  );
};
