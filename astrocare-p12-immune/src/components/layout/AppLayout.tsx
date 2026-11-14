import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Navbar } from './Navbar';
import { AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-space-950 text-slate-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Scientific & Clinical Disclaimer Footer */}
      <footer className="bg-space-900 border-t border-space-800 text-xs text-slate-400 py-6 px-4 font-mono mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>AstroCare Biomedical Platform — Module P12 (Immune & Lab Intelligence)</span>
            </div>
            <p className="text-[11px] text-slate-400 max-w-3xl leading-relaxed">
              Scientific framework powered by NASA Human Research Program (HRP), Flow Cytometry Methods (NTRS-20230016983),
              and Open Science Data Repository (OSDR OSD-575, OSD-53, OSD-2, OSD-4, OSD-54).
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <Link to="/immune/research" className="text-cyan-400 hover:underline flex items-center gap-1">
              <span>NASA Datasets</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link to="/immune/insights" className="text-cyan-400 hover:underline">
              Scientific Basis
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-4 border-t border-space-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-1 text-amber-400/80">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>
              NON-DIAGNOSTIC RESEARCH TOOL: Demonstration data is simulated. A result outside selected reference intervals does not automatically establish disease.
            </span>
          </div>
          <div>Version 1.0.0-P12 • NASA Hackathon Standalone Distribution</div>
        </div>
      </footer>
    </div>
  );
};
