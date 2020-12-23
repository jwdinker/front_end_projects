import * as React from 'react';

export const CONFIGURATIONS = {
  y: {
    scroll: 'y',
    oppositeAxis: 'x',
    dimension: 'height',
    oppositeDimension: 'width',
    offset: 'top',
    max: 'maxHeight',
    min: 'minHeight',
  },
  x: {
    scroll: 'x',
    oppositeAxis: 'y',
    dimension: 'width',
    oppositeDimension: 'height',
    offset: 'left',
    max: 'maxWidth',
    min: 'minWidth',
  },
} as const;

export const CONTAINER_BASE_STYLE: React.CSSProperties = {
  position: 'relative',
  overflow: 'scroll',
  willChange: 'transform',
  WebkitOverflowScrolling: 'touch',
  boxSizing: 'border-box',
};

export const SPACER_BASE_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  boxSizing: 'border-box',
  zIndex: -1,
};

export const SCROLL_TO_ALIGNMENTS = {
  START: 'start',
  CENTER: 'center',
  END: 'end',
} as const;

export const DEFAULT_INDEXES = [0, 0];
