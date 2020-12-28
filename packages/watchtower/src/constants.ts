import { INITIAL_STATE as INITIAL_SCROLL_STATE } from '@jwdinker/use-scroll';
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
    scroll: INITIAL_SCROLL_STATE,
  },
  false,
];
