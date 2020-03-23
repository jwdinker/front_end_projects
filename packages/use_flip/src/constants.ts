import { Side, DefaultFlip } from './types';

export const SIDES: Side[] = ['top', 'bottom', 'left', 'right'];

export const DEFAULT_FLIP: DefaultFlip = {
  top: ['bottom', 'left', 'right'],
  left: ['right', 'top', 'bottom'],
  right: ['left', 'top', 'bottom'],
  bottom: ['top', 'left', 'right'],
};

export const SIDE_OPPOSITES = {
  top: 'bottom',
  left: 'right',
  bottom: 'top',
  right: 'left',
};
