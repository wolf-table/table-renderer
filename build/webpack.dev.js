const { merge } = require('webpack-merge');
const common = require('./webpack.config.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  entry: {
    'table-renderer': './index-dev.ts',
  },
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      title: 'Table Render',
    }),
  ],
  devServer: {
    host: '0.0.0.0',
    static: '../dist',
  },
});
