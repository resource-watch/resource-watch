const path = require('path');

module.exports = {
  features: {
    postcss: false,
  },
  stories: [
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  staticDirs: ['../public'],
  addons: [
    {
      name: '@storybook/preset-scss',
      options: {
        cssLoaderOptions: {
          url: false,
        }
      }
    },
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config) => {
    // RESOLVE node_modules
    // If you want to add a directory to search in that takes precedence over node_modules/:
    // https://webpack.js.org/configuration/resolve/#resolvemodules
    config.resolve.modules = [path.resolve(__dirname, ".."), "node_modules"];

    return config;
  },
}
