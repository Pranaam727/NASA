import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  server: {
    proxy: {
      '/api/osdr': {
        target: 'https://osdr.nasa.gov/osdr/data',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/osdr/, ''),
        secure: false,
      },
    },
  },
});
