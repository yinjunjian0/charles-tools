const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

let config = require('./config/webpack.dev.js');


module.exports = function ({ staticDir }) {
  const options = {
    contentBase: './dist',
    quiet: true,
    compress: true,
    open: true,
    inline: true,
    hot: true,
  };

  const port = 3000
  config = config({ staticDir, port })

  webpackDevServer.addDevServerEntrypoints(config, options);
  const compiler = webpack(config);
  const server = new webpackDevServer(compiler, options);

  server.listen(port, 'localhost', () => {
  });
}


