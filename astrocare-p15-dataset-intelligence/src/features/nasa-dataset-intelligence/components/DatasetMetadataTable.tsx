import React, { useState } from 'react';
import { DatasetRecord } from '../types/dataset.types';
import { StatusBadge } from './StatusBadge';
import { ExternalLink, ChevronRight, ArrowUpDown } from 'lucide-react';

interface DatasetMetadataTableProps {
  datasets: DatasetRecord[];
  onSelectStudy?: (studyId: string) => void;
  onToggleCompare?: (studyId: string) => void;
  selectedIds?: string[];
}

export const DatasetMetadataTable: React.FC<DatasetMetadataTableProps> = ({
  datasets,
  onSelectStudy,
  onToggleCompare,
  selectedIds = []
}) => {
  const [sortField, setSortField] = useState<keyof DatasetRecord>('studyId');
  const [sortAsc, setSortAsc] = useState(true);

  const handleSort = (field: keyof DatasetRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedData = [...datasets].sort((a, b) => {
    const valA = (a[sortField] || '').toString().toLowerCase();
    const valB = (b[sortField] || '').toString().toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
          <tr>
            <th className="py-3 px-4 w-10 text-center">Compare</th>
            <th 
              onClick={() => handleSort('studyId')} 
              className="py-3 px-4 cursor-pointer hover:text-cyan-400 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span>Accession</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th 
              onClick={() => handleSort('title')} 
              className="py-3 px-4 cursor-pointer hover:text-cyan-400 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <span>Research Title</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-3 px-4">Study Population</th>
            <th className="py-3 px-4">Organism</th>
            <th className="py-3 px-4">Mission / Platform</th>
            <th className="py-3 px-4">Files</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-sans">
          {sortedData.map(d => {
            const isComparing = selectedIds.includes(d.studyId);
            return (
              <tr key={d.studyId} className="hover:bg-slate-850/60 transition-colors">
                <td className="py-3 px-4 text-center">
                  {onToggleCompare && (
                    <input
                      type="checkbox"
                      checked={isComparing}
                      onChange={() => onToggleCompare(d.studyId)}
                      className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                  )}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                  <span 
                    onClick={() => onSelectStudy?.(d.studyId)}
                    className="cursor-pointer hover:underline"
                  >
                    {d.studyId}
                  </span>
                </td>
                <td className="py-3 px-4 font-medium text-slate-200 max-w-sm truncate" title={d.title}>
                  <span 
                    onClick={() => onSelectStudy?.(d.studyId)}
                    className="cursor-pointer hover:text-cyan-400 transition-colors"
                  >
                    {d.title}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge type="population" value={d.studyType} />
                </td>
                <td className="py-3 px-4 text-slate-300">
                  {d.organism}
                </td>
                <td className="py-3 px-4 text-slate-400 max-w-[160px] truncate" title={d.mission || d.experimentPlatform}>
                  {d.mission || d.experimentPlatform || 'Spaceflight'}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                  {d.availableFiles?.length || 0} files
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <a
                      href={d.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                      title="Open NASA OSDR"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onSelectStudy?.(d.studyId)}
                      className="p-1.5 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 rounded transition-colors"
                      title="View Details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
