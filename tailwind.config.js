/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink: '#FFD6E8',
          'pink-btn': '#FFB8D4',
          purple: '#E8D5FF',
          blue: '#D5E8FF',
          yellow: '#FFF4D5',
          'yellow-btn': '#FFE082',
          green: '#D5FFE8',
        }
      },
      fontFamily: {
        title: ['Jua', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1.5rem',
        '2xl': '2rem',
        '3xl': '3rem',
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.06), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 6px 20px rgba(0, 0, 0, 0.08), 0 3px 8px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
