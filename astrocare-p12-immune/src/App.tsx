import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AstroCareProvider } from './hooks/useAstroCareContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AstroCareProvider>
        <AppRoutes />
      </AstroCareProvider>
    </BrowserRouter>
  );
};

export default App;
