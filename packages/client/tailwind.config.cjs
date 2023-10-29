/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        backgroundImage: theme => ({
          'space-bg': "url('/assets/space-bg.png')",
        }),
      },
      animation: {
        flashGreen: 'flashGreen 2s',
        flashRed: 'flashRed 2s',
      },
      keyframes: {
        flashGreen: {
          '0%': { color: 'green' },
          '100%': { color: 'white' },
        },
        flashRed: {
          '0%': { color: 'red' },
          '100%': { color: 'white' },
        },
      },
    },
    plugins: [
      function ({ addComponents }) {
        const buttons = {
          '.btn-sci-fi': {
            '@apply mr-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-md transform transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500': {},
            '&:hover': {
              '@apply scale-110': {},
            },
          },
          '.btn-active': {
            '@apply mr-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-md': {},
          },          
          '.btn-cta': {
            '@apply mr-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-md transform transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500': {},
            '&:hover': {
              '@apply scale-110': {},
            },
          },          
        }
        addComponents(buttons)
      },
    ],
  };
  