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
        astro: {
          bg: '#080C14',
          card: '#0D1424',
          cardHover: '#131D33',
          surface: '#111A2E',
          border: '#1E293B',
          borderLight: '#334155',
          cyan: '#06B6D4',
          cyanGlow: 'rgba(6, 182, 212, 0.15)',
          blue: '#3B82F6',
          teal: '#14B8A6',
          violet: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#F43F5E',
          emerald: '#10B981',
          muted: '#64748B',
          text: '#F1F5F9',
          subtext: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
