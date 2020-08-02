import { getInteractionType, INTERACTION_TYPES } from '@jwdinker/make-get-interaction-type';
import { getMouseCoordinates } from '@jwdinker/mouse-helpers';
import { get1Touch } from '@jwdinker/touch-helpers';
import { SCROLL_TIME_CONSTANT, ONE_SECOND } from './constants';

const { MOUSE, TOUCH } = INTERACTION_TYPES;

export function getCoordinatesByEventType(event) {
  const interaction = getInteractionType(event);
  switch (interaction) {
    case MOUSE: {
      return getMouseCoordinates(event);
    }
    case TOUCH: {
      return get1Touch(event);
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
  return (sliceOfState, point1, point2) => {
    return point1.reduce((accumulator, value1, index) => {
      const value2 = Array.isArray(point2) ? point2[index] : point2;
      accumulator[index] = combineValues(value1, value2, operator);
      return accumulator;
    }, sliceOfState);
  };
}

export const add = makeOperator('+');
export const subtract = makeOperator('-');
export const multiply = makeOperator('*');

export function preventOverflow(sliceOfState, boundaries, coordinates) {
  coordinates.reduce((accumulator, coordinate, index) => {
    const [min, max] = boundaries[index];
    accumulator[index] = Math.max(min, Math.min(coordinate, max));
    return accumulator;
  }, sliceOfState);
}

export function round(xy) {
  return xy.reduce((accumulator, coordinate, index) => {
    accumulator[index] = Math.round(coordinate);
    return accumulator;
  }, xy);
}

export function canThrust(decay, threshold = 0.5) {
  return decay.some((value) => value >= threshold || value <= threshold * -1);
}

export function getDecay(amplitude, elapsed) {
  return amplitude.map((value) => {
    return -value * Math.exp(-elapsed / SCROLL_TIME_CONSTANT);
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

export function hasInertia(velocity) {
  return velocity.some((value) => value > 10 || value < -10);
}
