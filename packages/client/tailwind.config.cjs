/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        backgroundImage: theme => ({
          'space-bg': "url('/public/assets/space-bg.png')",
        }),
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
        }
        addComponents(buttons)
      },
    ],
  };
  