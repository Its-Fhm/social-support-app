// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // You can add custom colors or fonts here if desired
      // For example, use Poppins:
      // fontFamily: { sans: ['Poppins', 'ui-sans-serif', 'system-ui'] },
    },
  },
  plugins: [],
};