const path = require('path');
const RULES = require('../../webpack/rules');

const { BABEL } = RULES;

module.exports = {
  entry: './src/index.js',
  mode: 'production',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
  },
  module: {
    rules: [BABEL],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
  },
};
