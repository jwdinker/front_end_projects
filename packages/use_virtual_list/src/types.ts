import { IndexRange, ItemSize, OnMeasure } from '@jwdinker/use-measurements-indexer';

import { ScrollToAnimationProps } from '@jwdinker/use-scroll';
import { SCROLL_TO_ALIGNMENTS } from './constants';

export type Axis = 'x' | 'y';

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
  onMeasure?: OnMeasure;
}

export type ScrollToAlignment = typeof SCROLL_TO_ALIGNMENTS[keyof typeof SCROLL_TO_ALIGNMENTS];

export interface ScrollToIndexOptions extends ScrollToAnimationProps {
  alignment?: ScrollToAlignment;
}

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
