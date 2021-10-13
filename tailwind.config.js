// ! The app uses the PostCSS 7 compatibility build (see https://tailwindcss.com/docs/installation#post-css-7-compatibility-build)
// ! due to @zeit/next-css and @zeit/next-sass internal dependencies.
// ! Once these dependencies are gone, do not forget to update Tailwind's dependencies to latest versions (https://tailwindcss.com/docs/installation#install-tailwind-via-npm)
module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './layout/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
