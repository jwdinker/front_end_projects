import { WatchTowerContext } from './types';

export const INITIAL_MEASUREMENTS = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: 0,
  width: 0,
};

export const INITIAL_CONTEXT: WatchTowerContext = [
  {
    container: INITIAL_MEASUREMENTS,
    scroll: {
      isScrolling: false,
      x: 0,
      y: 0,
      direction: 0,
      phase: 'none',
    },
  },
  false,
];
