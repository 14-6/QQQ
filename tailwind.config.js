/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: 'var(--bg-primary)',
          card: 'var(--bg-card)',
          accent: 'var(--accent)',
          'accent-hover': 'var(--accent-hover)',
          text: 'var(--text-primary)',
          muted: 'var(--text-secondary)',
        },
      },
    },
  },
  plugins: [],
};