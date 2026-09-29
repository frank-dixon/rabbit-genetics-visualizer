/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm cream paper neutrals
        slate: {
          50: '#F7F3EC',
          100: '#F0EBE2',
          200: '#E4DDD2',
          300: '#D2C9BB',
          400: '#9A9186',
          500: '#6A635B',
          600: '#3F3A35',
          700: '#2F2A26',
          800: '#1C1916',
          900: '#12151A',
          950: '#0B0D10',
        },
        // Dark turquoise accent
        sky: {
          50: '#EAF6F6',
          100: '#D7EEEE',
          200: '#B3DCDC',
          300: '#7EC4C7',
          400: '#3AA8AD',
          500: '#0B8A8F',
          600: '#087075',
          700: '#065A5E',
          800: '#044548',
          900: '#033033',
          950: '#021F21',
        },
        indigo: {
          50: '#EEF5F5',
          100: '#DCEAEA',
          200: '#C0D5D6',
          300: '#97BABC',
          400: '#6A9A9C',
          500: '#3F7D80',
          600: '#2F6B6E',
          700: '#245456',
          800: '#1A3F41',
          900: '#122E30',
          950: '#0B1C1D',
        },
        amber: {
          50: '#F7F0E4',
          100: '#F0E4D0',
          200: '#E2CFAE',
          300: '#D0B484',
          400: '#B89255',
          500: '#9A7340',
          600: '#7C5A32',
          700: '#634828',
          800: '#4F3A22',
          900: '#3F2F1D',
          950: '#241A10',
        },
        // Theme tokens resolve to CSS vars in index.css so dark mode can swap them
        paper: {
          DEFAULT: 'color-mix(in srgb, var(--paper) calc(<alpha-value> * 100%), transparent)',
          2: 'color-mix(in srgb, var(--paper-2) calc(<alpha-value> * 100%), transparent)',
          soft: 'color-mix(in srgb, var(--paper-soft) calc(<alpha-value> * 100%), transparent)',
        },
        ink: {
          DEFAULT: 'color-mix(in srgb, var(--ink) calc(<alpha-value> * 100%), transparent)',
          soft: 'color-mix(in srgb, var(--ink-soft) calc(<alpha-value> * 100%), transparent)',
          muted: 'color-mix(in srgb, var(--muted) calc(<alpha-value> * 100%), transparent)',
        },
        rule: {
          DEFAULT: 'color-mix(in srgb, var(--rule) calc(<alpha-value> * 100%), transparent)',
          dark: '#262C34',
        },
        teal: {
          DEFAULT: 'color-mix(in srgb, var(--teal) calc(<alpha-value> * 100%), transparent)',
          deep: 'color-mix(in srgb, var(--teal-deep) calc(<alpha-value> * 100%), transparent)',
          soft: 'color-mix(in srgb, var(--teal-soft) calc(<alpha-value> * 100%), transparent)',
          on: 'color-mix(in srgb, var(--on-teal) calc(<alpha-value> * 100%), transparent)',
        },
        espresso: 'color-mix(in srgb, var(--espresso) calc(<alpha-value> * 100%), transparent)',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['Michroma', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        serif: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        paper: '0 12px 36px rgba(28, 25, 22, 0.07)',
        'paper-sm': '0 3px 12px rgba(28, 25, 22, 0.05)',
        teal: '0 6px 16px rgba(11, 138, 143, 0.2)',
      },
      borderRadius: {
        paper: '0.75rem',
      },
    },
  },
  plugins: [],
};
