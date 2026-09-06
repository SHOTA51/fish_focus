/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#0EA5E9",
        deep: "#0C4A6E",
        sand: "#FEF3C7",
      },
    },
  },
  plugins: [],
};