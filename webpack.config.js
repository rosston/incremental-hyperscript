'use strict'

module.exports = {
  entry: './src/incremental-hyperscript.js',
  output: {
    path: './dist',
    filename: 'incremental-hyperscript.js',
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
  }
}
