import React from 'react';
import PropTypes from 'prop-types';
import Annotation from './annotation';

function CustomAnnotation({ render, ...props }) {
  return <Annotation {...props} type="custom" custom={render} />;
}

CustomAnnotation.propTypes = {
  render: PropTypes.func.isRequired,
};
export default CustomAnnotation;
