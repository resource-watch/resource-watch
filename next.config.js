const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// @ts-check

/**
 * @type {import('next').NextConfig}
 * */

module.exports = withBundleAnalyzer({
  poweredByHeader: false,

  eslint: {
    // prevents compilation process to fail due to eslint warnings/errors.
    // todo: fix eslint errors/warnings slowly until we ensure we can remove this option.
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ['s3.amazonaws.com'],
  },

  async redirects() {
    return [
      {
        source: '/data',
        destination: '/data/explore',
        permanent: true,
      },
      {
        source: '/topics',
        destination: '/dashboards',
        permanent: true,
      },
      {
        source: '/topics/:id',
        destination: '/dashboards/:id',
        permanent: true,
      },
      {
        source: '/myrw',
        destination: '/myrw/widgets/my_widgets',
        permanent: true,
      },
      {
        source: '/dashboards/ocean',
        destination: '/dashboards/ocean-watch',
        permanent: true,
      },
    ];
  },

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
});
