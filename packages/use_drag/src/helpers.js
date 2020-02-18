const EVENT_ABSTRACTION_NAMES = ['start', 'move', 'end'];

const GROUPED_EVENT_TYPES = [
  ['touchstart', 'mousedown'],
  ['touchmove', 'mousemove'],
  ['touchend', 'mouseup'],
];

const EVENT_NAMES_BY_OPTION = {
  ALL: ['touchstart mousedown', 'touchmove touchend mousemove mouseup'],
  TOUCH: ['touchstart', 'touchmove touchend'],
  MOUSE: ['mousedown', 'mousemove mouseup'],
};

const makeEventType = (eventTypes) => (eventType) => eventTypes.some((type) => type === eventType);

export const is = EVENT_ABSTRACTION_NAMES.reduce((accumulator, name, index) => {
  return {
    ...accumulator,
    [name]: makeEventType(GROUPED_EVENT_TYPES[index]),
  };
}, {});

export const getEventNames = (mouse, touch) => {
  const isBoth = mouse && touch;
  if (isBoth) {
    return EVENT_NAMES_BY_OPTION.ALL;
  }
  if (touch) {
    return EVENT_NAMES_BY_OPTION.TOUCH;
  }
  return EVENT_NAMES_BY_OPTION.MOUSE;
};

export const getPageCoordinates = (event) => {
  const { pageX, pageY } = event.changedTouches ? event.changedTouches[0] : event;
  return [pageX, pageY];
};

export const getDistance = (point1, point2) => {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  const xDifference = (x2 - x1, 2) ** 2;
  const yDifference = (y2 - y1, 2) ** 2;
  return Math.sqrt(xDifference + yDifference);
};
