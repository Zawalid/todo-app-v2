/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        "background-primary" : "#FFFFFF",
        "background-secondary" : "#F4F4F4",
        "background-tertiary" : "#EBEBEB",
        "text-primary" : "#212529",
        "text-secondary" : "#444444",
        "text-tertiary" : "#7C7C7C", 
        "button-primary" : "#FFD43B",
      }
    },
  },
  plugins: [],
}