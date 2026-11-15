import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import {
  UserPlus,
  Lock,
  Mail,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Key,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const AstronautSignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [astronautId, setAstronautId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mission, setMission] = useState('Ares-VI Mars Expedition');
  const [designation, setDesignation] = useState('MISSION SPECIALIST');
  const [dateOfBirth, setDateOfBirth] = useState('1992-06-15');
  const [emergencyContact, setEmergencyContact] = useState('Houston Comms Relay / Next-of-Kin');
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
      setErrorMessage('Passphrase must be at least 8 characters long for flight telemetry security.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('You must accept the NASA/ESA Flight Telemetry & Medical Monitoring Protocols.');
      return;
    }

    setIsLoading(true);
    const res = await signup('ASTRONAUT', {
      fullName,
      email,
      idNumber: astronautId,
      password,
      invitationCode,
      mission,
      designation,
      emergencyContact,
      dateOfBirth,
    });
    setIsLoading(false);

    if (res.success) {
      if (res.requiresApproval) {
        setPendingStatus(true);
      } else {
        navigate(ROUTES.ASTRONAUT_DASHBOARD);
      }
    } else {
      setErrorMessage(res.error || 'Registration failed.');
    }
  };

  const handleUseDemoCode = () => {
    setInvitationCode('ARES6-ASTRO-2026');
  };

  return (
    <div className="min-h-screen bg-astro-obsidian text-astro-text-primary flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-astro-obsidian to-black pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Link to={ROUTES.ASTRONAUT_SIGNIN} className="flex items-center space-x-2 text-xs font-mono text-astro-text-secondary hover:text-cyan-400 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO SIGN-IN</span>
        </Link>

        <div className="flex items-center space-x-2 font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-sm border border-cyan-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>ASTRONAUT REGISTRATION</span>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="relative z-10 max-w-xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-white/[0.03] border border-cyan-500/20 backdrop-blur-md rounded-lg p-6 sm:p-8 shadow-2xl relative">
          {pendingStatus ? (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-bold text-white">
                  ENROLLMENT APPLICATION SUBMITTED
                </h2>
                <p className="font-body text-xs text-astro-text-secondary leading-relaxed max-w-md mx-auto">
                  Your identity request for <strong className="text-white">{fullName}</strong> ({email}) has been
                  logged in the mission provisioning queue. In accordance with flight security protocols, new astronaut accounts remain
                  pending approval by the Flight Operations Directorate before biometric access is granted.
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-cyan-300">
                Notice: For instant hackathon access, you can use invitation code:{' '}
                <button
                  type="button"
                  onClick={() => {
                    setPendingStatus(false);
                    setInvitationCode('ARES6-ASTRO-2026');
                  }}
                  className="font-bold underline hover:text-white"
                >
                  ARES6-ASTRO-2026
                </button>
              </div>

              <Link
                to={ROUTES.ASTRONAUT_SIGNIN}
                className="inline-flex items-center justify-center py-2 px-6 bg-cyan-500 text-black font-mono text-xs font-bold rounded-sm hover:bg-cyan-400 transition-colors"
              >
                Return to Sign-In
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-sm bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-display text-lg font-bold text-white">Astronaut Flight Registration</h1>
                  <span className="font-mono text-[10px] text-astro-text-secondary">
                    NASA & ESA Integrated Flight Manifest Enclave
                  </span>
                </div>
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
                    <label className="font-mono text-xs text-astro-text-secondary">Full Legal Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Lt. Cmdr. Sarah Vance"
                      required
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Astronaut ID / Badge</label>
                    <input
                      type="text"
                      value={astronautId}
                      onChange={(e) => setAstronautId(e.target.value)}
                      placeholder="e.g. NASA-CDR-9912"
                      required
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Official Mission Email</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-astro-text-tertiary" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="astronaut@nasa.ares6.gov"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Crew Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="e.g. SCIENCE OFFICER"
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Mission Assignment</label>
                    <input
                      type="text"
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      placeholder="Ares-VI Mars Expedition"
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Date of Birth</label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs text-astro-text-secondary">Emergency Contact Channel</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Next-of-Kin Name & Earth Comms Relay"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400"
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
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400"
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
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Mission Invitation / Authorization Code */}
                <div className="p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-sm space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-xs font-bold text-cyan-300 flex items-center space-x-1.5">
                      <Key className="w-3 h-3 text-cyan-400" />
                      <span>Flight Invitation / Authorization Code</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseDemoCode}
                      className="text-[9px] font-mono text-cyan-400 underline hover:text-white"
                    >
                      Use Demo Code
                    </button>
                  </div>
                  <input
                    type="text"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Enter code e.g. ARES6-ASTRO-2026 (Optional)"
                    className="w-full px-3 py-1.5 bg-black/40 border border-cyan-500/30 rounded-sm text-xs font-mono text-white placeholder:text-white/20 uppercase focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] font-mono text-astro-text-secondary leading-tight">
                    Valid codes grant instant account activation. Registrations without authorization codes are queued for Flight Surgeon approval.
                  </p>
                </div>

                {/* Terms Acceptance */}
                <label className="flex items-start space-x-2 text-xs font-mono text-astro-text-secondary cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="accent-cyan-400 w-3.5 h-3.5 mt-0.5"
                  />
                  <span>
                    I acknowledge that vital signs, circadian telemetry, and radiation readings are subject to NASA-STD-3001 operational monitoring standards.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold rounded-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-md mt-2"
                >
                  {isLoading ? (
                    <span>PROCESSING PROVISIONING REQUEST...</span>
                  ) : (
                    <>
                      <span>Submit Flight Account Registration</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center font-mono text-xs text-astro-text-secondary">
                <span>Already have a manifested account? </span>
                <Link to={ROUTES.ASTRONAUT_SIGNIN} className="text-cyan-400 font-bold hover:underline">
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
