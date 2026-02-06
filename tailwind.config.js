/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        void: '#0a0a0f',
        obsidian: '#13131a',
        smoke: '#1e1e28',
        gold: '#c4a962',
        'gold-dim': '#8a7644',
        parchment: '#e8e0d4',
        'parchment-dim': '#a89e90',
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans: [
          'system-ui',
          '-apple-system',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
