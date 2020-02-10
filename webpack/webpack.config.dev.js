const path = require('path');
const RULES = require('./rules');
const HTML_PLUGIN = require('./html_plugin');
const fs = require('fs');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devServer: {
    https: false,
    contentBase: './src/index.js',
    compress: true,
    port: 3000,
    host: '192.168.1.4',
    historyApiFallback: true,
    https: {
      key: fs.readFileSync('/Users/jwdinker/Development/certificates/localhost-key.pem'),
      cert: fs.readFileSync('/Users/jwdinker/Development/certificates/localhost.pem'),
      ca: fs.readFileSync('/Users/jwdinker/Library/Application Support/mkcert/rootCA.pem'),
    },
  },
  module: {
    rules: RULES,
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist_dev'),
    publicPath: '/',
  },
  plugins: [HTML_PLUGIN],
};
