import React from 'react';
import { useDatasetSearch } from '../hooks/useDatasetSearch';
import { DatasetSearchFilters } from '../components/DatasetSearchFilters';
import { DatasetCard } from '../components/DatasetCard';
import { StatusBadge } from '../components/StatusBadge';
import { 
  Search, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, 
  Database, Clock, Radio, CheckCircle 
} from 'lucide-react';

interface DatasetExplorerPageProps {
  onSelectStudy: (studyId: string) => void;
  onToggleCompare: (studyId: string) => void;
  selectedComparisonIds: string[];
}

export const DatasetExplorerPage: React.FC<DatasetExplorerPageProps> = ({
  onSelectStudy,
  onToggleCompare,
  selectedComparisonIds
}) => {
  const {
    params,
    results,
    totalHits,
    totalPages,
    provenance,
    loading,
    error,
    responseTimeMs,
    updateFilter,
    refresh
  } = useDatasetSearch({ pageSize: 6 });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold">
              Live OSDR Repository Query Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            NASA Dataset Explorer
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Execute real-time queries against NASA Open Science Data Repository (OSDR) APIs with automated schema parsing, organism taxonomy classification, and biological model segregation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge type="provenance" value={provenance} />
          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            <span>{loading ? 'Querying...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Search Filters Component */}
      <DatasetSearchFilters
        filters={params}
        onFilterChange={updateFilter}
        onReset={() => updateFilter({ query: '', studyType: 'all', domain: 'all', organism: 'all', page: 1 })}
      />

      {/* Query Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs px-1 text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span>Search Results:</span>
          <span className="font-bold text-slate-200">{totalHits} datasets matching criteria</span>
          {responseTimeMs !== undefined && (
            <span className="text-[11px] text-slate-500">({responseTimeMs} ms latency)</span>
          )}
        </div>

        <div>
          Page {params.page || 1} of {totalPages}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={refresh}
            className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-mono text-[11px]"
          >
            Retry Query
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse p-5 space-y-4">
              <div className="h-4 bg-slate-800 rounded w-1/3" />
              <div className="h-5 bg-slate-800 rounded w-4/5" />
              <div className="h-16 bg-slate-800/60 rounded" />
              <div className="h-4 bg-slate-800 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        /* Empty State */
        <div className="p-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
          <Database className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No Spaceflight Studies Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No NASA OSDR studies matched the query &quot;{params.query}&quot; with current organism and domain filters.
          </p>
          <button
            onClick={() => updateFilter({ query: '', studyType: 'all', domain: 'all', organism: 'all', page: 1 })}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-medium"
          >
            Clear All Query Constraints
          </button>
        </div>
      ) : (
        /* Results Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map(d => (
            <DatasetCard
              key={d.studyId}
              dataset={d}
              isSelectedForComparison={selectedComparisonIds.includes(d.studyId)}
              onToggleComparison={onToggleCompare}
              onSelectDetails={onSelectStudy}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => updateFilter({ page: Math.max((params.page || 1) - 1, 1) })}
            disabled={(params.page || 1) <= 1 || loading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="px-4 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
            Page {params.page || 1} of {totalPages}
          </div>

          <button
            onClick={() => updateFilter({ page: Math.min((params.page || 1) + 1, totalPages) })}
            disabled={(params.page || 1) >= totalPages || loading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
