const path = require('path');
const glob = require('glob');

const webpack = require('webpack');

module.exports = {
  webpack: (config, { dev }) => {
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
              includePaths: ['css', 'node_modules']
                .map(d => path.join(__dirname, d))
                .map(g => glob.sync(g))
                .reduce((a, c) => a.concat(c), [])
            }
          }
        ]
      }
    );
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.TEMP_TOKEN': JSON.stringify(process.env.TEMP_TOKEN),
        'process.env.BACKOFFICE_API_URL': JSON.stringify(process.env.BACKOFFICE_API_URL),
        'process.env.WRI_API_URL': JSON.stringify(process.env.WRI_API_URL)
      })
    );
    return config;
  }
};
