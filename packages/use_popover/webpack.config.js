const path = require('path');
const RULES = require('../../webpack/rules');

const { BABEL } = RULES;

const isProduction = process.env.NODE_ENV === 'production';

const externals = {
  react: {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react',
  },
};

const production = {
  entry: './src/index.js',
  mode: 'production',
  devtool: 'source-map',
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
  externals,
};

const development = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    devtoolLineToLine: true,
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this",
    pathinfo: true,
  },
  devtool: 'source-map',
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
  },
  module: {
    rules: [BABEL],
  },
  externals,
};

module.exports = isProduction ? production : development;
