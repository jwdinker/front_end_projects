import { IndexRange, ItemSize, OnMeasure } from '@jwdinker/use-measurements-indexer';
import { CSSProperties, ComponentClass } from 'react';
import { ScrollToAnimationProps } from '@jwdinker/use-scroll';
import { SCROLL_TO_ALIGNMENTS } from './constants';

export type Axis = 'x' | 'y';

export interface VirtualListProps {
  component: ComponentClass;
  numberOfItems: number;
  containerSize: number;
  responsive?: boolean;
  buffer?: number;
  axis?: Axis;
  itemSize: ItemSize;
  estimatedItemSize?: number;
  onMeasure?: OnMeasure;
}

export interface ContainerAndContentStyles {
  container: CSSProperties;
  contents: CSSProperties;
}

export type ScrollToAlignment = typeof SCROLL_TO_ALIGNMENTS[keyof typeof SCROLL_TO_ALIGNMENTS];

export interface ScrollToIndexOptions extends ScrollToAnimationProps {
  alignment?: ScrollToAlignment;
}

export interface ScrollItemProps {
  index: number;
  key: number;
  style: CSSProperties;
  isScrolling: boolean;
  isVisible: boolean;
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