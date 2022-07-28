const path = require('path');

module.exports = {
  entry: {
    'table-render': './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    clean: true,
  },
};
