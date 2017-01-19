'use strict'

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'src/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'src/*.spec.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox'],
    singleRun: true,
    concurrency: Infinity,
    webpack: {
      devtool: 'inline-source-map'
    }
  })
}
