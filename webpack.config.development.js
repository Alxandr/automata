/**
 * Build config for development process that uses Hot-Module-Replacement
 * https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
 */

import baseConfig from './webpack.config.base';
import merge from 'webpack-merge';
import { renderer as rendererAliases } from './aliases';
import webpack from 'webpack';

const port = process.env.PORT || 5000;

export default merge(baseConfig, {
  devtool: 'inline-source-map',

  entry: [
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    `webpack-dev-server/client?http://localhost:${port}`,

    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    'webpack/hot/only-dev-server',

    // polyfills
    'babel-polyfill',

    // entry point
    './app/renderer'
  ],

  output: {
    publicPath: `http://localhost:${port}/dist/`
  },

  plugins: [
    // https://webpack.github.io/docs/hot-module-replacement-with-webpack.html
    new webpack.HotModuleReplacementPlugin(),

    // Emit module names?
    new webpack.NamedModulesPlugin(),

    /**
     * If you are using the CLI, the webpack process will not exit with an error
     * code by enabling this plugin.
     * https://github.com/webpack/docs/wiki/list-of-plugins#noerrorsplugin
     */
    new webpack.NoEmitOnErrorsPlugin(),

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
      'process.env.NODE_ENV': JSON.stringify('development')
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    })
  ],

  /**
   * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
   */
  target: 'electron-renderer',

  resolve: {
    alias: rendererAliases
  }
});
