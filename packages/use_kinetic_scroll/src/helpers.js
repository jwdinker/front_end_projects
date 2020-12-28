import {
  getInteractionType as _getInteractionType,
  INTERACTION_TYPES,
} from '@jwdinker/make-get-interaction-type';
import { getMouseCoordinates } from '@jwdinker/mouse-helpers';
import { get1Touch } from '@jwdinker/touch-helpers';
import upTo from '@jwdinker/up-to';

import { SCROLL_TIME_CONSTANT, ONE_SECOND, DEVICE_PIXEL_RATIO, FRAME_RATE } from './constants';

const { MOUSE, TOUCH, WHEEL, DORMANT } = INTERACTION_TYPES;

export function getInteractionType(event) {
  const type = _getInteractionType(event);
  if (type === TOUCH || type === MOUSE || type === WHEEL) {
    return type;
  }
  return DORMANT;
}

export function getCoordinatesByEventType(event) {
  const interaction = getInteractionType(event);
  switch (interaction) {
    case MOUSE: {
      return getMouseCoordinates(event, 'client');
    }
    case TOUCH: {
      return get1Touch(event, 'client');
    }
    default: {
      return [0, 0];
    }
  }
}

export function makeCoordinatesGetter(axis = 'y') {
  return (event, coord) => {
    const coordinates = getCoordinatesByEventType(event, coord);
    if (axis === 'y') {
      coordinates[0] = 0;
    }
    if (axis === 'x') {
      coordinates[1] = 0;
    }
    return coordinates;
  };
}

export function combineValues(v1, v2, operator = '+') {
  switch (operator) {
    case '*': {
      return v1 * v2;
    }
    case '-': {
      return v1 - v2;
    }
    case '/': {
      return v1 / v2;
    }
    default: {
      return v1 + v2;
    }
  }
}

export function makeOperator(operator = '+') {
  return (value1, value2) => {
    return value1.map((v1, index) => {
      const v2 = Array.isArray(value2) ? value2[index] : value2;
      return combineValues(v1, v2, operator);
    });
  };
}

export const add = makeOperator('+');
export const subtract = makeOperator('-');
export const multiply = makeOperator('*');
export const divide = makeOperator('/');

export function preventOverflow(sliceOfState, boundaries, coordinates) {
  coordinates.reduce((accumulator, coordinate, index) => {
    const [min, max] = boundaries[index];
    accumulator[index] = Math.max(min, Math.min(coordinate, max));
    return accumulator;
  }, sliceOfState);
}

export function canThrust(decay, threshold = 1) {
  return decay.some((value) => Math.abs(value) >= threshold);
}

export function getDecay(amplitude, elapsed) {
  return amplitude.map((value) => {
    const result = -value * Math.exp(-elapsed / SCROLL_TIME_CONSTANT);
    return result;
  });
}

export function getBoundaries(element) {
  return [
    [0, element.offsetWidth - element.parentNode.offsetWidth],
    [0, element.offsetHeight - element.parentNode.offsetHeight],
  ];
}

export function wouldOverflow(boundaries, coordinates, direction) {
  return coordinates.some((coordinate, index) => {
    const [min, max] = boundaries[index];
    return (
      (coordinate <= min && direction[index] === -1) ||
      (coordinate >= max && direction[index] === 1)
    );
  });
}

export function isOverflowing(boundaries, coordinates) {
  return coordinates.some((coordinate, index) => {
    const [min, max] = boundaries[index];
    return coordinate < min && coordinate > max;
  });
}

export function hasMetThreshold(values, threshold = 10) {
  return values.some((value) => value !== 0 && (value > threshold || value < threshold * -1));
}

/*
The velocity of an object is the rate at which it moves from one position to
another. The average velocity is the difference between the starting and ending
positions, divided by the difference between the starting and ending times.
Velocity has a magnitude (a value) and a direction.
*/

export const getVelocity = (velocity, delta, elapsed) => {
  return velocity.map((previousVelocity, index) => {
    const currentVelocity = (ONE_SECOND * delta[index]) / Math.max(16.7, elapsed); // 1 + elapsed to avoid dividing by zero

    return 0.8 * currentVelocity + 0.2 * previousVelocity;
  });
};

export function updateHistory(_history, timestamp, coordinates) {
  const history = _history;
  if (history.length >= 5) {
    history.shift();
  }
  history.push([timestamp, coordinates]);
  return history;
}

export function getPointerVelocity(_history) {
  const history = _history;
  const lastIndex = history.length - 1;
  const latestPoint = history[lastIndex];
  let oldestPoint = history[0];

  for (let i; i < history.length; i += 1) {
    const point = history[i];
    if (latestPoint[0] - point[0] < FRAME_RATE) {
      break;
    }
    oldestPoint = point;
  }
  const duration = latestPoint[0] - oldestPoint[0];
  return upTo(0, 1, (index) => {
    const distance = latestPoint[1][index] - oldestPoint[1][index];
    return (-1000 * distance) / Math.max(duration, FRAME_RATE);
  });
}
