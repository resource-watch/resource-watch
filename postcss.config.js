module.exports = {
  plugins: {
    // ! this plugin might be removed in the future when the application
    // ! has fully migrated to tailwind and dropped support of deprecated
    // ! @zeit/next-css and @zeit/next-sass
    'postcss-easy-import': { prefix: '_' },
    tailwindcss: {},
    autoprefixer: {},
  },
};
