/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        astro: {
          bg: {
            primary: '#F3F0E8',
            secondary: '#EAE6DC',
            surface: '#FFFFFF',
            subtle: '#ECE8DE',
          },
          text: {
            primary: '#242824',
            secondary: '#73766F',
            tertiary: '#9A9E96',
            inverted: '#F3F0E8',
          },
          border: {
            hairline: '#D8D4C9',
            strong: '#8C9086',
            focus: '#242824',
          },
          status: {
            healthy: '#738174',
            caution: '#D16C48',
            critical: '#B9473E',
            sandstone: '#D8CBAF',
          },
        },
      },
      fontFamily: {
        display: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(36, 40, 36, 0.05)',
        dropdown: '0 4px 12px rgba(36, 40, 36, 0.08)',
      },
    },
  },
  plugins: [],
};
