import { useState, useEffect, useCallback } from 'react';
import { DatasetRecord, DatasetFile } from '../types/dataset.types';
import { NasaOsdrService } from '../services/nasaOsdrService';

export function useDatasetMetadata(studyId?: string) {
  const [dataset, setDataset] = useState<DatasetRecord | null>(null);
  const [files, setFiles] = useState<DatasetFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMetadata = useCallback(async () => {
    if (!studyId) {
      setDataset(null);
      setFiles([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const service = NasaOsdrService.getInstance();
      const meta = await service.getStudyMetadata(studyId);
      if (meta) {
        setDataset(meta);
        if (meta.availableFiles && meta.availableFiles.length > 0) {
          setFiles(meta.availableFiles);
        } else {
          const fetchedFiles = await service.getStudyFiles(studyId);
          setFiles(fetchedFiles);
        }
      } else {
        setError(`Study ${studyId} not found in NASA OSDR repository or local benchmark cache.`);
      }
    } catch (err: any) {
      setError(err?.message || `Failed to fetch metadata for ${studyId}`);
    } finally {
      setLoading(false);
    }
  }, [studyId]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  return {
    dataset,
    files,
    loading,
    error,
    refetch: fetchMetadata
  };
}
