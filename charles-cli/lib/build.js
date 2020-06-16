const webpack = require('webpack')
let config = require('./config/webpack.config')
const path = require('path');
const { resolve } = require('path');
const { rejects } = require('assert');

module.exports = function ({ staticDir }) {
  return new Promise((resolve, reject) => {
    const port = 3000
    config = config({ staticDir, port })
    try {
      webpack(config, (err, stats) => {

        if (err) {
          reject(err)
        }

        const info = stats.toJson()

        if (stats.hasErrors()) {
          reject(info.erros)
        }

        if (stats.hasWarnings()) {
          console.warn(info.warnings)
        }

        console.log(stats.toString({
          chunks: false, // Makes the build much quieter
          colors: true, // Shows colors in the console
          modules: false,
          hash: false,
          version: false,
          entrypoints: false,
          builtAt: false,
        }))

        resolve('打包完成！')
      })
    } catch (err) {
      console.log('发生错误--------------', err);
    }
  })

}