require('dotenv').load();

const webpack = require('webpack');
const withSass = require('@zeit/next-sass');

module.exports = withSass({
  useFileSystemPublicRoutes: false,

  webpack: (config) => {
    config.node = {
      console: true,
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    };

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.APPLICATIONS': JSON.stringify(process.env.APPLICATIONS),
        'process.env.BASEMAP_TILE_URL': JSON.stringify(process.env.BASEMAP_TILE_URL),
        'process.env.CALLBACK_URL': JSON.stringify(process.env.CALLBACK_URL),
        'process.env.CONTROL_TOWER_URL': JSON.stringify(process.env.CONTROL_TOWER_URL),
        'process.env.WRI_API_URL': JSON.stringify(process.env.WRI_API_URL),
        'process.env.BLOG_API_URL': JSON.stringify(process.env.BLOG_API_URL),
        'process.env.STATIC_SERVER_URL': JSON.stringify(process.env.STATIC_SERVER_URL),
        'process.env.ADD_SEARCH_KEY': JSON.stringify(process.env.ADD_SEARCH_KEY),
        'process.env.TRANSIFEX_LIVE_API': JSON.stringify(process.env.TRANSIFEX_LIVE_API),
        'process.env.BING_MAPS_API_KEY': JSON.stringify(process.env.BING_MAPS_API_KEY),
        'process.env.API_ENV': JSON.stringify(process.env.API_ENV),
        'process.env.GOOGLE_ANALYTICS': JSON.stringify(process.env.GOOGLE_ANALYTICS),
        'process.env.RW_GOGGLE_API_TOKEN_SHORTENER': JSON.stringify(
          process.env.RW_GOGGLE_API_TOKEN_SHORTENER
        ),
        'process.env.BITLY_TOKEN': JSON.stringify(process.env.BITLY_TOKEN),
        'process.env.PARDOT_NEWSLETTER_URL': JSON.stringify(process.env.PARDOT_NEWSLETTER_URL)
      })
    );

    return config;
  }
});
