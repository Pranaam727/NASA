import React from 'react';
import { ThemeProvider } from './design-system/ThemeContext';
import { AstroCareMissionControlApp } from './components/AstroCareMissionControlApp';

export function App() {
  return (
    <ThemeProvider>
      <AstroCareMissionControlApp />
    </ThemeProvider>
  );
}

export default App;
