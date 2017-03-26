/**
 * Build config for electron 'Renderer Process' file
 */

import BabiliPlugin from 'babili-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import baseConfig from './webpack.config.base';
import merge from 'webpack-merge';
import path from 'path';
import webpack from 'webpack';

export default merge(baseConfig, {
  devtool: 'cheap-module-source-map',

  entry: [ 'babel-polyfill', './app/index' ],

  output: {
    path: path.join(__dirname, 'app/dist'),
    publicPath: '../dist/'
  },

  plugins: [
    /**
     * Assign the module and chunk ids by occurrence count
     * Reduces total file size and is recommended
     */
    new webpack.optimize.OccurrenceOrderPlugin(),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),

    /**
     * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
     */
    new BabiliPlugin({}),

    /**
     * Dynamically generate index.html page
     */
    new HtmlWebpackPlugin({
      filename: '../app.html',
      template: 'app/app.html',
      inject: false
    })
  ],

  // https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
  target: 'electron-renderer'
});
