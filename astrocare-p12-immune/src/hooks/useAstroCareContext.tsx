import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AstronautContext,
  OptionalRadiationContext,
  OptionalWellnessContext,
} from '../types';
import {
  DEMO_ASTRONAUT_CONTEXT,
  COMPARATIVE_ASTRONAUTS,
  DEMO_OPTIONAL_RADIATION,
  DEMO_OPTIONAL_WELLNESS,
} from '../data/mockImmuneData';
import { alertService } from '../services/alerts/alertService';
import { laboratoryService } from '../services/laboratory/laboratoryService';

interface AstroCareContextValue {
  currentAstronaut: AstronautContext;
  availableAstronauts: AstronautContext[];
  selectAstronaut: (astronautId: string) => void;
  radiationContext?: OptionalRadiationContext;
  wellnessContext?: OptionalWellnessContext;
  unacknowledgedAlertsCount: number;
  refreshData: () => void;
  resetAllDemoData: () => void;
}

const AstroCareContext = createContext<AstroCareContextValue | undefined>(undefined);

export const AstroCareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedId, setSelectedId] = useState<string>('AST-042');
  const [unacknowledgedAlertsCount, setUnacknowledgedAlertsCount] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const currentAstronaut =
    COMPARATIVE_ASTRONAUTS.find((a) => a.astronautId === selectedId) || DEMO_ASTRONAUT_CONTEXT;

  const refreshData = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    const unack = alertService.getAlerts({
      astronautId: selectedId,
      unacknowledgedOnly: true,
    });
    setUnacknowledgedAlertsCount(unack.length);
  }, [selectedId, refreshKey]);

  const selectAstronaut = (id: string) => {
    setSelectedId(id);
  };

  const resetAllDemoData = () => {
    localStorage.clear();
    laboratoryService.resetToDefault();
    alertService.resetAlertsToDefault();
    setSelectedId('AST-042');
    refreshData();
  };

  return (
    <AstroCareContext.Provider
      value={{
        currentAstronaut,
        availableAstronauts: COMPARATIVE_ASTRONAUTS,
        selectAstronaut,
        radiationContext: DEMO_OPTIONAL_RADIATION,
        wellnessContext: DEMO_OPTIONAL_WELLNESS,
        unacknowledgedAlertsCount,
        refreshData,
        resetAllDemoData,
      }}
    >
      {children}
    </AstroCareContext.Provider>
  );
};

export const useAstroCareContext = (): AstroCareContextValue => {
  const context = useContext(AstroCareContext);
  if (!context) {
    throw new Error('useAstroCareContext must be used within an AstroCareProvider');
  }
  return context;
};
