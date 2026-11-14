import { useState, useEffect, useCallback } from 'react';
import { DatasetRecord, SearchFilterParams, SearchResultPage, ProvenanceType } from '../types/dataset.types';
import { NasaOsdrService } from '../services/nasaOsdrService';

export function useDatasetSearch(initialParams: SearchFilterParams = {}) {
  const [params, setParams] = useState<SearchFilterParams>({
    query: '',
    studyType: 'all',
    domain: 'all',
    page: 1,
    pageSize: 8,
    ...initialParams
  });

  const [results, setResults] = useState<DatasetRecord[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [provenance, setProvenance] = useState<ProvenanceType>('CACHED_NASA_BENCHMARK');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseTimeMs, setResponseTimeMs] = useState<number | undefined>();

  const executeSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const service = NasaOsdrService.getInstance();
      const res: SearchResultPage = await service.searchStudies(params);
      setResults(res.results);
      setTotalHits(res.totalHits);
      setTotalPages(res.totalPages);
      setProvenance(res.provenance);
      setResponseTimeMs(res.apiResponseTimeMs);
    } catch (err: any) {
      setError(err?.message || 'Failed to search NASA repository');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  const updateFilter = (newFilters: Partial<SearchFilterParams>) => {
    setParams(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page !== undefined ? newFilters.page : 1
    }));
  };

  const refresh = () => {
    executeSearch();
  };

  return {
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
  };
}
