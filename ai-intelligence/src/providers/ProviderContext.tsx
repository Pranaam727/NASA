import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { IAIProvider, ProviderStatus } from './types';
import { MockAIProvider } from './MockAIProvider';
import { GeminiBackendProvider } from './GeminiBackendProvider';
import { AIProviderConfig } from '../types';

interface ProviderContextValue {
  provider: IAIProvider;
  providerStatus: ProviderStatus;
  mode: 'gemini-live' | 'mock-simulation';
  setMode: (mode: 'gemini-live' | 'mock-simulation') => void;
  refreshStatus: () => Promise<void>;
  isLoadingStatus: boolean;
  config: AIProviderConfig;
  updateConfig: (newConfig: Partial<AIProviderConfig>) => void;
}

const ProviderContext = createContext<ProviderContextValue | null>(null);

export const ProviderContextProvider: React.FC<{
  children: React.ReactNode;
  initialConfig?: Partial<AIProviderConfig>;
}> = ({ children, initialConfig }) => {
  const [config, setConfig] = useState<AIProviderConfig>({
    providerType: initialConfig?.providerType || 'gemini-proxy',
    apiBaseUrl: initialConfig?.apiBaseUrl || '',
    modelName: initialConfig?.modelName || 'gemini-2.5-flash',
    ...initialConfig
  });

  const [mode, setMode] = useState<'gemini-live' | 'mock-simulation'>('gemini-live');
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>({
    name: 'Initializing Provider...',
    mode: 'mock-simulation',
    isAvailable: false,
    model: 'gemini-2.5-flash'
  });

  const mockProvider = useMemo(() => new MockAIProvider(), []);
  const geminiProvider = useMemo(() => new GeminiBackendProvider(config.apiBaseUrl), [config.apiBaseUrl]);

  const activeProvider = useMemo<IAIProvider>(() => {
    if (mode === 'mock-simulation') {
      return mockProvider;
    }
    return geminiProvider;
  }, [mode, mockProvider, geminiProvider]);

  const refreshStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    try {
      const status = await activeProvider.getStatus();
      setProviderStatus(status);
    } catch (_err) {
      setProviderStatus({
        name: activeProvider.name,
        mode: 'mock-simulation',
        isAvailable: false,
        model: 'AstroCare-BioSim-v2.5',
        message: 'Status check failed. Operating in offline mock mode.'
      });
    } finally {
      setIsLoadingStatus(false);
    }
  }, [activeProvider]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const updateConfig = (newConfig: Partial<AIProviderConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const value: ProviderContextValue = {
    provider: activeProvider,
    providerStatus,
    mode,
    setMode,
    refreshStatus,
    isLoadingStatus,
    config,
    updateConfig
  };

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
};

export function useAstroCareAI(): ProviderContextValue {
  const context = useContext(ProviderContext);
  if (!context) {
    throw new Error('useAstroCareAI must be used within a ProviderContextProvider');
  }
  return context;
}
