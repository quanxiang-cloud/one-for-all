import path from 'path';
import HtmlPlugin from 'html-webpack-plugin';
import WebpackNotifier from 'webpack-notifier';
import TsConfigPathPlugin from 'tsconfig-paths-webpack-plugin';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './dev/index.tsx',
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
  },
  devServer: {
    static: [
      {
        directory: path.resolve(__dirname, '../../dist'),
        publicPath: '/dist'
      },
      path.resolve(__dirname, 'build'),
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
    alias: {
      '@one-for-all/ui': path.resolve(__dirname, '../ui/src/index.ts'),
      // '@one-for-all/icon': path.resolve(__dirname, '../icon/src/index.tsx'),
      '@one-for-all/render-engine': path.resolve(__dirname, '../render-engine/src/index.ts'),
      '@one-for-all/utils': path.resolve(__dirname, '../utils/src/index.ts')
    },
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
      template: './dev/tmpl.html',
      filename: path.resolve(__dirname, 'build/index.html'),
    }),
    new WebpackNotifier({ alwaysNotify: true }),
  ],
}
