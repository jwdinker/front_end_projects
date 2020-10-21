import { BlockableAxis, Coordinates } from './types';

export function makeBlockable(blockable: BlockableAxis) {
  const areBothBlocked = blockable === 'xy';
  const isYBlocked = blockable === 'y' || areBothBlocked;
  const isXBlocked = blockable === 'x' || areBothBlocked;

  return (
    scroller: HTMLElement,
    currentCoordinates: Coordinates,
    lastCoordinates: Coordinates
  ): boolean => {
    const directionX = lastCoordinates.x - currentCoordinates.x;
    const directionY = lastCoordinates.y - currentCoordinates.y;

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth } = scroller;

    const atTop = scrollTop <= 0 && directionY <= 0;
    const atLeft = scrollLeft <= 0 && directionX <= 0;
    const atBottom = scrollHeight - scrollTop <= scroller.clientHeight && directionY > 0;
    const atRight = scrollWidth - scrollLeft <= scroller.clientWidth && directionX > 0;

    const atHorizontalEdge = isXBlocked && (atLeft || atRight);
    const atVerticalEdge = isYBlocked && (atTop || atBottom);
    const canBlock = atVerticalEdge || atHorizontalEdge;

    return canBlock;
  };
}

export const getCoordinates = (targetTouches: TouchList): Coordinates => {
  return { x: targetTouches[0].clientX, y: targetTouches[0].clientY };
};
