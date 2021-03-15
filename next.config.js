require('dotenv').load();

const applicationConfig = require('config');
const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const cssnano = require('cssnano');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withCSS(withSass({
  useFileSystemPublicRoutes: false,
  poweredByHeader: false,

  exportPathMap: async (defaultPathMap) => ({
    ...defaultPathMap,
    '/': { page: '/home' },
    '/about/contact-us': { page: '/contact-us' },
    '/about/faqs': { page: '/faqs' },
    '/about/howto': { page: 'how-to' },
    '/about/partners': { page: '/partners' },
    '/privacy-policy': { page: '/policy' },
    '/api-attribution-requirements': { page: 'attribution-requirements' },
    '/data/explore': { page: '/explore' },
    '/data/pulse': { page: '/pulse' },
  }),

  env: {
    ADD_SEARCH_KEY: process.env.ADD_SEARCH_KEY,
    API_ENV: applicationConfig.get('apiEnv'),
    APPLICATIONS: applicationConfig.get('applications'),
    BING_MAPS_API_KEY: applicationConfig.get('bingMapsApiKey'),
    BITLY_TOKEN: applicationConfig.get('bitlyToken'),
    BLOG_API_URL: applicationConfig.get('blogApiUrl'),
    CALLBACK_URL: applicationConfig.get('callbackUrl'),
    GOOGLE_ANALYTICS: applicationConfig.get('googleAnalytics'),
    RW_ENV: applicationConfig.get('rwEnv'),
    RW_GOGGLE_API_TOKEN_SHORTENER: applicationConfig.get('rwGoggleApiTokenShortener'),
    RW_MAPBOX_API_TOKEN: applicationConfig.get('rwMapboxApiToken'),
    WRI_API_URL: applicationConfig.get('wriApiUrl'),
  },

  webpack: (config) => {
    // eslint-disable-next-line no-underscore-dangle
    const _config = { ...config };

    _config.node = {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    };

    _config.plugins.push(
      // optimizes any css file generated
      new OptimizeCssAssetsPlugin({
        cssProcessor: cssnano,
        cssProcessorPluginOptions: { preset: ['default', { discardComments: { removeAll: true } }] },
      }),
    );

    return _config;
  },
})));
