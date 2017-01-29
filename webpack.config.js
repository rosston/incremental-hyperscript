'use strict'

var webpack = require('webpack')

module.exports = function (env) {
  var isMinifiedBuild = (env === 'min')

  var filename = (isMinifiedBuild)
    ? 'incremental-hyperscript.min.js'
    : 'incremental-hyperscript.js'

  var plugins
  if (isMinifiedBuild) {
    plugins = [
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      })
    ]
  } else {
    plugins = []
  }

  return {
    entry: './src/incremental-hyperscript.js',
    devtool: 'source-map',
    output: {
      path: './dist',
      filename: filename,
      library: 'IncrementalHyperscript',
      libraryTarget: 'umd'
    },
    externals: {
      'incremental-dom': {
        commonjs: 'incremental-dom',
        commonjs2: 'incremental-dom',
        amd: 'incremental-dom',
        root: 'IncrementalDOM'
      }
    },
    plugins: plugins
  }
}
