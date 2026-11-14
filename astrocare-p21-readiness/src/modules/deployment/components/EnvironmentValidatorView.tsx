// ============================================================================
// AstroCare Module D: Environment Configuration & Secret Validator View
// Validates presence, formatting, and quarantine of application variables.
// ============================================================================

import React, { useState } from 'react';
import { 
  Key, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  FileCode,
  ShieldAlert
} from 'lucide-react';
import { EnvironmentValidationResult } from '../types';
import { EnvironmentProfile, validateEnvironmentVariables } from '../services/environmentValidator';
import { StatusBadge } from './StatusBadge';

interface EnvironmentValidatorViewProps {
  envResults: EnvironmentValidationResult[];
  onProfileChange?: (profile: EnvironmentProfile) => void;
}

export const EnvironmentValidatorView: React.FC<EnvironmentValidatorViewProps> = ({
  envResults: initialEnvResults,
  onProfileChange
}) => {
  const [profile, setProfile] = useState<EnvironmentProfile>('development');
  const [envResults, setEnvResults] = useState<EnvironmentValidationResult[]>(initialEnvResults);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleProfileSwitch = (newProfile: EnvironmentProfile) => {
    setProfile(newProfile);
    const updated = validateEnvironmentVariables(newProfile);
    setEnvResults(updated);
    if (onProfileChange) onProfileChange(newProfile);
  };

  const sampleEnvExample = `# ==============================================================================
# AstroCare Aerospace Biomedical Intelligence Platform - Environment Config
# Profile: ${profile.toUpperCase()}
# ==============================================================================

# 1. Official NASA API Key (Optional for DEMO_MODE)
# Register for high-throughput access at: https://api.nasa.gov/
NASA_API_KEY=DEMO_KEY

# 2. Google Gemini Clinical Assistant (Used in P13 AI Intelligence)
# Proxy backend handles queries to protect this key from browser exposure
GEMINI_API_KEY=AIzaSyAstroCareDemoKeyExample39Chars_XX

# 3. PostgreSQL Telemetry Store (Supabase)
SUPABASE_URL=https://astrocare-telemetry.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.examplePayloadSignature

# 4. Endpoints & Network Topology
BACKEND_API_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# 5. Runtime Flags
APPLICATION_ENV=${profile}
DEMO_MODE=true
`;

  const handleCopyEnv = () => {
    navigator.clipboard.writeText(sampleEnvExample);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
              SECRET SANITIZATION & CONFIG
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Profile: {profile.toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Environment Configuration & Secret Quarantine Validator
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Validates format patterns, missing variables, and prevents API key exposure in frontend client bundles. Secret values are strictly masked.
          </p>
        </div>

        {/* Profile Switcher */}
        <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800">
          {(['development', 'staging', 'production'] as EnvironmentProfile[]).map(p => (
            <button
              key={p}
              onClick={() => handleProfileSwitch(p)}
              className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-md uppercase transition-all ${
                profile === p
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Security Rule Warning */}
      <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="text-amber-400 font-bold block mb-0.5">
            Aerospace Security Quarantine Standard (OWASP / NASA-STD-2820):
          </span>
          Never prefix private API keys (such as <code className="text-slate-200 font-mono">GEMINI_API_KEY</code>) with <code className="text-slate-200 font-mono">VITE_</code>. Vite automatically bundles all <code className="text-slate-200 font-mono">VITE_*</code> variables into client-side JS bundles. AstroCare routes all AI and telemetry requests through a dedicated backend proxy to prevent credential exfiltration.
        </div>
      </div>

      {/* Variables Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Configuration Key</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Expected Format</th>
                <th className="py-3 px-4">Secret Masking</th>
                <th className="py-3 px-4">Validation Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {envResults.map(item => (
                <tr key={item.key} className="hover:bg-slate-850/60 transition-colors">
                  <td className="py-3 px-4 font-bold text-cyan-300">
                    <div className="flex items-center gap-1.5">
                      {item.isSecret ? <Key className="w-3.5 h-3.5 text-amber-400" /> : <FileCode className="w-3.5 h-3.5 text-slate-500" />}
                      <span>{item.key}</span>
                      {item.required && (
                        <span className="text-[10px] text-rose-400 font-normal">*required</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-400 text-[11px]">
                    {item.expectedFormat}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {item.isSecret ? (
                      <span className="text-slate-500">•••••••• (quarantined)</span>
                    ) : (
                      <span className="text-emerald-400">Public Config</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans text-xs">
                    {item.recommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* .env.example Snippet Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white font-mono">
              Reference .env.example ({profile} profile)
            </span>
          </div>

          <button
            onClick={handleCopyEnv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700"
          >
            {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedEnv ? 'Copied' : 'Copy Template'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-cyan-300 overflow-x-auto border border-slate-800/80 leading-relaxed">
          {sampleEnvExample}
        </pre>
      </div>
    </div>
  );
};
