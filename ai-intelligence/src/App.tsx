import React from 'react';
import { ProviderContextProvider } from './providers/ProviderContext';
import { AstroCareIntelligenceModule } from './components/AstroCareIntelligenceModule';

export function App() {
  return (
    <ProviderContextProvider
      initialConfig={{
        providerType: 'gemini-proxy',
        apiBaseUrl: '', // uses Vite proxy /api or direct relative endpoint
        modelName: 'gemini-2.5-flash'
      }}
    >
      <AstroCareIntelligenceModule />
    </ProviderContextProvider>
  );
}

export default App;
