import React from 'react';
import PropTypes from 'prop-types';
import Overlay from './overlay';

function PolylineOverlay(props) {
  return <Overlay {...props} type="polyline" />;
}
PolylineOverlay.defaultProps = {
  points: PropTypes.array.isRequired,
};

export default PolylineOverlay;
