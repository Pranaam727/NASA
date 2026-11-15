import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AuthLayout } from '@/components/editorial/AuthLayout';
import { Lock, ArrowRight, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [resetToken, setResetToken] = useState('ARES6-REC-8842');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Passphrase must be at least 8 characters.');
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      navigate(ROUTES.AUTH);
    }, 2000);
  };

  return (
    <AuthLayout
      title="RESET SECURITY KEY"
      subtitle="Enter your verification token and provision a new mission passphrase."
      badge="SECURITY ENCLAVE · KEY UPDATE"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#071311] text-[#24E6D0] flex items-center justify-center border-2 border-[#24E6D0]/50 shadow-cyberGlow">
            <KeyRound className="w-7 h-7" />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-[#FF646E]/15 border border-[#FF646E]/30 rounded-xl text-xs text-[#FF646E] flex items-start space-x-2 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {isSuccess ? (
          <div className="space-y-4 text-center py-4">
            <CheckCircle2 className="w-12 h-12 text-[#24E6D0] mx-auto animate-pulse" />
            <div className="text-xs font-mono text-[#F4FAF8] bg-[#071311] p-4 rounded-xl border border-[#24E6D0]/30 font-medium leading-relaxed">
              Passphrase successfully updated! Redirecting to station sign-in...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">Recovery Token</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                placeholder="ARES6-REC-XXXX"
                required
                className="w-full px-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">New Passphrase</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#5B7B75]" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs font-bold text-[#F4FAF8] uppercase">Confirm New Passphrase</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-[#5B7B75]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new passphrase"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-[#071311] border border-[#24E6D0]/25 rounded-xl text-xs font-mono text-[#F4FAF8] placeholder:text-[#5B7B75] focus:outline-none focus:border-[#24E6D0] transition-all font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-[#24E6D0] hover:bg-[#8BFFE9] text-[#020807] font-mono text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-cyberGlow mt-2"
            >
              <span className="uppercase tracking-wider">Update Mission Passphrase</span>
              <ArrowRight className="w-4 h-4" />
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
