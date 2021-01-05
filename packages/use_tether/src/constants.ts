import { At } from './types';

export const ALIGNMENTS_KEYS = {
  top: ['centerX', 'top'] as const,
  left: ['left', 'centerY'] as const,
  right: ['right', 'centerY'] as const,
  bottom: ['centerX', 'bottom'] as const,
};

export const SIDES = ['top', 'bottom', 'left', 'right'] as const;

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

export const BOUNDARY_FLIP_ALTERNATIVES: At = {
  top: ['bottom'],
  bottom: ['top'],
  left: ['right'],
  right: ['left'],
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

export const PREVENT_OVERFLOW_BEHAVIOR = {
  STACK: 'stack',
  COLLAPSE: 'collapse',
} as const;
