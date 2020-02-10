const TRANFORM_DESTRUCTING = [
  '@babel/plugin-transform-destructuring',
  {
    loose: false,
    selectiveLoose: ['useState', 'useEffect', 'useContext', 'useCallback', 'useMemo', 'useRef'],
  },
];

const REACT_REMOVE_PROP_TYPES = ['transform-react-remove-prop-types', { mode: 'unsafe-wrap' }];

const TRANSFORM_RUNTIME = [
  '@babel/plugin-transform-runtime',
  {
    absoluteRuntime: false,
    corejs: false,
    helpers: true,
    regenerator: true,
    useESModules: false,
  },
];

const OBJECT_REST_SPREAD = [
  '@babel/plugin-proposal-object-rest-spread',
  {
    useBuiltIns: true,
  },
];

const REMOVE_COMMENTS = [
  'transform-remove-console',
  {
    exclude: ['error', 'warn'],
  },
];

const NULLISH_COALESCING_OPERATOR = ['@babel/plugin-proposal-nullish-coalescing-operator'];

const STYLED_COMPONENTS = [
  'styled-components',
  {
    ssr: true,
    displayName: true,
    preprocess: false,
  },
];

module.exports = {
  TRANFORM_DESTRUCTING,
  REACT_REMOVE_PROP_TYPES,
  TRANSFORM_RUNTIME,
  OBJECT_REST_SPREAD,
  REMOVE_COMMENTS,
  NULLISH_COALESCING_OPERATOR,
  STYLED_COMPONENTS,
};
