import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';
import { AuthLayout } from '@/components/editorial/AuthLayout';
import { Mail, ArrowRight, KeyRound, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await resetPassword(email);
    setIsLoading(false);
    setIsSubmitted(true);
    setMsg(res.message);
  };

  return (
    <AuthLayout
      title="KEY RECOVERY"
      subtitle="Enter your mission personnel email to receive a secure quantum cryptographic recovery dispatch."
      badge="SECURITY ENCLAVE · CREDENTIAL RESET"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#071311] text-[#24E6D0] flex items-center justify-center border-2 border-[#24E6D0]/50 shadow-cyberGlow">
            <KeyRound className="w-7 h-7" />
          </div>
        </div>

        {isSubmitted ? (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-[#24E6D0] mx-auto animate-pulse" />
            <div className="text-xs font-mono text-[#F4FAF8] bg-[#071311] p-4 rounded-xl border border-[#24E6D0]/30 font-medium leading-relaxed">
              {msg}
            </div>
            <Link
              to={ROUTES.RESET_PASSWORD}
              className="w-full py-3 px-4 bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-cyberGlow"
            >
              <span>PROCEED TO KEY RESET →</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">Mission Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-[#5B7B75]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="personnel@nasa.ares6.gov"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-cyberGlow mt-2 disabled:opacity-50"
            >
              {isLoading ? (
                <span>DISPATCHING RECOVERY TOKEN...</span>
              ) : (
                <>
                  <span className="uppercase tracking-wider">Send Recovery Dispatch</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-[#24E6D0]/15 text-center font-mono text-xs text-[#5B7B75]">
          <Link to={ROUTES.AUTH} className="text-[#24E6D0] font-bold hover:underline">
            ← Return to Personnel Authentication
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};
