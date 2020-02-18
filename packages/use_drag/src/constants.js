export const EVENT_ABSTRACTION_NAMES = ['start', 'move', 'end'];

export const GROUPED_EVENT_TYPES = [
  ['touchstart', 'mousedown'],
  ['touchmove', 'mousemove'],
  ['touchend', 'mouseup'],
];

export const EVENT_NAMES_BY_OPTION = {
  ALL: ['touchstart mousedown', 'touchmove touchend mousemove mouseup'],
  TOUCH: ['touchstart', 'touchmove touchend'],
  MOUSE: ['mousedown', 'mousemove mouseup'],
};
