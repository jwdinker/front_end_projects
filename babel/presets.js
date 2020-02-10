// const BABEL_PRESET_ENV = [
//   '@babel/preset-env',
//   {
//     useBuiltIns: 'entry',
//     corejs: 3,
//     modules: false,
//     debug: true,
//   },
// ];

// const REACT_PRESET_ENV = [
//   '@babel/preset-react',
//   {
//     useBuiltIns: true,
//     targets: {
//       node: '6.10',
//       esmodules: true,
//     },
//   },
// ];

const BABEL_PRESET_ENV = [
  '@babel/preset-env',
  // {
  //   useBuiltIns: 'entry',
  //   corejs: 3,
  //   modules: true,
  // },
];

const REACT_PRESET_ENV = [
  '@babel/preset-react',
  {
    useBuiltIns: true,
  },
];

module.exports = {
  BABEL_PRESET_ENV,
  REACT_PRESET_ENV,
};
