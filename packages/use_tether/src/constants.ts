import { Alignment, DefaultFlip } from './types';

export const ALIGNMENTS_KEYS = {
  top: ['centerX', 'top'] as const,
  left: ['left', 'centerY'] as const,
  right: ['right', 'centerY'] as const,
  bottom: ['centerX', 'bottom'] as const,
};

export const SIDES: Alignment[] = ['top', 'bottom', 'left', 'right'];

export const ALIGNMENTS_TYPES = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
} as const;

export const ALIGNMENT_OPPOSITE_TYPES = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
} as const;

export const DEFAULT_ANCHOR_MEASUEMENTS = {
  top: 0,
  left: 0,
  height: 0,
  width: 0,
};

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
} as const;

export const ARROW_ROTATIONS = {
  top: 180,
  left: 90,
  right: -90,
  bottom: 0,
} as const;
