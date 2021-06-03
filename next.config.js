const withSass = require('@zeit/next-sass');
const withCSS = require('@zeit/next-css');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(withCSS(withSass({
  poweredByHeader: false,

  // exportPathMap: async (defaultPathMap) => ({
  //   ...defaultPathMap,
  //   '/': { page: '/home' },
  //   '/about/contact-us': { page: '/contact-us' },
  //   '/about/faqs': { page: '/faqs' },
  //   '/about/howto': { page: 'how-to' },
  //   '/about/partners': { page: '/partners' },
  //   '/privacy-policy': { page: '/policy' },
  //   '/api-attribution-requirements': { page: 'attribution-requirements' },
  //   '/data/explore': { page: '/explore' },
  //   '/data/pulse': { page: '/pulse' },
  // }),

  webpack: (config) => {
    // eslint-disable-next-line no-underscore-dangle
    const _config = { ...config };

    _config.node = {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
    };

    return _config;
  },
})));
