import React, { useState } from 'react'
import {
  Award,
  AlertTriangle,
  Info,
  CheckCircle2,
  Users,
  Microscope,
  HelpCircle,
  ShieldCheck,
  Search,
} from 'lucide-react'
import { EvidenceRecord, EvidenceType } from '../types/evidence.types'
import { ScientificClaim } from '../types/claim.types'
import { ScientificSource } from '../types/source.types'

interface EvidenceQualityMatrixProps {
  evidenceList: EvidenceRecord[]
  claims: ScientificClaim[]
  sources: ScientificSource[]
  onOpenEvidence: (evidence: EvidenceRecord) => void
}

export const EvidenceQualityMatrix: React.FC<EvidenceQualityMatrixProps> = ({
  evidenceList,
  claims,
  sources,
  onOpenEvidence,
}) => {
  const [filterType, setFilterType] = useState<EvidenceType | 'all'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const claimMap = new Map(claims.map((c) => [c.id, c]))
  const sourceMap = new Map(sources.map((s) => [s.id, s]))

  const filtered = evidenceList.filter((ev) => {
    if (filterType !== 'all' && ev.studyType !== filterType) return false
    if (searchTerm) {
      const q = searchTerm.toLowerCase().trim()
      const inOrg = ev.organism.toLowerCase().includes(q)
      const inMethod = ev.methodology.toLowerCase().includes(q)
      const inPop = ev.population.toLowerCase().includes(q)
      const inFindings = ev.keyFindings.toLowerCase().includes(q)
      if (!inOrg && !inMethod && !inPop && !inFindings) return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Scientific Quality Transparency Charter */}
      <div className="p-4 rounded-lg bg-astro-surface border border-astro-border text-xs text-slate-300 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 font-mono font-bold text-astro-cyan text-sm">
          <Award className="w-4 h-4" />
          AstroCare Evidence Quality & Scientific Integrity Principles
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded bg-astro-darkest/70 border border-astro-border space-y-1">
            <h5 className="font-semibold text-slate-200 flex items-center gap-1.5 font-mono text-[11px]">
              <Info className="w-3.5 h-3.5 text-astro-cyan" />
              No Fabricated Scores
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              We do not assign arbitrary numerical quality scores (e.g. "8.5/10"). Scientific rigor is multifaceted and cannot be collapsed into an artificial scalar value.
            </p>
          </div>

          <div className="p-3 rounded bg-astro-darkest/70 border border-astro-border space-y-1">
            <h5 className="font-semibold text-slate-200 flex items-center gap-1.5 font-mono text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Source vs. Study Rigor
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Organizational prestige (e.g. NASA, ESA) is not synonymous with study generalizability. An n=1 flight profile has immense mechanistic depth but distinct population limitations.
            </p>
          </div>

          <div className="p-3 rounded bg-astro-darkest/70 border border-astro-border space-y-1">
            <h5 className="font-semibold text-slate-200 flex items-center gap-1.5 font-mono text-[11px]">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Methodological Disclosure
            </h5>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Full transparency on cohort sizes, measurement tools, in silico assumptions, and physiological limitations is enforced across all evidence records.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-astro-surface border border-astro-border rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search methodology, organism, population..."
            className="w-full pl-8 pr-2.5 py-1.5 bg-astro-darkest border border-astro-border rounded text-xs text-slate-200 focus:outline-none focus:border-astro-cyan/50 font-mono"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="bg-astro-darkest border border-astro-border rounded px-3 py-1.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-astro-cyan/50"
        >
          <option value="all">All Study Classifications</option>
          <option value="human_astronaut_study">Human Astronaut Studies</option>
          <option value="ground_human_analog">Ground Human Analogs</option>
          <option value="animal_experiment">Animal Experiments</option>
          <option value="cell_culture">Cell Culture Experiments</option>
          <option value="computational_model">Computational Models</option>
          <option value="technical_report">Technical Reports</option>
          <option value="review_article">Review Articles</option>
        </select>
      </div>

      {/* Evidence Quality Table */}
      <div className="bg-astro-surface border border-astro-border rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-astro-border bg-astro-card/50 font-mono text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="py-3 px-4">Evidence ID & Study Type</th>
              <th className="py-3 px-3">Organism & Sample Size</th>
              <th className="py-3 px-3">Experimental Methodology</th>
              <th className="py-3 px-3">Documented Limitations</th>
              <th className="py-3 px-3">Associated Claim</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-astro-border/50 text-slate-300">
            {filtered.map((ev) => {
              const claim = claimMap.get(ev.claimId)
              const source = sourceMap.get(ev.sourceId)

              return (
                <tr
                  key={ev.id}
                  className="hover:bg-astro-card/30 transition-colors cursor-pointer"
                  onClick={() => onOpenEvidence(ev)}
                >
                  <td className="py-3 px-4 max-w-xs">
                    <div className="font-mono text-astro-cyan font-bold">{ev.id}</div>
                    <div className="text-[10px] px-1.5 py-0.5 rounded bg-astro-card border border-astro-border text-slate-300 font-mono uppercase inline-block mt-0.5">
                      {ev.studyType.replace(/_/g, ' ')}
                    </div>
                    {source && (
                      <div className="text-[10px] text-slate-400 line-clamp-1 mt-1 font-mono">
                        Src: {source.id}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-200">{ev.organism}</div>
                    <div className="text-[11px] text-slate-400">{ev.population}</div>
                    {ev.sampleSize && (
                      <span className="text-[10px] font-mono text-astro-sky inline-block mt-0.5">
                        {ev.sampleSize}
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 max-w-sm">
                    <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">
                      {ev.methodology}
                    </p>
                  </td>

                  <td className="py-3 px-3 max-w-sm">
                    <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3 text-amber-200/90">
                      {ev.limitations}
                    </p>
                  </td>

                  <td className="py-3 px-3 max-w-xs">
                    {claim ? (
                      <div>
                        <span className="font-mono text-[10px] text-astro-violet font-semibold">
                          {claim.id}
                        </span>
                        <p className="text-slate-300 line-clamp-2 text-[11px]">
                          {claim.claimText}
                        </p>
                      </div>
                    ) : (
                      <span className="font-mono text-slate-500">{ev.claimId}</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
