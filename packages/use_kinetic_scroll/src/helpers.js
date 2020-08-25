import { getInteractionType, INTERACTION_TYPES } from '@jwdinker/make-get-interaction-type';
import { getMouseCoordinates } from '@jwdinker/mouse-helpers';
import { get1Touch } from '@jwdinker/touch-helpers';
import { Dispatch, Store } from '@jwdinker/use-reducer-with-middleware';
import { SCROLL_TIME_CONSTANT, ONE_SECOND } from './constants';

const { MOUSE, TOUCH } = INTERACTION_TYPES;

export function getCoordinatesByEventType(event) {
  const interaction = getInteractionType(event);
  switch (interaction) {
    case MOUSE: {
      return getMouseCoordinates(event, 'page');
    }
    case TOUCH: {
      return get1Touch(event, 'page');
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

export function hasMomentum(velocity) {
  return velocity.some((value) => value !== 0 && (value > 10 || value < -10));
}

export const getVelocity = (velocity, delta, elapsed) => {
  return velocity.map((previous, index) => {
    const currentVelocity = (1000 * delta[index]) / (1 + elapsed); // 1 + elapsed to avoid dividing by zero
    return 0.8 * currentVelocity + 0.2 * previous;
  });
};

export const getDeltaFromWheel = (event) => {
  return [event.deltaX, event.deltaY];
};
