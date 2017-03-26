/**
 * Base webpack config used across other specific configs
 */

import { dependencies as deps, devDependencies as devDeps } from './app/package.json';

import path from 'path';

const externals = {
  ...(deps || {}),
  ...(devDeps || {})
};

export default {
  module: {
    loaders: [ {
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loaders: ['json-loader']
    } ]
  },

  output: {
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

  plugins: [],

  externals: Object.keys(externals)
};
