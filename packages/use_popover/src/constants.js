export const FLIP = {
  top: 'bottom',
  top_left: 'bottom_right',
  top_right: 'bottom_left',
  left: 'right',
  bottom: 'top',
  bottom_left: 'top_right',
  bottom_right: 'top_left',
  right: 'left',
};

export const SIDES = ['top', 'bottom', 'left', 'right'];

export const FLIP_DEFAULTS = {
  top: ['bottom'],
  bottom: ['top'],
  left: ['right'],
  right: ['left'],
};

export const OPPOSITES = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

export const INITIAL_DIMENSIONS = {
  height: 0,
  width: 0,
};

export const TRIANGLE_ROTATIONS = {
  top: 180,
  left: 90,
  right: -90,
  bottom: 0,
};

export const SHARED_STYLES = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'visible',
};

export const DEFAULT_STYLES = {
  POPOVER: {
    ...SHARED_STYLES,
    transform: 'translate3d(0px,0px,0)',
  },
  TRIANGLE: {
    ...SHARED_STYLES,
    transform: 'translate3d(0px,0px,0) rotate(0deg)',
  },
};

export const ELEMENT_TYPES = ['popover', 'triangle'];

export const STYLE_KEYS = ['position', 'top', 'left', 'visibility'];

