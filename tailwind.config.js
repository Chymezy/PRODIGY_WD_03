/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F46E5', // Indigo
          dark: '#6366F1',
        },
        background: {
          light: '#FFFFFF',
          dark: '#1F2937',
        }
      },
    },
  },
  plugins: [],
}
