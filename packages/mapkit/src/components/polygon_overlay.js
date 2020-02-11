import React from 'react';
import PropTypes from 'prop-types';
import Overlay from './overlay';

function PolygonOverlay(props) {
  return <Overlay {...props} type="polygon" />;
}
PolygonOverlay.defaultProps = {
  points: PropTypes.array.isRequired,
};

export default PolygonOverlay;
