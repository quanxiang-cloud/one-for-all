const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const WebpackNotifier = require('webpack-notifier')
const TsConfigPathPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    static: [
      path.resolve(__dirname, 'build'),
      path.resolve(__dirname, '../ui'),
      {
        directory: path.resolve(__dirname, '../ui/assets'),
        publicPath: '/dist'
      }
    ],
    compress: false,
    port: 5000,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
    plugins: [new TsConfigPathPlugin()],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        }],
        exclude: /node_modules/,
      },
      {
        test: /\.s?css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
        exclude: /\.m\.scss$/i,
      },
      {
        test: /\.m\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader', options: {
              url: false,
              importLoaders: 2,
              modules: {
                localIdentName: '[path][name]__[local]--[hash:base64:5]',
              },
            },
          },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      title: 'page engine dev example',
      template: './tmpl/dev.html',
      filename: path.resolve(__dirname, 'build/index.html'),
    }),
    new WebpackNotifier({ alwaysNotify: true }),
  ],
}
