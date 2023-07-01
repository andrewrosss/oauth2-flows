const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      textShadow: {
        sm: '0 0 1px var(--tw-shadow-color), 0 0 4px var(--tw-shadow-color)',
        DEFAULT: '0 0 2px var(--tw-shadow-color), 0 0 8px var(--tw-shadow-color)',
        lg: '0 0 4px var(--tw-shadow-color), 0 0 16px var(--tw-shadow-color)',
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      )
    }),
  ],
};
