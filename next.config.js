require('dotenv').load();

const path = require('path');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const { BundleAnalyzerPlugin } = (process.env.RW_NODE_ENV === 'production' && process.env.BUNDLE_ANALYZER) ?
  require('webpack-bundle-analyzer') : {};

module.exports = withCSS(withSass({
  useFileSystemPublicRoutes: false,

  env: {
    RW_NODE_ENV: process.env.RW_NODE_ENV || 'development',
    APPLICATIONS: process.env.APPLICATIONS,
    CALLBACK_URL: process.env.CALLBACK_URL,
    CONTROL_TOWER_URL: process.env.CONTROL_TOWER_URL,
    WRI_API_URL: process.env.WRI_API_URL,
    BLOG_API_URL: process.env.BLOG_API_URL,
    STATIC_SERVER_URL: process.env.STATIC_SERVER_URL,
    ADD_SEARCH_KEY: process.env.ADD_SEARCH_KEY,
    TRANSIFEX_LIVE_API: process.env.TRANSIFEX_LIVE_API,
    BING_MAPS_API_KEY: process.env.BING_MAPS_API_KEY,
    API_ENV: process.env.API_ENV,
    GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
    RW_GOGGLE_API_TOKEN_SHORTENER: process.env.RW_GOGGLE_API_TOKEN_SHORTENER,
    BITLY_TOKEN: process.env.BITLY_TOKEN,
    PARDOT_NEWSLETTER_URL: process.env.PARDOT_NEWSLETTER_URL,
    RW_MAPBOX_API_TOKEN: process.env.RW_MAPBOX_API_TOKEN
  },

  webpack: (config) => {
    const _config = Object.assign({}, config);

    _config.node = {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    };

    _config.plugins.push(
      // optimizes any css file generated
      new OptimizeCssAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorPluginOptions: { preset: ['default', { discardComments: { removeAll: true } }] }
      })
    );

    // Copy the images of the widget-editor
    _config.plugins.push(
      new CopyWebpackPlugin([
        {
          from: path.join(__dirname, 'node_modules/widget-editor/dist/images'),
          to: path.join(__dirname, 'public/static/images/widget-editor/')
        }
      ])
    );

    if (process.env.BUNDLE_ANALYZER) _config.plugins.push(new BundleAnalyzerPlugin());

    return _config;
  }
}));
