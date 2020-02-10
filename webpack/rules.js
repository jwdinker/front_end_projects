const CSS = {
  test: /\.css$/,
  use: ['style-loader', 'css-loader'],
};

const HTML_LOADER = {
  test: /\.html$/i,
  loader: 'html-loader',
};

const IMAGES = {
  test: /\.(png|jpe?g|gif)$/i,
  loader: 'file-loader',
  options: {
    publicPath: './images',
  },
};

const FONTS = {
  test: /\.(woff(2)?|ttf|eot|svg|otf)(\?v=\d+\.\d+\.\d+)?$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: './fonts',
      },
    },
  ],
};

/*

Specifying the presets in the webpack config will only affect webpack, not the
babelrc.json file. everything else that uses babel (e.g. babel-node,
babel-register, etc.) will not be able to use the webpack config.  
Hence the reason you have to have duplicate settings.
*/
const BABEL = {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
    },
  },
};

const TYPESCRIPT = {
  test: /\.tsx?$/,
  use: 'ts-loader',
  exclude: /node_modules/,
};

const RULES = { BABEL, CSS, IMAGES, FONTS, HTML_LOADER };

module.exports = RULES;
