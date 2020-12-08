import { SCROLL_TO_ALIGNMENTS } from './constants';
import { ScrollOffsetForAlignmentProps } from './types';

export function areEqual(previous: any, current: any) {
  return previous.style === current.style && previous.index === current.index;
}

export function getScrollOffsetForAlignment(props: ScrollOffsetForAlignmentProps): number {
  const { alignment, containerSize, totalSizeOfItems, offsetOfItem, sizeOfItem } = props;
  const minimum = Math.max(0, Math.min(totalSizeOfItems - containerSize, offsetOfItem));
  const maximum = Math.max(0, offsetOfItem - containerSize + sizeOfItem);

  switch (alignment) {
    case SCROLL_TO_ALIGNMENTS.END: {
      return minimum;
    }
    case SCROLL_TO_ALIGNMENTS.CENTER: {
      return Math.round(minimum + (maximum - minimum) / 2);
    }
    case SCROLL_TO_ALIGNMENTS.START:
    default: {
      return maximum;
    }
  }
}

export function convertPctToPx(value: number, containerSize: number): number {
  return (value / 100) * containerSize;
}
