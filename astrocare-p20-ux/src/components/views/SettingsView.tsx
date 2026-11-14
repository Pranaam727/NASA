import React from 'react';
import { useTheme } from '../../design-system/ThemeContext';
import { Sun, Moon, Eye, Sliders, ShieldCheck, ExternalLink, Activity } from 'lucide-react';
import { CARD_SURFACE, FOCUS_RING } from '../../design-system/utils';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme, setTheme, highContrast, toggleHighContrast } = useTheme();

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div className="bg-white dark:bg-[#0b101d] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base sm:text-lg font-bold font-sans text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-500" />
          <span>Platform Experience & Accessibility Settings</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
          Configure interface appearance, high-contrast visual ergonomics, and mission-control display standards.
        </p>
      </div>

      {/* Theme Selection */}
      <div className={`p-6 rounded-2xl ${CARD_SURFACE} space-y-4`}>
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-sans">
            Visual Theme & Workspace Environment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Switch between low-glare Dark Mission Control and high-clarity Light Scientific Workspace.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Dark Mode Card */}
          <div
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              theme === 'dark'
                ? 'border-cyan-500 bg-slate-950 text-white shadow-lg glow-cyan'
                : 'border-slate-200 dark:border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Moon className="w-4 h-4 text-cyan-400" />
                <span>Dark Mission Control</span>
              </div>
              {theme === 'dark' && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Optimized for nocturnal mission ops consoles, reducing optical fatigue during long monitoring shifts.
            </p>
          </div>

          {/* Light Mode Card */}
          <div
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
              theme === 'light'
                ? 'border-cyan-500 bg-white text-slate-900 shadow-lg'
                : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Scientific Workspace</span>
              </div>
              {theme === 'light' && (
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
              )}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              High-contrast daylight laboratory and research paper evaluation mode with crisp typography.
            </p>
          </div>

        </div>
      </div>

      {/* Accessibility & Visual Contrast */}
      <div className={`p-6 rounded-2xl ${CARD_SURFACE} space-y-4`}>
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white font-sans flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-500" />
            <span>WCAG 2.2 Level AA Accessibility Ergonomics</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Designed according to NASA Digital Accessibility Guidelines and Section 508 standards.
          </p>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">
              High-Contrast Border & Element Outlines
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reinforces all card boundaries, charts, and telemetry pills with amplified contrast ratios.
            </p>
          </div>

          <button
            onClick={toggleHighContrast}
            aria-checked={highContrast}
            role="switch"
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              highContrast ? 'bg-cyan-600 justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-850">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Keyboard Navigable • Screen Reader Semantics Active</span>
          </div>

          <a
            href="https://www.nasa.gov/general/accessibility/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Review NASA Accessibility Policy</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};
