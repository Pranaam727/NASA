import { useState, useEffect, useCallback } from 'react';
import { AstronautProfile, CreateAstronautProfileInput } from '../types';
import { astronautProfileService } from '../services/astronautProfileService';

export function useAstronautProfiles() {
  const [profiles, setProfiles] = useState<AstronautProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string>('astro-001');
  const [loading, setLoading] = useState<boolean>(true);

  const refreshProfiles = useCallback(() => {
    setLoading(true);
    const data = astronautProfileService.getAll();
    setProfiles(data);
    if (!data.some((p) => p.id === activeProfileId) && data.length > 0) {
      setActiveProfileId(data[0].id);
    }
    setLoading(false);
  }, [activeProfileId]);

  useEffect(() => {
    refreshProfiles();
  }, [refreshProfiles]);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const createProfile = (input: CreateAstronautProfileInput) => {
    const created = astronautProfileService.create(input);
    refreshProfiles();
    setActiveProfileId(created.id);
    return created;
  };

  const updateProfile = (id: string, updates: Partial<AstronautProfile>) => {
    const updated = astronautProfileService.update(id, updates);
    refreshProfiles();
    return updated;
  };

  const deleteProfile = (id: string) => {
    const success = astronautProfileService.delete(id);
    if (success) {
      refreshProfiles();
    }
    return success;
  };

  const resetProfiles = () => {
    astronautProfileService.resetToDemo();
    refreshProfiles();
    setActiveProfileId('astro-001');
  };

  return {
    profiles,
    activeProfile,
    activeProfileId,
    setActiveProfileId,
    loading,
    createProfile,
    updateProfile,
    deleteProfile,
    resetProfiles,
  };
}
