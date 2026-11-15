import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/editorial/AuthLayout';
import {
  Stethoscope,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Zap,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

export const MedicalSignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('ESA-SURG-4190');
  const [email, setEmail] = useState('sarah.vance@esa.flightmed.org');
  const [password, setPassword] = useState('FlightMed2026!');
  const [mfaCode, setMfaCode] = useState('884210');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const res = await login('MEDICAL_OFFICER', email || identifier, password, mfaCode);
    setIsLoading(false);

    if (res.success) {
      navigate(ROUTES.MEDICAL_DASHBOARD);
    } else {
      setErrorMessage(res.error || 'Clinical authentication challenge failed. Verify credentials.');
    }
  };

  const handleFillDemo = () => {
    setIdentifier('ESA-SURG-4190');
    setEmail('sarah.vance@esa.flightmed.org');
    setPassword('FlightMed2026!');
    setMfaCode('884210');
    setErrorMessage(null);
  };

  return (
    <AuthLayout
      title="MEDICAL OFFICER ACCESS"
      subtitle="Access crew health triage matrix, diagnostic laboratory assays, and flight surgeon emergency authority."
      badge="CLINICAL TRIAGE · STATION 02"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#071311] text-[#24E6D0] flex items-center justify-center border-2 border-[#24E6D0]/50 shadow-cyberGlow">
            <Stethoscope className="w-7 h-7" />
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-[#FF646E]/15 border border-[#FF646E]/30 rounded-xl text-xs text-[#FF646E] flex items-start space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-[#F4FAF8] flex justify-between uppercase">
              <span>Medical Officer ID</span>
              <span className="text-[10px] text-[#5B7B75]">e.g. ESA-SURG-4190</span>
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="ESA-SURG-4190"
              required
              className="w-full px-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">Flight Surgeon Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#5B7B75]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@flightmed.org"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">Clinical Passphrase</label>
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="font-mono text-[10px] text-[#24E6D0] font-semibold hover:underline"
              >
                Forgot Key?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#5B7B75]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-[#5B7B75] hover:text-[#24E6D0]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* MFA Token */}
          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-[#F4FAF8] flex justify-between uppercase">
              <span>Hardware MFA Token</span>
              <span className="text-[10px] text-[#5B7B75]">6 Digits</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-[#5B7B75]" />
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                placeholder="884210"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-bold tracking-widest"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs font-mono text-[#91A9A4] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#24E6D0] w-3.5 h-3.5"
              />
              <span>Maintain clinical clearance for shift</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-cyberGlow mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>VALIDATING CLINICAL CREDENTIALS...</span>
            ) : (
              <>
                <span className="uppercase tracking-wider">Access Medical Intelligence</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-3 bg-[#071311] hover:bg-[#0A1716] text-[#91A9A4] hover:text-[#F4FAF8] border border-[#24E6D0]/25 rounded-xl font-mono text-[10px] font-bold transition-all flex items-center justify-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-[#24E6D0]" />
            <span>Fill Demo Credentials (Dr. Sarah Vance)</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#24E6D0]/15 text-center font-mono text-xs text-[#5B7B75]">
          <span>Need flight surgeon credential provisioning? </span>
          <Link to={ROUTES.MEDICAL_SIGNUP} className="text-[#24E6D0] font-bold hover:underline ml-1">
            Request Medical Clearance →
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
