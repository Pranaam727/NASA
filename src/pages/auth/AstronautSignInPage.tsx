import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/editorial/AuthLayout';
import {
  User,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  Zap,
  AlertCircle,
} from 'lucide-react';

export const AstronautSignInPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState('ASTRO-01');
  const [email, setEmail] = useState('marcus.chen@nasa.ares6.gov');
  const [password, setPassword] = useState('AstroPass2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const res = await login('ASTRONAUT', email || identifier, password);
    setIsLoading(false);

    if (res.success) {
      navigate(ROUTES.ASTRONAUT_DASHBOARD);
    } else {
      setErrorMessage(res.error || 'Authentication challenge failed. Verify credentials.');
    }
  };

  const handleFillDemo = () => {
    setIdentifier('ASTRO-01');
    setEmail('marcus.chen@nasa.ares6.gov');
    setPassword('AstroPass2026!');
    setErrorMessage(null);
  };

  return (
    <AuthLayout
      title="ASTRONAUT ACCESS"
      subtitle="Access your personal flight telemetry cockpit, biometric baselines, and daily check-in protocols."
      badge="ASTRONAUT ENCLAVE · STATION 01"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#071311] text-[#24E6D0] flex items-center justify-center border-2 border-[#24E6D0]/50 shadow-cyberGlow">
            <User className="w-7 h-7" />
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
              <span>Astronaut Badge / ID</span>
              <span className="text-[10px] text-[#5B7B75]">e.g. ASTRO-01</span>
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="NASA-CDR-8842 or ASTRO-01"
              required
              className="w-full px-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
            />
          </div>

          <div className="space-y-1">
            <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">Mission Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#5B7B75]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="astronaut@nasa.ares6.gov"
                required
                className="w-full pl-10 pr-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">Security Passphrase</label>
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

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 text-xs font-mono text-[#91A9A4] cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-[#24E6D0] w-3.5 h-3.5"
              />
              <span>Remember session for Sol 142</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-cyberGlow mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>VERIFYING FLIGHT CREDENTIALS...</span>
            ) : (
              <>
                <span className="uppercase tracking-wider">Sign In to Health Cockpit</span>
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
            <span>Fill Demo Credentials (Cmdr. Marcus Chen)</span>
          </button>
        </form>

        <div className="pt-4 border-t border-[#24E6D0]/15 text-center font-mono text-xs text-[#5B7B75]">
          <span>New crew member not yet provisioned? </span>
          <Link to={ROUTES.ASTRONAUT_SIGNUP} className="text-[#24E6D0] font-bold hover:underline ml-1">
            Register Flight Account →
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
