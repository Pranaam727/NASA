import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface AssessmentProgressProps {
  completedSteps?: number;
  totalSteps?: number;
  lastCompletedDate?: string;
  className?: string;
}

export const AssessmentProgress: React.FC<AssessmentProgressProps> = ({
  completedSteps = 6,
  totalSteps = 9,
  lastCompletedDate = 'Today, 07:45 UTC',
  className = '',
}) => {
  const navigate = useNavigate();
  const percentage = Math.round((completedSteps / totalSteps) * 100);

  const steps = [
    'Sleep Quality & Duration',
    'Fatigue & Readiness',
    'Pain & Musculoskeletal Soreness',
    'SANS Visual Disturbances',
    'Vestibular Neuro-Vestibular Dizziness',
    'ARED Countermeasure Workouts',
    'Nutritional & Hydration Intake',
    'Habitat Confinement Mood Log',
    'Clinical Review & Auto-Triage',
  ];

  return (
    <div
      className={`p-6 rounded-2xl bg-[#FFFFFF] border border-[#111111] shadow-subtle space-y-5 ${className}`}
    >
      <div className="flex items-center justify-between border-b border-[#DCD8CD] pb-3">
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#888882] block">
            ASTRONAUT DAILY 9-STEP CHECK-IN
          </span>
          <h4 className="font-display font-bold text-lg text-[#111111]">
            DAILY SELF-ASSESSMENT
          </h4>
        </div>

        <div className="text-right">
          <span className="font-display font-bold text-xl text-[#111111] tabular-nums">
            {completedSteps}/{totalSteps}
          </span>
          <span className="font-mono text-[10px] text-[#75D8DC] block font-bold">
            {percentage}% COMPLETE
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-[#F2F0EA] overflow-hidden border border-[#DCD8CD]">
        <div
          className="h-full bg-[#111111] transition-all duration-500 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Mini Step List Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
        {steps.slice(0, 3).map((st, i) => (
          <div
            key={i}
            className="flex items-center space-x-2 p-2 rounded-lg bg-[#F2F0EA]/60 border border-[#DCD8CD]"
          >
            {i < completedSteps ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#75D8DC] shrink-0" />
            ) : (
              <Circle className="w-3.5 h-3.5 text-[#B8B8B3] shrink-0" />
            )}
            <span className="truncate text-[#444444]">{st}</span>
          </div>
        ))}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#DCD8CD]">
        <span className="font-mono text-[10px] text-[#888882]">
          Last submission: {lastCompletedDate}
        </span>
        <button
          type="button"
          onClick={() => navigate(ROUTES.SELF_ASSESSMENT)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-full font-mono text-xs font-bold text-[#F2F0EA] bg-[#FF6B35] hover:bg-[#E05A25] transition-all flex items-center justify-center space-x-2 shadow-md hover:scale-[1.02]"
        >
          <span>{completedSteps >= totalSteps ? 'REVIEW TODAY’S LOG' : 'START ASSESSMENT'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
