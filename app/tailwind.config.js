/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    require("tailwindcss-font-inter"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require('@tailwindcss/line-clamp'),
  ],
};
