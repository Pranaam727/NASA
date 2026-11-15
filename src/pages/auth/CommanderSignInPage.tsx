import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/editorial/AuthLayout';
import {
  ShieldAlert,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Zap,
  AlertCircle,
  KeyRound,
} from 'lucide-react';

export const CommanderSignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('NASA-DIR-1002');
  const [email, setEmail] = useState('gregory.hayes@nasa.ops.gov');
  const [password, setPassword] = useState('Command2026!');
  const [mfaCode, setMfaCode] = useState('884210');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const res = await login('MISSION_COMMANDER', email || identifier, password, mfaCode);
    setIsLoading(false);

    if (res.success) {
      navigate(ROUTES.COMMANDER_DASHBOARD);
    } else {
      setErrorMessage(res.error || 'Command authentication challenge failed. Verify credentials.');
    }
  };

  const handleFillDemo = () => {
    setIdentifier('NASA-DIR-1002');
    setEmail('gregory.hayes@nasa.ops.gov');
    setPassword('Command2026!');
    setMfaCode('884210');
    setErrorMessage(null);
  };

  return (
    <AuthLayout
      title="COMMANDER ACCESS"
      subtitle="Access mission readiness overview, radiation budget vs. NASA PEL, and ECLSS life support telemetry."
      badge="MISSION CONTROL · STATION 03"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#071311] text-[#F5B94C] flex items-center justify-center border-2 border-[#F5B94C]/50 shadow-cyberGlow">
            <ShieldAlert className="w-7 h-7" />
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
              <span>Director / Commander ID</span>
              <span className="text-[10px] text-[#5B7B75]">e.g. NASA-DIR-1002</span>
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="NASA-DIR-1002"
              required
              className="w-full px-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">Operations Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#5B7B75]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@nasa.ops.gov"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">Command Passphrase</label>
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
              <span>Commander RSA Token</span>
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
              <span>Remember mission commander console authorization</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#F5B94C] hover:bg-[#FCD34D] text-[#020807] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-cyberGlow mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>AUTHORIZING COMMAND LEVEL ACCESS...</span>
            ) : (
              <>
                <span className="uppercase tracking-wider">Authorize Mission Overview</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleFillDemo}
            className="w-full py-2 px-3 bg-[#071311] hover:bg-[#0A1716] text-[#91A9A4] hover:text-[#F4FAF8] border border-[#24E6D0]/25 rounded-xl font-mono text-[10px] font-bold transition-all flex items-center justify-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5 text-[#F5B94C]" />
            <span>Fill Demo Credentials (Director Gregory Hayes)</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#24E6D0]/15 text-center font-mono text-xs text-[#5B7B75]">
          <span>Requesting flight commander clearance? </span>
          <Link to={ROUTES.COMMANDER_SIGNUP} className="text-[#24E6D0] font-bold hover:underline ml-1">
            Register Commander Account →
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
