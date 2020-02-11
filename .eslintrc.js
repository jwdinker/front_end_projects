module.exports = {
  extends: ['airbnb', 'airbnb/hooks', 'prettier', 'prettier/@typescript-eslint', 'prettier/react'],
  plugins: ['@typescript-eslint'],
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
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/prop-types': 0,
    'spaced-comment': ['error', 'always', { markers: ['/', '!'] }],
    'no-underscore-dangle': 'off',
    'no-nested-ternary': 'off',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
    },
  ],
};
