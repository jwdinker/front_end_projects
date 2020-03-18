import { AlignmentTypes, AlignmentOppositeTypes, Alignment } from './types';

export const ALIGNMENTS_KEYS = {
  top: ['centerX', 'top'] as const,
  left: ['left', 'centerY'] as const,
  right: ['right', 'centerY'] as const,
  bottom: ['centerX', 'bottom'] as const,
};

export const SIDES: Alignment[] = ['top', 'bottom', 'left', 'right'];

export const ALIGNMENTS_TYPES: AlignmentTypes = {
  top: 'top',
  bottom: 'bottom',
  left: 'left',
  right: 'right',
};

export const ALIGNMENT_OPPOSITE_TYPES: AlignmentOppositeTypes = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

export const DEFAULT_ANCHOR_MEASUEMENTS = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: 0,
  width: 0,
};
