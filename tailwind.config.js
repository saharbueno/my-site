/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/views/**/*.hbs', 
    './src/public/**/*.js', 
  ],
  theme: {
    extend: {
      colors: {
        'light-pink': '#ffd6f4',
        'baby-pink': '#feebf9',
        'super-light-pink': '#FFFAFE',
      }
    },
    variants: {
      extend: {
        opacity: ['active']
      }
    }
  },
  plugins: [],
}

