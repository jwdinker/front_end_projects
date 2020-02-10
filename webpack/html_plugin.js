const _HTMLWebpackPlugin = require('html-webpack-plugin');

const HTMLWebpackPlugin = new _HTMLWebpackPlugin({
  title: 'Development',
  filename: 'index.html',
  template: './public/index.html',
  meta: {
    viewport: 'width=device-width, initial-scale=1',
  },
});

module.exports = HTMLWebpackPlugin;
