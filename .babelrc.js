const {
  TRANSFORM_RUNTIME,
  TRANFORM_DESTRUCTING,
  OBJECT_REST_SPREAD,
  REMOVE_COMMENTS,
  NULLISH_COALESCING_OPERATOR,
} = require('./babel/plugins');
const { BABEL_PRESET_ENV, REACT_PRESET_ENV } = require('./babel/presets');

module.exports = {
  env: {
    production: {
      presets: [BABEL_PRESET_ENV, REACT_PRESET_ENV],
      plugins: [
        TRANSFORM_RUNTIME,
        TRANFORM_DESTRUCTING,
        OBJECT_REST_SPREAD,
        // REMOVE_COMMENTS,
        NULLISH_COALESCING_OPERATOR,
      ],
      // comments: false,
    },
    development: {
      presets: [BABEL_PRESET_ENV, REACT_PRESET_ENV],
      plugins: [
        TRANSFORM_RUNTIME,
        TRANFORM_DESTRUCTING,
        OBJECT_REST_SPREAD,
        // REMOVE_COMMENTS,
        NULLISH_COALESCING_OPERATOR,
      ],
    },
  },
};
