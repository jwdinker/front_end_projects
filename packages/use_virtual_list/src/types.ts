import { IndexRange, ItemSize, OnMeasure } from '@jwdinker/use-measurements-indexer';

import { SCROLL_TO_ALIGNMENTS } from './constants';

export type Axis = 'x' | 'y';

export type UnitType = '%' | 'px';

export interface VirtualListProps {
  component: React.ElementType;
  numberOfItems: number;
  containerSize: number;
  direction: number;
  offset: number;
  responsive?: boolean;
  bufferSize?: number;
  axis?: Axis;
  itemSize: ItemSize;
  estimatedItemSize?: number;
  bufferByDirection?: number;
  onMeasure?: OnMeasure;
}

export type ScrollToAlignment = typeof SCROLL_TO_ALIGNMENTS[keyof typeof SCROLL_TO_ALIGNMENTS];

export interface ScrollItemProps {
  index: number;
  key: number;
  style: React.CSSProperties;
  data?: object;
}

export interface Indexes {
  rendered: IndexRange;
  visible: IndexRange;
}

export interface ScrollOffsetForAlignmentProps {
  alignment: ScrollToAlignment;
  containerSize: number;
  totalSizeOfItems: number;
  offsetOfItem: number;
  sizeOfItem: number;
}
