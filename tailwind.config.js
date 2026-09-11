/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Warm paper / ink neutrals (Weather + portfolio)
        slate: {
          50: '#F8F3EA',
          100: '#F3EEE4',
          200: '#E8E0D2',
          300: '#D4CBBE',
          400: '#9A9186',
          500: '#6A635B',
          600: '#3F3A35',
          700: '#2F2A26',
          800: '#1C1916',
          900: '#241E1B',
          950: '#161311',
        },
        // Dark turquoise accent (Weather teal)
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
        // Soft teal-adjacent secondary (Parent B / chips)
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
        // Amber kept warm for "differs" callouts
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
          DEFAULT: '#F3EEE4',
          2: '#E8E0D2',
          soft: '#F8F3EA',
        },
        ink: {
          DEFAULT: '#1C1916',
          soft: '#3F3A35',
          muted: '#6A635B',
        },
        rule: {
          DEFAULT: '#D4CBBE',
          dark: '#3A342F',
        },
        teal: {
          DEFAULT: '#0B8A8F',
          deep: '#087075',
          soft: '#D7EEEE',
          on: '#F8F3EA',
        },
        espresso: '#241E1B',
      },
      fontFamily: {
        sans: [
          '"Source Sans 3"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: ['Fraunces', 'Georgia', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        paper: '0 12px 40px rgba(28, 25, 22, 0.08)',
        'paper-sm': '0 4px 16px rgba(28, 25, 22, 0.06)',
        teal: '0 8px 20px rgba(11, 138, 143, 0.22)',
      },
      borderRadius: {
        paper: '1.125rem',
      },
    },
  },
  plugins: [],
};
