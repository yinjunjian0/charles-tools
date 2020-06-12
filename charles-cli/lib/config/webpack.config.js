const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackBar = require('webpackbar');


module.exports = {
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    crossOriginLoading: 'anonymous',
    chunkFilename: 'js/[name]-[chunkhash].js',
  },
  optimization: {
    splitChunks: {
      // chunks: "async", //将什么类型的代码块用于分割，三选一： "initial"：入口代码块 | "all"：全部 | "async"：按需加载的代码块
      minSize: 0, //大小超过30kb的模块才会被提取
      name: true, //每个缓存组打包得到的代码块的名称
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2,
          maxInitialRequests: 3, // 默认为3
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "initial",
          name: "vendor",
        },
      },
    },
  },
  plugins: [
    new WebpackBar(),
    new HtmlWebpackPlugin({
      title: 'test HTMLWebpackPlugin',
      template: "./public/index.html"
    }),
    new CleanWebpackPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|ts)x?$/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
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
        ]
      },
      {
        test: /\.js$/,
        use: [{
          loader: require.resolve('babel-loader'),
          options: {
            presets: [require.resolve('@babel/preset-react')],
            cacheDirectory: true,
          }
        }],
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
            loader: require.resolve('url-loader'),
            options: {
              limit: 1,
              outputPath: 'img/'
            }
          }
        ]
      }
    ]
  }
};