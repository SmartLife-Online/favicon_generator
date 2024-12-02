/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      './public/**/*.html',
      "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    purge: [
        './index.html',
        './public/**/*.html',
        './src/**/*.{vue,js,ts,jsx,tsx}'
    ],
    darkMode: false,
    theme: {
      extend: {},
    },
    plugins: [],
  }
  
  