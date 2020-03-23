import { Side } from './types';

export const SIDES: Side[] = ['top', 'bottom', 'left', 'right'];

export const PROP_KEYS = ['top', 'left', 'height', 'width'];

export const SIDE_OPPOSITES = {
  top: 'bottom',
  left: 'right',
  bottom: 'top',
  right: 'left',
};
