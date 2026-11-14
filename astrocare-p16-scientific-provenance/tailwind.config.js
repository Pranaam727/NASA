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
          darkest: '#050a14',
          bg: '#080f1d',
          surface: '#0d182b',
          card: '#122038',
          cardHover: '#172947',
          border: '#1f3354',
          borderLight: '#2c4772',
          cyan: '#00f0ff',
          cyanMuted: '#00b4d8',
          teal: '#14b8a6',
          blue: '#3b82f6',
          sky: '#38bdf8',
          violet: '#8b5cf6',
          amber: '#f59e0b',
          emerald: '#10b981',
          rose: '#f43f5e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
