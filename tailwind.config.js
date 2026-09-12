/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cool Spectrum neutrals (mapped onto legacy slate/paper/ink keys)
        slate: {
          50: '#F2F5F8',
          100: '#E6EAF0',
          200: '#D5DBE6',
          300: '#B7C0CE',
          400: '#8B93A3',
          500: '#6B7385',
          600: '#4A5568',
          700: '#2F3C50',
          800: '#1A2230',
          900: '#141820',
          950: '#0A0C10',
        },
        // Action blue (was sky / teal accent)
        sky: {
          50: '#EEF1FB',
          100: '#DDE3F7',
          200: '#B8C3EE',
          300: '#93A3E5',
          400: '#7E91DE',
          500: '#6B7FD7',
          600: '#5A6EC4',
          700: '#4859A3',
          800: '#37457F',
          900: '#283260',
          950: '#1A2140',
        },
        // Sea teal secondary (Parent B / chips)
        indigo: {
          50: '#EAF5F4',
          100: '#D5EBE9',
          200: '#AAD7D2',
          300: '#80C3BC',
          400: '#6BB5AD',
          500: '#5FA8A0',
          600: '#4D8A84',
          700: '#3C6C67',
          800: '#2B4E4A',
          900: '#1C3331',
          950: '#10201E',
        },
        // Amber kept for "differs" callouts (slightly cooler)
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
        paper: {
          DEFAULT: '#0A0C10',
          2: '#141820',
          soft: '#141820',
        },
        ink: {
          DEFAULT: '#E6EAF0',
          soft: '#B7C0CE',
          muted: '#8B93A3',
        },
        rule: {
          DEFAULT: '#243041',
          dark: '#243041',
        },
        teal: {
          DEFAULT: '#6B7FD7',
          deep: '#5A6EC4',
          soft: '#1A2140',
          on: '#0A0C10',
        },
        espresso: '#050608',
      },
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        paper: '0 16px 40px rgba(0, 0, 0, 0.35)',
        'paper-sm': '0 4px 16px rgba(0, 0, 0, 0.28)',
        teal: '0 8px 20px rgba(107, 127, 215, 0.28)',
      },
      borderRadius: {
        paper: '0.875rem',
      },
    },
  },
  plugins: [],
};
