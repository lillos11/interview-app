import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        base: '#F4EDEE',
        ink: '#0D090A',
        accent: '#DC2626',
        success: '#B91C1C',
        warning: '#9A3412',
        danger: '#7F1D1D',
        slate: {
          50: '#F7F3F4',
          100: '#EFE6E8',
          200: '#D9C9CD',
          300: '#BCA5AB',
          400: '#977A81',
          500: '#72585F',
          600: '#5B454B',
          700: '#453338',
          800: '#2F2327',
          900: '#1D1518',
          950: '#0D090A'
        },
        cyan: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519'
        },
        rose: {
          50: '#FFF5F5',
          100: '#FFE3E3',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#FF8787',
          500: '#FF6B6B',
          600: '#FA5252',
          700: '#F03E3E',
          800: '#C92A2A',
          900: '#A61E1E',
          950: '#5F0F14'
        },
        emerald: {
          50: '#FFF5F5',
          100: '#FFE5E5',
          200: '#FFC9C9',
          300: '#FFA8A8',
          400: '#FF7B7B',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D',
          950: '#450A0A'
        },
        amber: {
          50: '#FFF5F4',
          100: '#FFE9E7',
          200: '#FFD0C7',
          300: '#FFB3A3',
          400: '#FF8C70',
          500: '#F97352',
          600: '#EA5A3D',
          700: '#C2412B',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407'
        }
      }
    }
  },
  plugins: []
};

export default config;
