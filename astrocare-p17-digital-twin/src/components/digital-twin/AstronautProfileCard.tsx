import React from 'react';
import { AstronautProfile } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { User, Rocket, Calendar, ShieldCheck } from 'lucide-react';

interface AstronautProfileCardProps {
  profile: AstronautProfile;
  isActive?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AstronautProfileCard: React.FC<AstronautProfileCardProps> = ({
  profile,
  isActive = false,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <Card
      glow={isActive ? 'cyan' : 'none'}
      className={`border transition-all ${
        isActive ? 'border-cyan-500/60 bg-slate-900/90' : 'border-slate-800/80 bg-slate-950/60'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-100 text-sm">
                {profile.displayName}
              </h4>
              <Badge variant="teal" size="sm">
                {profile.codeName}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">{profile.role}</p>
          </div>
        </div>

        <Badge
          variant={
            profile.missionPhase === 'Inflight'
              ? 'cyan'
              : profile.missionPhase === 'Preflight'
              ? 'blue'
              : 'violet'
          }
        >
          {profile.missionPhase}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 my-4 pt-3 border-t border-slate-800/60 text-xs">
        <div>
          <span className="text-slate-500">Mission:</span>
          <div className="font-medium text-slate-300 flex items-center gap-1 mt-0.5">
            <Rocket className="w-3 h-3 text-cyan-400" />
            {profile.missionId}
          </div>
        </div>
        <div>
          <span className="text-slate-500">Day / Duration:</span>
          <div className="font-medium text-slate-300 flex items-center gap-1 mt-0.5 font-mono">
            <Calendar className="w-3 h-3 text-cyan-400" />
            {profile.missionDay >= 0 ? `FD ${profile.missionDay}` : `L${profile.missionDay}`} / {profile.missionDurationDays}d
          </div>
        </div>
        <div>
          <span className="text-slate-500">Destination:</span>
          <p className="font-medium text-slate-300 mt-0.5">{profile.missionType}</p>
        </div>
        <div>
          <span className="text-slate-500">Bio Data:</span>
          <p className="font-medium text-slate-300 mt-0.5">
            {profile.age ? `${profile.age}y` : '--'} • {profile.biologicalSex || 'Undisclosed'} • {profile.weightKg ? `${profile.weightKg}kg` : '--'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Synthetic Demonstration Record</span>
        </div>

        <div className="flex items-center gap-2">
          {onSelect && !isActive && (
            <button
              onClick={onSelect}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 rounded bg-cyan-950/40 border border-cyan-800/60"
            >
              Set Active
            </button>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/30"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};
