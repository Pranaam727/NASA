import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { ShieldX, ArrowRight, Lock, UserCheck, AlertTriangle } from 'lucide-react';

interface AccessDeniedState {
  attemptedPath?: string;
  userRole?: string;
  allowedRoles?: string[];
}

export const AccessDeniedPage: React.FC = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const state = (location.state as AccessDeniedState) || {};

  const getAuthorizedDashboard = () => {
    if (!currentUser) return ROUTES.AUTH;
    if (currentUser.role === 'ASTRONAUT') return ROUTES.ASTRONAUT_DASHBOARD;
    if (currentUser.role === 'MEDICAL_OFFICER') return ROUTES.MEDICAL_DASHBOARD;
    return ROUTES.COMMANDER_DASHBOARD;
  };

  return (
    <div className="min-h-screen bg-astro-obsidian text-astro-text-primary flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-radial-at-t from-red-950/30 via-astro-obsidian to-black pointer-events-none" />

      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Link to={ROUTES.AUTH} className="flex items-center space-x-2 text-xs font-mono text-astro-text-secondary hover:text-white transition-colors">
          <span>ASTROCARE SECURITY OPERATIONS</span>
        </Link>
      </header>

      <main className="relative z-10 max-w-lg mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-white/[0.03] border border-red-500/30 backdrop-blur-md rounded-lg p-6 sm:p-8 shadow-2xl relative text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto">
            <ShieldX className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-sm bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-[10px] uppercase font-bold">
              <Lock className="w-3 h-3" />
              <span>SECURITY CLEARANCE VIOLATION (HTTP 403)</span>
            </div>
            <h1 className="font-display text-2xl font-extrabold text-white">
              ACCESS DENIED
            </h1>
            <p className="font-body text-xs text-astro-text-secondary leading-relaxed">
              You do not possess the required aerospace security clearance to inspect this mission module or personal medical records.
            </p>
          </div>

          <div className="p-4 bg-black/40 border border-white/10 rounded-sm text-left font-mono text-xs space-y-2">
            <div className="flex justify-between border-b border-white/5 pb-1 text-[11px]">
              <span className="text-astro-text-tertiary">CURRENT IDENTITY:</span>
              <span className="text-white font-bold">{currentUser?.name || 'Unauthenticated'}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-1 text-[11px]">
              <span className="text-astro-text-tertiary">ACTIVE CLEARANCE:</span>
              <span className="text-astro-sage font-bold">{currentUser?.role || 'NONE'}</span>
            </div>
            {state.allowedRoles && (
              <div className="flex justify-between border-b border-white/5 pb-1 text-[11px]">
                <span className="text-astro-text-tertiary">REQUIRED CLEARANCE:</span>
                <span className="text-red-400 font-bold">{state.allowedRoles.join(' OR ')}</span>
              </div>
            )}
            {state.attemptedPath && (
              <div className="flex justify-between text-[11px]">
                <span className="text-astro-text-tertiary">RESTRICTED ROUTE:</span>
                <span className="text-white truncate max-w-[200px]">{state.attemptedPath}</span>
              </div>
            )}
          </div>

          <div className="p-3 bg-red-500/5 border border-red-500/20 rounded-sm text-[11px] font-mono text-astro-text-secondary text-left flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>
              <strong>CONFIDENTIALITY MANDATE:</strong> Per NASA-STD-3001, crew medical files and private wellness reflections are restricted to designated flight surgeons and individual astronauts.
            </span>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              to={getAuthorizedDashboard()}
              className="flex-1 py-2.5 px-4 bg-[#21E6D0] text-[#030A09] font-mono text-xs font-bold rounded-sm flex items-center justify-center space-x-2 hover:bg-[#00AFA0] hover:text-white transition-all shadow-lg"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Return to Authorized Cockpit</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                logout();
                window.location.href = ROUTES.AUTH;
              }}
              className="py-2.5 px-4 bg-white/5 text-astro-text-secondary hover:text-white border border-white/10 rounded-sm font-mono text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <span>Switch Identity</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </main>

      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-4 text-center font-mono text-[10px] text-astro-text-tertiary">
        NASA Deep Space Telemetry Security Controller · Clearance Audit Active
      </footer>
    </div>
  );
};
