import { SHARED_STYLES } from './constants';

function formatStyles(offsets) {
  const { popover, triangle } = offsets;

  return {
    popover: {
      ...SHARED_STYLES,
      transform: {
        translateX: popover.left,
        translateY: popover.top,
      },
    },
    triangle: {
      ...SHARED_STYLES,
      transform: {
        translateX: triangle.left,
        translateY: triangle.top,
        rotate: triangle.rotate,
      },
    },
  };
}

export default formatStyles;
