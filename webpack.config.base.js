/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';

export default {
  module: {
    rules: [ {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: [/node_modules/]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    } ]
  },

  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'app'),

    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2'
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: [ '.js', '.json' ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      minChunks: 2,
      children: true,
      async: true
    })
  ]
};
