/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{tsx,ts,js,jsx}"],
  theme: {
    extend: {
      zIndex: {
        '1000': '1000',
        '1200': '1200'
      },
      colors: {
        'dim': 'rgba(0, 0, 0, 0.3)'
      }

    },
  },
  plugins: [],
}

