/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#2563eb',
          dark: '#60a5fa',
        },
        // "neutral" is remapped to a blue-grey scale so every component
        // picks up the shades-of-blue theme automatically
        neutral: {
          50: '#f2f6ff',
          100: '#e6edff',
          200: '#cdd9fb',
          300: '#a9bdf5',
          400: '#7f9bec',
          500: '#5f7fe0',
          600: '#4a63c8',
          700: '#3b4fa3',
          800: '#2c3c7d',
          900: '#1d2a58',
          950: '#0d1730',
        },
        navy: {
          900: '#101d42',
          950: '#0a1633',
          975: '#050b1f',
        },
      },
      boxShadow: {
        soft: '0 24px 70px -24px rgba(37, 99, 235, 0.35)',
        glow: '0 0 0 1px rgba(59, 130, 246, 0.18), 0 18px 50px -18px rgba(37, 99, 235, 0.45)',
      },
    },
  },
  plugins: [],
};
