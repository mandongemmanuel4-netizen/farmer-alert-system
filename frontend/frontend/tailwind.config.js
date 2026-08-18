/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Farmer portal — green (from mockup)
        farmer: {
          DEFAULT: '#16a34a',
          dark: '#15803d',
          light: '#dcfce7',
        },
        // Admin & CSO portal — navy blue (from mockup)
        official: {
          DEFAULT: '#1e3a8a',
          dark: '#1e2a5e',
          light: '#dbeafe',
        },
        alert: {
          panic: '#dc2626',
          overdue: '#f59e0b',
          ontime: '#16a34a',
        },
      },
    },
  },
  plugins: [],
};
