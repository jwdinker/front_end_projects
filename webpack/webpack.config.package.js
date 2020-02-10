const path = require('path');
const RULES = require('./rules');

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, '..', 'dist'),
    publicPath: '/',
  },
  module: {
    rules: RULES,
  },
};
