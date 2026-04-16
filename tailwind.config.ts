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
        base: '#F3F4F6',
        ink: '#0F172A',
        accent: '#0EA5E9',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626'
      }
    }
  },
  plugins: []
};

export default config;
