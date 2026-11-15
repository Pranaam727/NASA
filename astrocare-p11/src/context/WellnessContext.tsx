// AstroCare P11 — Wellness Context

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { WellnessDataProvider } from '../types';
import { localDemoProvider } from '../services/wellness/localDemoProvider';
import { DEMO_ASTRONAUT_ID, DEMO_MISSION_ID } from '../constants';

interface WellnessContextValue {
  astronautId: string;
  missionId: string;
  dataProvider: WellnessDataProvider;
  disclaimerAccepted: boolean;
  acceptDisclaimer: () => void;
}

const WellnessContext = createContext<WellnessContextValue | null>(null);

export function WellnessProvider({ children }: { children: React.ReactNode }) {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
    return localStorage.getItem('astrocare_p11_disclaimer') === 'true';
  });

  const acceptDisclaimer = useCallback(() => {
    localStorage.setItem('astrocare_p11_disclaimer', 'true');
    setDisclaimerAccepted(true);
  }, []);

  return (
    <WellnessContext.Provider
      value={{
        astronautId: DEMO_ASTRONAUT_ID,
        missionId: DEMO_MISSION_ID,
        dataProvider: localDemoProvider,
        disclaimerAccepted,
        acceptDisclaimer,
      }}
    >
      {children}
    </WellnessContext.Provider>
  );
}

export function useWellnessContext(): WellnessContextValue {
  const ctx = useContext(WellnessContext);
  if (!ctx) throw new Error('useWellnessContext must be used within WellnessProvider');
  return ctx;
}
