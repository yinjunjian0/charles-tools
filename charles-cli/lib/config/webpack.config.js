const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = ({ staticDir, port }) => {
  return {
    mode: 'production',
    entry: { app: './src/index.js', vendor: ['react', 'react-dom'] },

    output: {
      filename: 'js/[name].[hash].js',
      path: staticDir || path.resolve(__dirname, 'dist'),
      crossOriginLoading: 'anonymous',
      chunkFilename: 'js/[name]-[chunkhash].js',
    },

    devtool: false,

    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
      alias: {
        '@': path.resolve(staticDir, '../src'),
      },
    },

    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },

    optimization: {
      splitChunks: {
        chunks: 'all',  // initial(初始块)、async(按需加载块)、all(全部块)，默认为async
        name: true,
        cacheGroups: {
          vendor: {
            name: "vendor",
            chunks: "initial"
          }
        }
      },
    },

    plugins: [
      new AntdDayjsWebpackPlugin(), // 替换moment
      new BundleAnalyzerPlugin({ // 查看打包性能 
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8888,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        logLevel: 'info'
      }),
      new WebpackBar(),
      new HtmlWebpackPlugin({
        title: 'test HTMLWebpackPlugin',
        template: require.resolve("../public/index.html")
      }),
      new CleanWebpackPlugin(),
      new webpack.NamedModulesPlugin(),
      // new OptimizeCssAssetsPlugin({
      //   assetNameRegExp: /\.optimize\.css$/g,
      //   cssProcessor: require('cssnano'),
      //   cssProcessorPluginOptions: {
      //     preset: ['default', { discardComments: { removeAll: true } }],
      //   },
      //   canPrint: true
      // })
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
                plugins: []
              }
            },
          ],
        },
        {
          test: /\.(js)x?$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [require.resolve('@babel/preset-react')],
                plugins: [
                  [
                    require.resolve('babel-plugin-import'),
                    {
                      libraryName: 'antd',
                      style: true
                    },
                  ]
                ]
              }
            }
          ],
          exclude: /node_modules/
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
            {
              loader: require.resolve('file-loader'),
              options: {
                limit: 1,
                outputPath: 'img/'
              }
            }
          ]
        }
      ]
    }
  }
}