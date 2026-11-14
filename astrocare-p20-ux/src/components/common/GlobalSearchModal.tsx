import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Users, Activity, FileSearch, Database, ArrowRight } from 'lucide-react';
import { dataProvider, GlobalSearchResult } from '../../data/mockDataProvider';
import { FOCUS_RING } from '../../design-system/utils';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (result: GlobalSearchResult) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    dataProvider.searchPlatform(query).then(res => {
      setResults(res);
      setSelectedIndex(0);
    });
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      }
      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault();
        onSelectResult(results[selectedIndex]);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose, onSelectResult]);

  if (!isOpen) return null;

  const getCategoryIcon = (cat: GlobalSearchResult['category']) => {
    switch (cat) {
      case 'Astronaut':
        return <Users className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Health Metric':
        return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
      case 'NASA Research':
        return <Database className="w-3.5 h-3.5 text-blue-400" />;
      case 'Investigation':
        return <FileSearch className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <ArrowRight className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Mission Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-[#0b101d] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search astronauts, vitals, NASA research sources, investigations... (e.g. Chen, SANS, NTX)"
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none font-sans"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {query && results.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 font-mono">
              No matching aerospace biomedical records found for "{query}".
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map((res, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={res.id}
                    onClick={() => {
                      onSelectResult(res);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        {getCategoryIcon(res.category)}
                      </div>
                      <div>
                        <div className="font-semibold text-xs sm:text-sm font-sans flex items-center gap-2">
                          <span>{res.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {res.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-mono line-clamp-1">
                          {res.subtitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-cyan-500' : 'opacity-0'}`} />
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 space-y-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
              <div className="font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                Quick Search Examples:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Sarah Chen', 'Marcus Vance', 'Heart Rate Variability', 'SANS', 'Serum NTX', 'OSDR', 'HRP'].map(q => (
                  <button
                    key={q}
                    onClick={() => setQuery(q)}
                    className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span>AstroCare Global Search</span>
        </div>

      </div>
    </div>
  );
};
