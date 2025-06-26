const path = require('path');

module.exports = {
  entry: {
    main_window: './src/renderer/index.tsx'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '.webpack/renderer')
  }
};