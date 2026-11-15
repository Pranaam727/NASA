import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldAlert,
  Lock,
  Mail,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Key,
  CheckCircle2,
  Clock,
  Briefcase,
} from 'lucide-react';

export const CommanderSignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [commanderId, setCommanderId] = useState('');
  const [email, setEmail] = useState('');
  const [mission, setMission] = useState('Ares-VI Deep Space Expedition');
  const [designation, setDesignation] = useState('ASSOCIATE FLIGHT DIRECTOR');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingStatus, setPendingStatus] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('Passphrase must be at least 8 characters long for executive clearance.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('You must accept the NASA Flight Directorate Executive Privacy Standards.');
      return;
    }

    setIsLoading(true);
    const res = await signup('MISSION_COMMANDER', {
      fullName,
      email,
      idNumber: commanderId,
      password,
      invitationCode,
      mission,
      designation,
    });
    setIsLoading(false);

    if (res.success) {
      if (res.requiresApproval) {
        setPendingStatus(true);
      } else {
        navigate(ROUTES.COMMANDER_DASHBOARD);
      }
    } else {
      setErrorMessage(res.error || 'Mission commander provisioning request failed.');
    }
  };

  const handleUseDemoCode = () => {
    setInvitationCode('NASA-DIR-HQ-01');
  };

  return (
    <div className="min-h-screen bg-astro-obsidian text-astro-text-primary flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/30 via-astro-obsidian to-black pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Link to={ROUTES.COMMANDER_SIGNIN} className="flex items-center space-x-2 text-xs font-mono text-astro-text-secondary hover:text-amber-400 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO COMMAND SIGN-IN</span>
        </Link>

        <div className="flex items-center space-x-2 font-mono text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-sm border border-amber-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>DIRECTORATE ENROLLMENT</span>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="relative z-10 max-w-xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-white/[0.03] border border-amber-500/20 backdrop-blur-md rounded-lg p-6 sm:p-8 shadow-2xl relative">
          {pendingStatus ? (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-bold text-white">
                  DIRECTORATE CLEARANCE APPLICATION LOGGED
                </h2>
                <p className="font-body text-xs text-astro-text-secondary leading-relaxed max-w-md mx-auto">
                  Your identity request for <strong className="text-white">{fullName}</strong> ({email}) has been
                  forwarded to NASA Headquarters Operations Command. In accordance with executive aerospace protocols,
                  Mission Commander accounts require administrator approval before flight telemetry clearance is unlocked.
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-amber-300">
                Notice: For immediate demonstration review, use authorized code:{' '}
                <button
                  type="button"
                  onClick={() => {
                    setPendingStatus(false);
                    setInvitationCode('NASA-DIR-HQ-01');
                  }}
                  className="font-bold underline hover:text-white"
                >
                  NASA-DIR-HQ-01
                </button>
              </div>

              <Link
                to={ROUTES.COMMANDER_SIGNIN}
                className="inline-flex items-center justify-center py-2 px-6 bg-amber-500 text-black font-mono text-xs font-bold rounded-sm hover:bg-amber-400 transition-colors"
              >
                Return to Command Sign-In
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-sm bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-display text-lg font-bold text-white">Mission Commander Account Provisioning</h1>
                  <span className="font-mono text-[10px] text-astro-text-secondary">
                    Flight Operations Directorate Executive Access
                  </span>
                </div>
              </div>

              {/* Warning Banner */}
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-sm text-[11px] text-amber-300 leading-relaxed flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>RESTRICTED PROVISIONING:</strong> Mission Commander accounts provide high-level crew readiness
                  and environmental telemetry. By NASA protocol, individual psychological journals remain masked.
                </span>
              </div>

              {errorMessage && (
                <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 rounded-sm text-xs text-red-300 flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Full Executive Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Director Rachel Sterling"
                      required
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Commander ID / Warrant</label>
                    <input
                      type="text"
                      value={commanderId}
                      onChange={(e) => setCommanderId(e.target.value)}
                      placeholder="e.g. NASA-DIR-3301"
                      required
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Directorate Email</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-astro-text-tertiary" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="commander@nasa.ops.gov"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Official Designation</label>
                    <div className="relative">
                      <Briefcase className="w-3.5 h-3.5 absolute left-3 top-3 text-astro-text-tertiary" />
                      <input
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        placeholder="e.g. FLIGHT DIRECTOR"
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs text-astro-text-secondary">Mission Assignment</label>
                  <input
                    type="text"
                    value={mission}
                    onChange={(e) => setMission(e.target.value)}
                    placeholder="Ares-VI Deep Space Expedition"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Passphrase (min 8 char)</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-astro-text-tertiary" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Confirm Passphrase</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-astro-text-tertiary" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••••••"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Authorization Code */}
                <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-sm space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                      <Key className="w-3 h-3 text-amber-400" />
                      <span>Executive Directorate Authorization Code</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseDemoCode}
                      className="text-[9px] font-mono text-amber-400 underline hover:text-white"
                    >
                      Use Demo Code
                    </button>
                  </div>
                  <input
                    type="text"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Enter code e.g. NASA-DIR-HQ-01 (Optional)"
                    className="w-full px-3 py-1.5 bg-black/40 border border-amber-500/30 rounded-sm text-xs font-mono text-white placeholder:text-white/20 uppercase focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[10px] font-mono text-astro-text-secondary leading-tight">
                    Valid codes grant instantaneous clearance. Registrations without authorization codes remain pending review by Mission Ops.
                  </p>
                </div>

                {/* Terms Acceptance */}
                <label className="flex items-start space-x-2 text-xs font-mono text-astro-text-secondary cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="accent-amber-400 w-3.5 h-3.5 mt-0.5"
                  />
                  <span>
                    I confirm that I will not attempt to circumvent astronaut medical privacy and accept that psychological journals are strictly confidential under NASA-STD-3001.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold rounded-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-md mt-2"
                >
                  {isLoading ? (
                    <span>PROCESSING EXECUTIVE ENROLLMENT...</span>
                  ) : (
                    <>
                      <span>Submit Commander Provisioning Request</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center font-mono text-xs text-astro-text-secondary">
                <span>Already provisioned? </span>
                <Link to={ROUTES.COMMANDER_SIGNIN} className="text-amber-400 font-bold hover:underline">
                  Sign In →
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};
