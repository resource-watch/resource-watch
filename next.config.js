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
    '/about/newsletter': { page: 'app/newsletter' },
    '/about/partners': { page: '/partners' },
    '/privacy-policy': { page: '/policy' },
    '/api-attribution-requirements': { page: 'attribution-requirements' },
    '/data/explore': { page: '/explore' },
    '/data/pulse': { page: '/pulse' },
  }),

  env: {
    RW_ENV: process.env.RW_ENV || 'development',
    APPLICATIONS: applicationConfig.get('applications'),
    CALLBACK_URL: applicationConfig.get('callbackUrl'),
    WRI_API_URL: applicationConfig.get('wriApiUrl'),
    BLOG_API_URL: process.env.BLOG_API_URL,
    STATIC_SERVER_URL: process.env.STATIC_SERVER_URL,
    ADD_SEARCH_KEY: process.env.ADD_SEARCH_KEY,
    TRANSIFEX_LIVE_API: process.env.TRANSIFEX_LIVE_API,
    BING_MAPS_API_KEY: process.env.BING_MAPS_API_KEY,
    API_ENV: applicationConfig.get('apiEnv'),
    GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
    RW_GOGGLE_API_TOKEN_SHORTENER: process.env.RW_GOGGLE_API_TOKEN_SHORTENER,
    BITLY_TOKEN: applicationConfig.get('bitlyToken'),
    PARDOT_NEWSLETTER_URL: process.env.PARDOT_NEWSLETTER_URL,
    RW_MAPBOX_API_TOKEN: process.env.RW_MAPBOX_API_TOKEN,
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
