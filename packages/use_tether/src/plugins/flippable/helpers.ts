import { AbbreviatedRectangle, Side, Alignment } from '../../types';

export function getOverflowingSides(
  element: AbbreviatedRectangle,
  boundaries: AbbreviatedRectangle
) {
  const overflowing: Side[] = [];

  const isTopOverflow = element.top <= boundaries.top;
  const isBottomOverflow = element.top + element.height >= boundaries.top + boundaries.height;
  const isLeftOverflow = element.left <= boundaries.left;
  const isRightOverflow = element.left + element.width >= boundaries.left + boundaries.width;

  if (isTopOverflow) {
    overflowing.push('top');
  }

  if (isBottomOverflow) {
    overflowing.push('bottom');
  }

  if (isLeftOverflow) {
    overflowing.push('left');
  }

  if (isRightOverflow) {
    overflowing.push('right');
  }
  return overflowing;
}

export function getPerimeterOfElements(
  anchor: AbbreviatedRectangle,
  elements: AbbreviatedRectangle[],
  alignment: Alignment
): AbbreviatedRectangle {
  let totalHeight = 0;
  let totalWidth = 0;
  let maxHeight = 0;
  let maxWidth = 0;

  const isTop = alignment === 'top';
  const isLeft = alignment === 'left';
  const isRight = alignment === 'right';

  for (let i = 0; i < elements.length; i += 1) {
    const { height, width } = elements[i];
    maxHeight = Math.max(maxHeight, height);
    maxWidth = Math.max(maxWidth, width);
    totalHeight += height;
    totalWidth += width;
  }

  const centerX = anchor.left + anchor.width / 2;
  const centerY = anchor.top + anchor.height / 2;

  const halfMaxWidth = maxWidth / 2;
  const halfMaxHeight = maxHeight / 2;

  const { top, left } = anchor;

  if (isTop) {
    return {
      top: top - totalHeight,
      height: totalHeight,
      width: maxWidth,
      left: centerX - halfMaxWidth,
    };
  }

  if (isRight) {
    return {
      top: centerY - halfMaxHeight,
      height: maxHeight,
      left: left + anchor.width,
      width: totalWidth,
    };
  }

  if (isLeft) {
    return {
      top: centerY - halfMaxHeight,
      height: maxHeight,
      left: left - totalWidth,
      width: totalWidth,
    };
  }

  return {
    top: top + anchor.height,
    height: totalHeight,
    width: maxWidth,
    left: centerX - halfMaxWidth,
  };
}
