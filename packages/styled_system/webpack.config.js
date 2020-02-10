const path = require('path');
const RULES = require('../../webpack/rules');

const isProduction = process.env.NODE_ENV === 'production';

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
    rules: RULES,
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    'styled-components': {
      root: 'styled-components',
      commonjs2: 'styled-components',
      commonjs: 'styled-components',
      amd: 'styled-components',
    },
    'styled-system': {
      root: 'styled-system',
      commonjs2: 'styled-system',
      commonjs: 'styled-system',
      amd: 'styled-system',
    },
  },
};
