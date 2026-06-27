/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1A3557',
          light: '#2A4D7D',
          dark: '#0D1B2E',
        },
        mint: {
          DEFAULT: '#2ECC8A',
          light: '#56D8A1',
          dark: '#27AF76',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
