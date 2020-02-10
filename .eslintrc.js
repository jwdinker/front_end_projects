// module.exports = {
//   plugins: ["react-hooks", "prettier"],
//   extends: [
//     "plugin:import/errors",
//     "plugin:import/warnings",
//     "plugin:prettier/recommended",
//     "plugin:react/recommended"
//   ],
//   parser: "babel-eslint",
//   env: {
//     browser: true,
//     commonjs: true,
//     node: true,
//     es6: true
//   },
//   parserOptions: {
//     ecmaVersion: 2018,
//     sourceType: "module" //Prevents import and export linting errors
//   },
//   rules: {
//     "prettier/prettier": "error",
//     "react-hooks/exhaustive-deps": "warn",
//     "react-hooks/rules-of-hooks": "error",
//     "react/prop-types": 0,
//     "no-use-before-define": ["error"],
//     "no-unused-vars": ["error", { vars: "all" }]
//   }
// };

module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'prettier'],
  plugins: ['prettier'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    commonjs: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module', //Prevents import and export linting errors
  },
  rules: {
    'prettier/prettier': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/prop-types': 0,
  },
};
