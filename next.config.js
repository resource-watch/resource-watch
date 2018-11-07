require('dotenv').load();

const webpack = require('webpack');
const withCSS = require('@zeit/next-css');
const withSass = require('@zeit/next-sass');
const commonsChunkConfig = require('@zeit/next-css/commons-chunk-config');

module.exports = withCSS(
  withSass({
    webpack: (originalConfig) => {
      const config = Object.assign({}, originalConfig);

      config.node = { fs: 'empty' };

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
          'process.env.APPLICATIONS': JSON.stringify(process.env.APPLICATIONS),
          'process.env.API_URL': JSON.stringify(process.env.API_URL),
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
          'process.env.BITLY_TOKEN': JSON.stringify(process.env.BITLY_TOKEN)
        })
      );

      return commonsChunkConfig(config, /\.(sass|scss|css)$/);
    }
  })
);
