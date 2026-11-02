/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', 'Amiri', '"Traditional Arabic"', 'serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(52,211,153,.18), 0 18px 60px -22px rgba(16,185,129,.55)',
      },
    },
  },
  plugins: [],
};
