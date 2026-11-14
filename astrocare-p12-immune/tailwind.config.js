/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#060a12',
          900: '#0b1120',
          850: '#0f172a',
          800: '#15203b',
          700: '#1e293b',
          600: '#334155',
        },
        astro: {
          cyan: '#38bdf8',
          blue: '#2563eb',
          amber: '#f59e0b',
          rose: '#f43f5e',
          emerald: '#10b981',
          purple: '#a855f7',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
