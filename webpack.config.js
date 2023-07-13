const path = require('path');

module.exports = {
  entry: './src',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    port: 8080, // Change this port number if required
  },
  watch: true,
};