import React from 'react';
import { Clock, ExternalLink, Calendar, CheckCircle } from 'lucide-react';

interface TimelineEvent {
  year: string;
  title: string;
  organization: string;
  summary: string;
  significance: string;
  sourceUrl?: string;
  category: string;
}

const MILESTONES: TimelineEvent[] = [
  {
    year: '2008–2009',
    title: 'Advanced Resistive Exercise Device (ARED) Deployed to ISS',
    organization: 'NASA Johnson Space Center',
    summary: 'ARED installed in ISS Node 3, providing up to 600 lbs of inertial resistive force for squats, deadlifts, and heel raises.',
    significance: 'Reduced monthly bone mineral density loss rate from ~1.5% to < 0.5%, preserving musculoskeletal functional capacity for long-duration expeditions.',
    sourceUrl: 'https://asbmr.onlinelibrary.wiley.com/doi/10.1002/jbmr.1976',
    category: 'Bone & Muscle'
  },
  {
    year: '2011–2012',
    title: 'Spaceflight-Associated Neuro-Ocular Syndrome (SANS) Officially Recognized',
    organization: 'NASA HRP Ophthalmology',
    summary: 'NASA flight surgeons formally document optic disc swelling, posterior globe flattening, and hyperopic refractive shifts in long-duration astronauts.',
    significance: 'SANS elevated to a top-tier exploration medical risk; spurred deployment of orbital Optical Coherence Tomography (OCT) to ISS Columbus.',
    sourceUrl: 'https://www.sciencedirect.com/science/article/pii/S016164201932338X',
    category: 'Neuro-Ocular'
  },
  {
    year: '2013',
    title: 'MSL Curiosity RAD Measures Interplanetary Galactic Cosmic Radiation',
    organization: 'NASA HRP / Southwest Research Institute',
    summary: 'In-situ measurements during 253-day cruise to Mars record an unshielded GCR dose equivalent rate of 1.84 mSv/day.',
    significance: 'Established the gold-standard physical benchmark for deep-space transit radiation dosimetry; proved 1000-day Mars mission approaches career limits.',
    sourceUrl: 'https://www.science.org/doi/10.1126/science.1235989',
    category: 'Radiation'
  },
  {
    year: '2016–2019',
    title: 'NASA Twins Study: Longitudinal Multi-Omics of 340-Day Spaceflight',
    organization: 'NASA Twins Research Consortium',
    summary: 'Comprehensive genomic, epigenetic, telomeric, and microbiome analysis of identical twin astronauts (Scott and Mark Kelly).',
    significance: 'Demonstrated in-flight telomere elongation followed by rapid landing shortening, persistent DNA structural mutations, and immune gene activation.',
    sourceUrl: 'https://www.science.org/doi/10.1126/science.aau8650',
    category: 'Multi-Omics'
  },
  {
    year: '2019',
    title: 'Detection of Internal Jugular Vein Thrombosis and Flow Stasis on ISS',
    organization: 'NASA JSC / LSU Health',
    summary: 'Vascular Doppler ultrasound revealed stagnant or retrograde venous flow in 55% of crew and one asymptomatic occlusive thrombosis requiring in-flight anticoagulation.',
    significance: 'Revealed previously unrecognized venous hemodynamics risks in microgravity; transformed in-flight vascular surveillance protocols.',
    sourceUrl: 'https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2755307',
    category: 'Cardiovascular'
  },
  {
    year: '2021–2024',
    title: 'NASA 600 mSv Single Lifetime Radiation Standard Implementation',
    organization: 'NASA Technical Standards / HRP',
    summary: 'Adoption of a gender-neutral 600 mSv lifetime career permissible exposure limit based on a 3% Risk of Exposure-Induced Death (REID) calculation.',
    significance: 'Unified NASA exploration shielding architecture requirements for Artemis lunar surface and Mars transit habitat engineering.',
    sourceUrl: 'https://ntrs.nasa.gov/citations/20220002138',
    category: 'Radiation & Architecture'
  }
];

export const ResearchTimeline: React.FC = () => {
  return (
    <div className="bg-space-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" /> Biomedical Research Milestones & Discovery Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Key historical and contemporary discoveries informing NASA Human Research Program flight rules
          </p>
        </div>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-space-800 text-slate-400 border border-slate-700">
          Chronological Archive
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {MILESTONES.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline node */}
            <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-space-950 border-2 border-cyan-400 group-hover:bg-cyan-400 transition-colors" />

            <div className="bg-space-950/70 p-4 rounded-xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {item.year}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-space-800 text-slate-300 border border-slate-700/80">
                  {item.category}
                </span>
              </div>

              <h4 className="text-sm font-semibold text-slate-100 leading-snug">
                {item.title}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed">
                {item.summary}
              </p>

              <div className="pt-2 border-t border-slate-800/70 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-cyan-300/90">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span><strong>Operational impact:</strong> {item.significance}</span>
                </div>

                {item.sourceUrl && (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors font-medium shrink-0"
                  >
                    Source <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
