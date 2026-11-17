/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        accent: {
          DEFAULT: '#0071e3',
          dark: '#2997ff',
        },
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
};
