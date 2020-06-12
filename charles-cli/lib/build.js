const webpack = require('webpack')
const webpackConfig = require('./config/webpack.config')
const path = require('path');

module.exports = function ({ staticDir }) {
  webpackConfig.output.path = staticDir

  try {
    webpack(webpackConfig, (err, stats) => {
      if (err || stats.hasErrors()) {
        console.log('打包错误------------', err || stats.compilation.errors);
      }
    })
  } catch (err) {
    console.log('发送错误--------------', err);
  }
}