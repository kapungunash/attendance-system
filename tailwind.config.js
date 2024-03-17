import c from "tailwindcss/colors"

const config = {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'],

  plugins: [require('flowbite/plugin')],

  darkMode: 'class',

  theme: {
    extend: {
      colors: {
        primary: c.blue,
        gray: c.slate,
        "muted": c.slate["700"],
        destructive: c.red["600"]

      }
    }
  }
  , fontFamily: {

    sans: ['Inter', 'sans-serif'],
    body: ['Inter', 'ui-sans-serif']
  }
};

module.exports = config;