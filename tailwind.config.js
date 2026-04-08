/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C8956C',
        secondary: '#D4A574',
        background: '#FAF7F2',
        text: '#2C2420',
        'text-light': '#6B5B4E',
        divider: '#E8E0D5',
        success: '#27AE60',
        danger: '#C0392B',
      },
      fontFamily: {
        sans: ['PingFang SC', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
