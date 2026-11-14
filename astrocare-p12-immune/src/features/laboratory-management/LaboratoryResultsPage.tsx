import React, { useState } from 'react';
import { useAstroCareContext } from '../../hooks/useAstroCareContext';
import { laboratoryService } from '../../services/laboratory/laboratoryService';
import { LaboratoryResult, ResultInterpretation } from '../../types';
import { StateBadge } from '../../components/shared/StateBadge';
import { DataOriginBadge } from '../../components/shared/DataOriginBadge';
import { downloadCsvFile } from '../../utils/calculations';
import {
  Database,
  Search,
  Filter,
  Download,
  Info,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const LaboratoryResultsPage: React.FC = () => {
  const { currentAstronaut } = useAstroCareContext();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedInterpretation, setSelectedInterpretation] = useState<string>('ALL');
  const [sortField, setSortField] = useState<'resultTimestamp' | 'analyte' | 'value'>('resultTimestamp');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 8;

  // Detail Modal
  const [detailResult, setDetailResult] = useState<LaboratoryResult | null>(null);

  const rawResults = laboratoryService.getResults({
    astronautId: currentAstronaut.astronautId,
    category: selectedCategory,
    interpretation: selectedInterpretation,
    searchTerm: searchTerm,
  });

  // Sort
  const sortedResults = [...rawResults].sort((a, b) => {
    if (sortField === 'resultTimestamp') {
      const diff = new Date(b.resultTimestamp).getTime() - new Date(a.resultTimestamp).getTime();
      return sortAsc ? -diff : diff;
    }
    if (sortField === 'analyte') {
      return sortAsc ? a.analyte.localeCompare(b.analyte) : b.analyte.localeCompare(a.analyte);
    }
    if (sortField === 'value') {
      return sortAsc ? a.value - b.value : b.value - a.value;
    }
    return 0;
  });

  // Paginate
  const totalPages = Math.ceil(sortedResults.length / pageSize) || 1;
  const paginatedResults = sortedResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleExportCsv = () => {
    const csvContent = laboratoryService.exportResultsCsv(sortedResults);
    const fileName = `AstroCare_P12_LabResults_${currentAstronaut.astronautId}_${new Date().toISOString().split('T')[0]}.csv`;
    downloadCsvFile(csvContent, fileName);
  };

  const handleSortToggle = (field: 'resultTimestamp' | 'analyte' | 'value') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold tracking-wider text-cyan-400 uppercase">
              Module E — Diagnostic Telemetry Records
            </span>
            <DataOriginBadge origin="SIMULATED" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-cyan-400" />
            Laboratory Analytical Results & Interpretation
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
            Standardized laboratory assay records with contextualized reference intervals, method verification,
            and complete analytical provenance.
          </p>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-mono text-xs font-bold shadow-lg shadow-emerald-950/40 transition self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Results CSV
        </button>
      </div>

      {/* Scientific & Metrology Disclaimer Notice */}
      <div className="bg-space-950/80 border border-space-800 rounded-xl p-4 flex items-start gap-3 text-xs leading-relaxed">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200 font-semibold block mb-0.5">
            Interpretation Standard & Scientific Guardrails
          </strong>
          <span className="text-slate-400">
            Reference intervals displayed reflect terrestrial clinical laboratory or NASA Human Research Program
            investigation benchmarks. Microgravity fluid shift, plasma volume contraction, and mission-induced acute-phase
            responses alter baseline concentrations. An abnormal laboratory value does not independently establish a clinical diagnosis.
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-4 shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by analyte, sample ID, assay method, or laboratory..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-space-950 border border-space-800 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <div className="bg-space-950 px-3 py-2 rounded-lg border border-space-800 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-space-900">All Categories</option>
              <option value="IMMUNE_CELL" className="bg-space-900">Immune Cells</option>
              <option value="CYTOKINE" className="bg-space-900">Cytokines</option>
              <option value="INFLAMMATORY" className="bg-space-900">Inflammatory Reactants</option>
              <option value="HORMONAL" className="bg-space-900">Hormonal & Stress</option>
              <option value="VIROLOGY" className="bg-space-900">Virology & qPCR</option>
            </select>
          </div>

          <div className="bg-space-950 px-3 py-2 rounded-lg border border-space-800 flex items-center gap-2">
            <span className="text-[10px] text-slate-400 uppercase">Interpretation:</span>
            <select
              value={selectedInterpretation}
              onChange={(e) => {
                setSelectedInterpretation(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-space-900">All Interpretations</option>
              <option value="WITHIN_REFERENCE" className="bg-space-900">Within Reference</option>
              <option value="ABOVE_REFERENCE" className="bg-space-900">Above Reference</option>
              <option value="BELOW_REFERENCE" className="bg-space-900">Below Reference</option>
              <option value="PENDING" className="bg-space-900">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-space-900 border border-space-800 rounded-xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            Analyzed Results ({sortedResults.length} Total Matching)
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-space-800 text-slate-400 text-[10px] uppercase">
                <th className="pb-2">Result ID</th>
                <th className="pb-2">Sample ID</th>
                <th
                  onClick={() => handleSortToggle('analyte')}
                  className="pb-2 cursor-pointer hover:text-white"
                >
                  <span className="inline-flex items-center gap-1">
                    Analyte <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => handleSortToggle('value')}
                  className="pb-2 cursor-pointer hover:text-white"
                >
                  <span className="inline-flex items-center gap-1">
                    Value <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="pb-2">Unit</th>
                <th className="pb-2">Reference Interval</th>
                <th className="pb-2">Interpretation</th>
                <th
                  onClick={() => handleSortToggle('resultTimestamp')}
                  className="pb-2 cursor-pointer hover:text-white"
                >
                  <span className="inline-flex items-center gap-1">
                    Result Time <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="pb-2 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-space-800/60">
              {paginatedResults.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No laboratory results matching search or filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedResults.map((r) => (
                  <tr key={r.id} className="hover:bg-space-850/50 transition">
                    <td className="py-3 font-bold text-slate-300">{r.id}</td>
                    <td className="py-3 text-cyan-300">{r.sampleId}</td>
                    <td className="py-3 text-white font-medium">{r.analyte}</td>
                    <td className="py-3 font-bold text-cyan-300">{r.value}</td>
                    <td className="py-3 text-slate-400">{r.unit}</td>
                    <td className="py-3 text-slate-400 text-[11px]">{r.referenceIntervalText}</td>
                    <td className="py-3">
                      <StateBadge state={r.interpretation} size="sm" />
                    </td>
                    <td className="py-3 text-slate-400 text-[11px]">
                      {r.resultTimestamp.replace('T', ' ').slice(0, 16)}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setDetailResult(r)}
                        className="px-2.5 py-1 rounded bg-space-800 hover:bg-space-700 text-slate-200 text-[11px] font-mono transition"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-space-800 font-mono text-xs text-slate-400">
            <div>
              Showing {(currentPage - 1) * pageSize + 1} –{' '}
              {Math.min(currentPage * pageSize, sortedResults.length)} of {sortedResults.length}
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-space-800 hover:bg-space-700 disabled:opacity-40 disabled:cursor-not-allowed text-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded bg-space-800 hover:bg-space-700 disabled:opacity-40 disabled:cursor-not-allowed text-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Detailed Result Inspection */}
      {detailResult && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-900 border border-space-700 rounded-xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setDetailResult(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800 px-2 py-0.5 rounded">
                ANALYTICAL TELEMETRY CERTIFICATE
              </span>
              <DataOriginBadge origin={detailResult.dataOrigin} />
            </div>

            <h3 className="text-xl font-bold text-white tracking-tight mb-1">
              {detailResult.analyte}
            </h3>
            <p className="text-xs font-mono text-slate-400 mb-6">
              Result ID: {detailResult.id} | Associated Specimen: {detailResult.sampleId}
            </p>

            <div className="grid grid-cols-2 gap-4 bg-space-950 p-4 rounded-lg border border-space-800 text-xs font-mono mb-6">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Reported Value</span>
                <span className="text-xl font-bold text-white">
                  {detailResult.value} <span className="text-xs text-cyan-400">{detailResult.unit}</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Interpretation</span>
                <StateBadge state={detailResult.interpretation} size="sm" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Reference Interval</span>
                <span className="font-bold text-slate-300">{detailResult.referenceIntervalText}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Reference Standard</span>
                <span className="text-slate-400 text-[11px]">{detailResult.referenceSource}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Assay Technology</span>
                <span className="font-bold text-slate-300">{detailResult.assayMethod}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Testing Facility</span>
                <span className="font-bold text-slate-300">{detailResult.laboratoryName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Specimen Collected</span>
                <span className="text-slate-400">{detailResult.collectionTimestamp}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Result Downlinked</span>
                <span className="text-slate-400">{detailResult.resultTimestamp}</span>
              </div>
            </div>

            <div className="p-3 bg-space-800/40 rounded border border-space-800 text-xs font-mono">
              <span className="text-[10px] uppercase text-slate-400 block mb-1">Telemetry Provenance</span>
              <p className="text-slate-300 text-[11px]">{detailResult.dataProvenance}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
