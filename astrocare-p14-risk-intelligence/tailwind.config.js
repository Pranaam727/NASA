/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#050811',
          900: '#070C18',
          850: '#0B1224',
          800: '#0F172A',
          750: '#15203B',
          700: '#1E293B',
          600: '#334155',
          500: '#475569',
          400: '#64748B',
          300: '#94A3B8',
          200: '#CBD5E1',
          100: '#E2E8F0',
        },
        nasa: {
          blue: '#0B3D91',
          red: '#FC3D21',
          cyan: '#00B4D8',
          teal: '#00F5D4',
          violet: '#7928CA',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
