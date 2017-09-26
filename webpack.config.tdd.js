const path = require('path');
const webpack = require('webpack');

// 友报账生产环境服务器
const DEFAULT_PROD_SERVER = '172.20.4.88:8088';
const DEFAULT_PATH_PREFIX = '';
const DEFAULT_PROTOCOL = 'http';

module.exports = {
  devtool: 'source-map',
  entry: undefined,
  output: undefined,
  plugins: [
    /**
     * This plugin assigns the module and chunk ids by occurence count. What this
     * means is that frequently used IDs will get lower/shorter IDs - so they become
     * more predictable.
     */
    new webpack.optimize.OccurenceOrderPlugin(),
    /**
     * See description in 'webpack.config.dev' for more info.
     */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        PROD_SERVER: JSON.stringify(process.env.PROD_SERVER || DEFAULT_PROD_SERVER),
        PATH_PREFIX: JSON.stringify(process.env.PATH_PREFIX || DEFAULT_PATH_PREFIX),
        PROTOCOL: JSON.stringify(process.env.PROTOCOL || DEFAULT_PROTOCOL)
      }
    })
  ],
  externals: {
    fs: '{}'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/, /styles/],
        loader: 'babel',
        // include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!less-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style!css!sass'
      },
      {
        test: /\.(png|jpg|bmp|gif)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  }
};
