/* eslint-disable import/prefer-default-export */

import { Side, SideOptions } from './types';

export function reduceSides<T>(
  fn: (side: Side) => T
): {
  top: T;
  bottom: T;
  left: T;
  right: T;
} {
  return {
    top: fn('top'),
    bottom: fn('bottom'),
    left: fn('left'),
    right: fn('right'),
  };
}
