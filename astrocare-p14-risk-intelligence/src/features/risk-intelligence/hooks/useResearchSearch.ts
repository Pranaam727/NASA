import { useState, useEffect, useCallback } from 'react';
import { NasaOsdrService } from '../services/nasaOsdrService';
import { OSDRStudy } from '../types/osdr.types';

export function useResearchSearch() {
  const [query, setQuery] = useState('');
  const [organismFilter, setOrganismFilter] = useState('ALL');
  const [riskCode, setRiskCode] = useState('ALL');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<OSDRStudy[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [isLiveApi, setIsLiveApi] = useState(false);
  const [notice, setNotice] = useState('');
  const [page, setPage] = useState(1);

  const performSearch = useCallback(async (searchQuery: string, organism: string, risk: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await NasaOsdrService.searchStudies({
        query: searchQuery,
        organismFilter: organism,
        riskCode: risk,
        page: pageNum,
        pageSize: 10
      });
      setResults(res.hits);
      setTotalHits(res.totalHits);
      setIsLiveApi(res.isLiveApi);
      setNotice(res.dataSourceNotice);
    } catch {
      const fallback = NasaOsdrService.getCuratedFallbackResults({
        query: searchQuery,
        organismFilter: organism,
        riskCode: risk,
        page: pageNum,
        pageSize: 10
      });
      setResults(fallback.hits);
      setTotalHits(fallback.totalHits);
      setIsLiveApi(false);
      setNotice(fallback.dataSourceNotice);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch(query, organismFilter, riskCode, page);
    }, 250);
    return () => clearTimeout(handler);
  }, [query, organismFilter, riskCode, page, performSearch]);

  return {
    query,
    setQuery,
    organismFilter,
    setOrganismFilter,
    riskCode,
    setRiskCode,
    loading,
    results,
    totalHits,
    isLiveApi,
    notice,
    page,
    setPage,
    refreshSearch: () => performSearch(query, organismFilter, riskCode, page)
  };
}
