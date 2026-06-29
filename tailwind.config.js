/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 24px 80px rgba(14, 165, 233, 0.18)',
        soft: '0 18px 55px rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
};
