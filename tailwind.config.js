/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-primary": "#FFFFFF",
        "background-secondary": "#F4F4F4",
        "background-tertiary": "#EBEBEB",
        "text-primary": "#212529",
        "text-secondary": "#444444",
        "text-tertiary": "#7C7C7C",
        "button-primary": "#FFD43B",
        "custom-1": "#ff6b6b",
        "custom-2": "#da77f2",
        "custom-3": "#9775fa",
        "custom-4": "#5c7cfa",
        "custom-5": "#66d9e8",
        "custom-6": "#8ce99a",
        "custom-7": "#ffd43b",
        "custom-8": "#ff922b",
      }
    },
  },
  plugins: [],
}

