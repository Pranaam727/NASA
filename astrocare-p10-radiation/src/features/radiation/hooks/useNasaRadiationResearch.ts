import { useState, useEffect, useCallback } from 'react';
import { nasaRadLabService, RadLabQueryParams } from '../services/nasaRadLabService';
import { nasaOsdrService } from '../services/nasaOsdrService';
import { nasaHrpService } from '../services/nasaHrpService';
import {
  RadiationMeasurement,
  RadiationResearchStudy,
  HrpEvidenceReference,
} from '../types/radiationTypes';

export function useNasaRadiationResearch() {
  // RadLab Telemetry State
  const [radLabMeasurements, setRadLabMeasurements] = useState<RadiationMeasurement[]>([]);
  const [isRadLabLive, setIsRadLabLive] = useState<boolean>(false);
  const [isRadLabLoading, setIsRadLabLoading] = useState<boolean>(false);
  const [radLabError, setRadLabError] = useState<string | null>(null);
  const [radLabSourceUrl, setRadLabSourceUrl] = useState<string>('');
  const [radLabParams, setRadLabParams] = useState<RadLabQueryParams>({
    spacecraft: 'ISS',
    instrument: 'DosTel',
    limit: 20,
  });

  // OSDR Studies State
  const [osdrStudies, setOsdrStudies] = useState<RadiationResearchStudy[]>([]);
  const [isOsdrLoading, setIsOsdrLoading] = useState<boolean>(false);
  const [osdrError, setOsdrError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // HRP Evidence State
  const [hrpEvidence, setHrpEvidence] = useState<HrpEvidenceReference[]>([]);

  // Selected Study for Detail Modal
  const [selectedStudy, setSelectedStudy] = useState<RadiationResearchStudy | null>(null);

  // Fetch RadLab Telemetry
  const fetchRadLab = useCallback(async (params: RadLabQueryParams) => {
    setIsRadLabLoading(true);
    setRadLabError(null);
    try {
      const res = await nasaRadLabService.getTelemetry(params);
      setRadLabMeasurements(res.measurements);
      setIsRadLabLive(res.isLive);
      setRadLabSourceUrl(res.sourceUrl);
      if (res.error) setRadLabError(res.error);
    } catch (err: any) {
      setRadLabError(err?.message || 'Failed to retrieve RadLab data');
    } finally {
      setIsRadLabLoading(false);
    }
  }, []);

  // Fetch OSDR Studies
  const fetchOsdr = useCallback(async (term: string, cat: string) => {
    setIsOsdrLoading(true);
    setOsdrError(null);
    try {
      const res = await nasaOsdrService.searchStudies({
        term,
        category: cat,
        limit: 10,
      });
      setOsdrStudies(res.studies);
      if (res.error) setOsdrError(res.error);
    } catch (err: any) {
      setOsdrError(err?.message || 'Failed to search OSDR studies');
    } finally {
      setIsOsdrLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRadLab(radLabParams);
    fetchOsdr(searchTerm, selectedCategory);
    setHrpEvidence(nasaHrpService.getEvidenceRecords());
  }, [fetchRadLab, fetchOsdr, radLabParams, searchTerm, selectedCategory]);

  const updateRadLabFilter = (updates: Partial<RadLabQueryParams>) => {
    const updated = { ...radLabParams, ...updates };
    setRadLabParams(updated);
    fetchRadLab(updated);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchOsdr(term, selectedCategory);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    fetchOsdr(searchTerm, category);
  };

  return {
    // RadLab
    radLabMeasurements,
    isRadLabLive,
    isRadLabLoading,
    radLabError,
    radLabSourceUrl,
    radLabParams,
    updateRadLabFilter,
    refreshRadLab: () => fetchRadLab(radLabParams),

    // OSDR
    osdrStudies,
    isOsdrLoading,
    osdrError,
    searchTerm,
    selectedCategory,
    handleSearch,
    handleCategorySelect,
    refreshOsdr: () => fetchOsdr(searchTerm, selectedCategory),

    // HRP Evidence
    hrpEvidence,

    // Study Detail Modal
    selectedStudy,
    setSelectedStudy,
  };
}
