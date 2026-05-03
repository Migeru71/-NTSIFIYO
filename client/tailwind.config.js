/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#E65100",
        "primary-dark": "#1E3A8A",
        "background-start": "#A8E6CF",
        "background-end": "#FFF9C4",
        "surface-light": "#FFFFFF",
        "text-main-light": "#374151",
        "accent-pink": "#D81B60",
      },
      fontFamily: {
        "display": ["Poppins", "sans-serif"],
        "sans": ["Public Sans", "sans-serif"]
      },
      borderRadius: {
        "card-lg": "20px",
        "card-md": "15px",
        "img": "12px"
      }
    },
  },
  plugins: [],
}