import React from 'react';
import { BookOpen, Copy, Check, Terminal, ShieldAlert, Cpu } from 'lucide-react';

interface IntegrationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationGuideModal: React.FC<IntegrationGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const reactImportCode = `import { AstroCareAIModule, ProviderContextProvider, MockAIProvider } from 'ai-intelligence';

export function AstroCarePlatformDashboard() {
  return (
    <ProviderContextProvider initialConfig={{
      providerType: 'gemini-proxy',
      apiBaseUrl: 'http://localhost:3001',
      modelName: 'gemini-2.5-flash'
    }}>
      <AstroCareAIModule
        astronautId="AST-084-SC"
        missionId="EXP-72-ISS"
        onAlertGenerated={(alert) => console.log('Flight surgeon alert:', alert)}
      />
    </ProviderContextProvider>
  );
}`;

  const envConfigCode = `# AstroCare Gemini AI Intelligence Module (.env)
PORT=3001
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
GEMINI_MODEL=gemini-2.5-flash
# If GEMINI_API_KEY is not set, module automatically runs in high-fidelity mock simulation mode.`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/40 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AstroCare Module Integration Guide
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  ai-intelligence
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Aerospace Biomedical AI Assistant • React 19 + TypeScript + Vite + Gemini API Proxy
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-sm font-mono cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Quick Overview */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Module Specification & Overview
            </h3>
            <p className="leading-relaxed">
              The <strong>AstroCare Gemini AI Intelligence Module</strong> (<code className="text-cyan-300">ai-intelligence</code>) is an independently deployable, modular biomedical subsystem designed to interpret multi-domain astronaut telemetry, explain microgravity pathophysiological trends, ground findings in verified NASA research, and generate risk patterns for flight surgeons.
            </p>
          </div>

          {/* Security & Key Isolation Rule */}
          <div className="bg-emerald-950/30 p-4 rounded-xl border border-emerald-500/40 text-emerald-200 space-y-1.5">
            <div className="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-emerald-300">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Security Standard: Zero Client-Side API Key Exposure
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Google Gemini API keys are <strong>never embedded in frontend JavaScript or bundled assets</strong>. All Gemini API calls route through a lightweight, secure Node/Express backend proxy (`server/index.ts`) using the official <code className="text-cyan-300">@google/genai</code> SDK. If no key is configured, the module gracefully falls back to deterministic biomedical mock simulation with realistic NASA research citations.
            </p>
          </div>

          {/* Integration Option 1: React Component Embed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                1. Embedding in AstroCare Master Platform (React + TypeScript)
              </h4>
              <button
                onClick={() => copyToClipboard(reactImportCode, 'react-import')}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
              >
                {copiedSection === 'react-import' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSection === 'react-import' ? 'Copied' : 'Copy Snippet'}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
              <code>{reactImportCode}</code>
            </pre>
          </div>

          {/* Integration Option 2: Environment Setup */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                2. Environment Variables Configuration (.env.example)
              </h4>
              <button
                onClick={() => copyToClipboard(envConfigCode, 'env-config')}
                className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-mono cursor-pointer"
              >
                {copiedSection === 'env-config' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                {copiedSection === 'env-config' ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto">
              <code>{envConfigCode}</code>
            </pre>
          </div>

          {/* Running Standalone */}
          <div className="space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              3. Running Standalone / Development Mode
            </h4>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-[11px] space-y-2">
              <div className="text-slate-400"># Run frontend and backend proxy concurrently:</div>
              <div className="text-cyan-300">npm run dev</div>
              <div className="text-slate-400 mt-2"># Run production build and type checking:</div>
              <div className="text-cyan-300">npm run build</div>
              <div className="text-slate-400 mt-2"># Run test suite:</div>
              <div className="text-cyan-300">npm test</div>
            </div>
          </div>

          {/* Provider Abstraction Guide */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              4. Provider Abstraction Architecture
            </h4>
            <p className="text-[11px] leading-relaxed">
              The module defines an <code className="text-cyan-300">IAIProvider</code> interface with standard methods:
            </p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300 pl-2">
              <li><code className="text-cyan-300">sendMessage(messages, options, healthContext, missionContext)</code></li>
              <li><code className="text-cyan-300">interpretHealthData(healthPayload, missionContext)</code></li>
              <li><code className="text-cyan-300">summarizeResearch(docId, query)</code></li>
              <li><code className="text-cyan-300">generateBiomedicalInsights(healthPayload, missionContext)</code></li>
            </ul>
            <p className="text-[11px] text-slate-400">
              The master platform can supply its own custom provider implementation simply by passing an instance implementing <code className="text-cyan-300">IAIProvider</code> to the <code className="text-cyan-300">ProviderContextProvider</code>.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
