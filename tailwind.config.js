/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#020807',
          surface: '#071311',
          panel: '#0A1716',
          card: '#0D1D1B',
          subtle: '#102624',
          cyan: '#24E6D0',
          emerald: '#00AFA0',
          highlight: '#8BFFE9',
          text: '#F4FAF8',
          muted: '#91A9A4',
          dim: '#5B7B75',
          alert: '#FF646E',
          warning: '#F5B94C',
          border: 'rgba(36, 230, 208, 0.18)',
        },
        astro: {
          bg: {
            primary: '#020807',
            secondary: '#071311',
            panel: '#0A1716',
            card: '#0D1D1B',
            surface: '#0A1716',
            dark: '#020807',
            subtle: '#102624',
          },
          text: {
            primary: '#F4FAF8',
            secondary: '#91A9A4',
            tertiary: '#5B7B75',
            muted: '#5B7B75',
            inverted: '#020807',
          },
          border: {
            hairline: 'rgba(36, 230, 208, 0.18)',
            strong: '#24E6D0',
            focus: '#8BFFE9',
          },
          status: {
            healthy: '#24E6D0',
            caution: '#F5B94C',
            critical: '#FF646E',
            sandstone: '#91A9A4',
          },
          accent: {
            cyan: '#24E6D0',
            emerald: '#00AFA0',
            highlight: '#8BFFE9',
            orange: '#FF646E',
          },
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', '"Space Mono"', 'monospace'],
        space: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        cyberGlow: '0 0 25px rgba(36, 230, 208, 0.25), 0 0 10px rgba(36, 230, 208, 0.15)',
        cyberCard: '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(36, 230, 208, 0.15)',
        cyberCardHover: '0 15px 40px -10px rgba(36, 230, 208, 0.2), 0 0 0 1px rgba(36, 230, 208, 0.45)',
        subtle: '0 2px 10px rgba(0, 0, 0, 0.5)',
        editorial: '0 10px 30px rgba(0, 0, 0, 0.7)',
        canvasFrame: '0 25px 65px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(36, 230, 208, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 30s linear infinite',
      },
    },
  },
  plugins: [],
};
