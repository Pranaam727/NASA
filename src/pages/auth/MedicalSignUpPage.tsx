import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import {
  Stethoscope,
  Lock,
  Mail,
  ShieldCheck,
  ArrowLeft,
  AlertCircle,
  Key,
  CheckCircle2,
  Clock,
  Building,
} from 'lucide-react';

export const MedicalSignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [fullName, setFullName] = useState('');
  const [officerId, setOfficerId] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('ESA European Astronaut Centre (EAC)');
  const [qualification, setQualification] = useState('MD, Aerospace Medicine Certified');
  const [specialization, setSpecialization] = useState('Critical Care & Telemedicine');
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
      setErrorMessage('Passphrase must be at least 8 characters long.');
      return;
    }

    if (!acceptTerms) {
      setErrorMessage('You must accept the International Space Station Partner Clinical Privacy Guidelines.');
      return;
    }

    setIsLoading(true);
    const res = await signup('MEDICAL_OFFICER', {
      fullName,
      email,
      idNumber: officerId,
      password,
      invitationCode,
      organization,
      specialization: `${qualification} - ${specialization}`,
    });
    setIsLoading(false);

    if (res.success) {
      if (res.requiresApproval) {
        setPendingStatus(true);
      } else {
        navigate(ROUTES.MEDICAL_DASHBOARD);
      }
    } else {
      setErrorMessage(res.error || 'Medical officer registration failed.');
    }
  };

  const handleUseDemoCode = () => {
    setInvitationCode('ESA-MED-SURG-90');
  };

  return (
    <div className="min-h-screen bg-astro-obsidian text-astro-text-primary flex flex-col justify-between relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-950/40 via-astro-obsidian to-black pointer-events-none" />

      {/* Top Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/5">
        <Link to={ROUTES.MEDICAL_SIGNIN} className="flex items-center space-x-2 text-xs font-mono text-astro-text-secondary hover:text-teal-400 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO CLINICAL SIGN-IN</span>
        </Link>

        <div className="flex items-center space-x-2 font-mono text-[10px] text-teal-400 bg-teal-500/10 px-2.5 py-1 rounded-sm border border-teal-500/20">
          <ShieldCheck className="w-3 h-3" />
          <span>FLIGHT SURGEON ENROLLMENT</span>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="relative z-10 max-w-xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-white/[0.03] border border-teal-500/20 backdrop-blur-md rounded-lg p-6 sm:p-8 shadow-2xl relative">
          {pendingStatus ? (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-teal-500/15 border border-teal-500/40 flex items-center justify-center text-teal-400 mx-auto">
                <Clock className="w-8 h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-xl font-bold text-white">
                  CLINICAL WARRANT APPLICATION PENDING
                </h2>
                <p className="font-body text-xs text-astro-text-secondary leading-relaxed max-w-md mx-auto">
                  Your registration for <strong className="text-white">{fullName}</strong> ({email}) has been
                  forwarded to the Space Medicine Board. To preserve astronaut medical confidentiality, access to
                  crew laboratory records and triage matrices is restricted until your credentials are verified.
                </p>
              </div>

              <div className="p-3 bg-white/5 border border-white/10 rounded-sm text-xs font-mono text-teal-300">
                Notice: For immediate demonstration review, use validated invitation code:{' '}
                <button
                  type="button"
                  onClick={() => {
                    setPendingStatus(false);
                    setInvitationCode('ESA-MED-SURG-90');
                  }}
                  className="font-bold underline hover:text-white"
                >
                  ESA-MED-SURG-90
                </button>
              </div>

              <Link
                to={ROUTES.MEDICAL_SIGNIN}
                className="inline-flex items-center justify-center py-2 px-6 bg-teal-500 text-black font-mono text-xs font-bold rounded-sm hover:bg-teal-400 transition-colors"
              >
                Return to Sign-In
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-sm bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-display text-lg font-bold text-white">Medical Officer Credential Registration</h1>
                  <span className="font-mono text-[10px] text-astro-text-secondary">
                    Flight Medicine Clinical Authority Manifest
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
                    <label className="font-mono text-xs text-astro-text-secondary">Full Physician Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Dr. Arthur Pendelton"
                      required
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Medical Officer ID</label>
                    <input
                      type="text"
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      placeholder="e.g. ESA-SURG-7718"
                      required
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Institutional Email</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-astro-text-tertiary" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="physician@esa.flightmed.org"
                        required
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Parent Organization</label>
                    <div className="relative">
                      <Building className="w-3.5 h-3.5 absolute left-3 top-3 text-astro-text-tertiary" />
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="ESA / NASA / JAXA"
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Medical Qualification</label>
                    <input
                      type="text"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      placeholder="e.g. MD, Board Certified"
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-teal-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-astro-text-secondary">Clinical Specialization</label>
                    <input
                      type="text"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      placeholder="e.g. Spaceflight Critical Care"
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-teal-400"
                    />
                  </div>
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
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-teal-400"
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
                        className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-sm text-xs font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-teal-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Authorization Code */}
                <div className="p-3 bg-teal-950/20 border border-teal-500/30 rounded-sm space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-xs font-bold text-teal-300 flex items-center space-x-1.5">
                      <Key className="w-3 h-3 text-teal-400" />
                      <span>Medical Board Authorization Code</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleUseDemoCode}
                      className="text-[9px] font-mono text-teal-400 underline hover:text-white"
                    >
                      Use Demo Code
                    </button>
                  </div>
                  <input
                    type="text"
                    value={invitationCode}
                    onChange={(e) => setInvitationCode(e.target.value)}
                    placeholder="Enter code e.g. ESA-MED-SURG-90 (Optional)"
                    className="w-full px-3 py-1.5 bg-black/40 border border-teal-500/30 rounded-sm text-xs font-mono text-white placeholder:text-white/20 uppercase focus:outline-none focus:border-teal-400"
                  />
                  <p className="text-[10px] font-mono text-astro-text-secondary leading-tight">
                    Authorizes access to crew biometric telemetry. Accounts registered without valid codes require manual approval.
                  </p>
                </div>

                {/* Terms Acceptance */}
                <label className="flex items-start space-x-2 text-xs font-mono text-astro-text-secondary cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="accent-teal-400 w-3.5 h-3.5 mt-0.5"
                  />
                  <span>
                    I agree to preserve astronaut confidentiality under the NASA/ESA Medical Protocol guidelines and swear to uphold aerospace clinical intervention integrity.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-black font-mono text-xs font-bold rounded-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50 shadow-md mt-2"
                >
                  {isLoading ? (
                    <span>VERIFYING CLINICAL BOARD CREDENTIALS...</span>
                  ) : (
                    <>
                      <span>Submit Flight Surgeon Registration</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center font-mono text-xs text-astro-text-secondary">
                <span>Already authorized? </span>
                <Link to={ROUTES.MEDICAL_SIGNIN} className="text-teal-400 font-bold hover:underline">
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
