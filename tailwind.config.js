/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cinnabar: '#C8483B',
        cinnabarDeep: '#A33A2F',
        cinnabarSoft: '#E08174',
        rice: '#F7F1E5',
        riceDeep: '#EDE3CB',
        ink: '#2A2A2A',
        inkSoft: '#4A4A4A',
        mountain: '#5C8A8A',
        gold: '#D9A35F',
        fog: '#9A9A9A',
        line: '#D8CDB4',
      },
      fontFamily: {
        song: ['"Source Han Sans SC"', '"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
        hei: ['"Source Han Sans SC"', '"Noto Sans SC"', '"PingFang SC"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'monospace'],
      },
      boxShadow: {
        paper: '0 1px 0 rgba(42,42,42,0.04), 0 8px 24px -12px rgba(200,72,59,0.18)',
        fold: '0 1px 0 rgba(216,205,180,0.6) inset, 0 -1px 0 rgba(216,205,180,0.6) inset',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        slideIn: {
          '0%': { transform: 'translateY(8px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        float: 'float 3.6s ease-in-out infinite',
        slideIn: 'slideIn .35s cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [],
}
