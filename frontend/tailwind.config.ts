import type { Config } from 'tailwindcss'
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',   // blue-700
        primaryLight: '#3B82F6', // blue-500
        bgSoft: '#F8FBFF'
      },
      boxShadow: {
        soft: '0 8px 30px rgba(29,78,216,0.08)'
      }
    }
  },
  darkMode: 'class',
  plugins: []
} satisfies Config
