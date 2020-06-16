const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');

const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

const distPath = path.resolve(__dirname, 'dist')


module.exports = ({ staticDir, port, app = 'unknown' }) => {
  return {
    mode: 'development',
    entry: ['react-hot-loader/patch', './src'],
    devtool: 'inline-source-map',

    output: {
      filename: '[name].bundle.js',
      path: staticDir || distPath,
      publicPath: ''
    },

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      alias: {
        'react-dom': '@hot-loader/react-dom',
        '@': path.resolve(staticDir, '../src')
      },
    },

    plugins: [
      new AntdDayjsWebpackPlugin({ initFilePath: path.resolve(staticDir, '../') }), // 替换moment
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: [`开发地址: http://localhost:${port}`, `开发完成请使用：charles deploy`],
          clearConsole: true,
        },
        clearConsole: true,
      }),
      new WebpackBar(),
      new HtmlWebpackPlugin({
        title: `${app}(local)`,
        template: require.resolve("../public/index.html")
      }),
      // new CleanWebpackPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
    ],

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('ts-loader'),
            },
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                presets: [require.resolve('@babel/preset-react'), require.resolve("@babel/preset-typescript")],
                plugins: [
                  // require.resolve('react-hot-loader/babel'),
                ]
              }
            },
          ],
        },
        {
          test: /\.(js)x?$/,
          exclude: /node_modules/,
          use: [{
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              presets: [require.resolve('@babel/preset-react')],
              plugins: [
                [
                  require.resolve('babel-plugin-import'),
                  {
                    libraryName: 'antd',
                    style: true
                  },
                  require.resolve('react-hot-loader/babel'),
                ]
              ]
            }
          }],
        },
        {
          test: /\.css/,
          use: [require.resolve('style-loader'), require.resolve('css-loader')]
        },
        {
          test: /\.less/,
          use: [{
            loader: require.resolve('style-loader'),
          },
          {
            loader: require.resolve('css-loader'),
          },
          {
            loader: require.resolve('less-loader'),
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          }]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            require.resolve('file-loader')
          ]
        }
      ]
    }
  }
}