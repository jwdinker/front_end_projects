import React from 'react';
import PropTypes from 'prop-types';
import Overlay from './overlay';

function CircleOverlay(props) {
  return <Overlay {...props} type="circle" />;
}
CircleOverlay.defaultProps = {
  coordinates: PropTypes.array.isRequired,
  radius: PropTypes.number.isRequired,
};

export default CircleOverlay;
