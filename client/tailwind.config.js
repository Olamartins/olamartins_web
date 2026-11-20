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
        // Brand palette: #0466c8 / #0353a4 / #023e7d blues, #33415c / #5c677d slate
        accent: {
          DEFAULT: '#0466c8',
          dark: '#5ea3e3',
        },
        blue: {
          50: '#f0f7fc',
          100: '#e2effa',
          200: '#c4def5',
          300: '#93c4ee',
          400: '#5ea3e3',
          500: '#2f83d6',
          600: '#0466c8',
          700: '#0353a4',
          800: '#023e7d',
          900: '#0a3260',
          950: '#061f3d',
        },
        sky: {
          300: '#93c4ee',
          400: '#5ea3e3',
          500: '#2f83d6',
          600: '#0466c8',
        },
        // "neutral" is a slate scale built on #5c677d / #33415c so every
        // component picks up the theme automatically
        neutral: {
          50: '#f5f6f8',
          100: '#e9ecf1',
          200: '#d3d8e2',
          300: '#b3bac9',
          400: '#8f97ab',
          500: '#5c677d',
          600: '#4d5668',
          700: '#33415c',
          800: '#2b3449',
          900: '#232a3a',
          950: '#161c2b',
        },
        navy: {
          900: '#12233c',
          950: '#0c1828',
          975: '#071120',
        },
      },
      boxShadow: {
        soft: '0 24px 70px -24px rgba(4, 102, 200, 0.35)',
        glow: '0 0 0 1px rgba(4, 102, 200, 0.18), 0 18px 50px -18px rgba(4, 102, 200, 0.45)',
      },
    },
  },
  plugins: [],
};
