require('dotenv').load();

const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

module.exports = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(css|scss)/,
        loader: 'emit-file-loader',
        options: {
          name: 'dist/[path][name].[ext]'
        }
      }
    ,
      {
        test: /\.css$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader']
      }
    ,
      {
        test: /\.s(a|c)ss$/,
        use: ['babel-loader', 'raw-loader', 'postcss-loader',
          { loader: 'sass-loader',
            options: {
              includePaths: ['styles', 'node_modules', '../node_modules']
                .map(d => path.join(__dirname, d))
                .map(g => glob.sync(g))
                .reduce((a, c) => a.concat(c), [])
            }
          }
        ]
      }
    );

    // Images task
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader?prefix=image/&limit=5000&context=/static/images'
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.APPLICATIONS': JSON.stringify(process.env.APPLICATIONS),
        'process.env.API_URL': JSON.stringify(process.env.API_URL),
        'process.env.BASEMAP_TILE_URL': JSON.stringify(process.env.BASEMAP_TILE_URL),
        'process.env.CALLBACK_URL': JSON.stringify(process.env.CALLBACK_URL),
        'process.env.CONTROL_TOWER_URL': JSON.stringify(process.env.CONTROL_TOWER_URL),
        'process.env.WRI_API_URL': JSON.stringify(process.env.WRI_API_URL),
        'process.env.STATIC_SERVER_URL': JSON.stringify(process.env.STATIC_SERVER_URL)
      })
    );

    return config;
  }
};
