import { BlockableAxis, Coordinates } from './types';

export function makeBlockable(blockable: BlockableAxis) {
  const areBothBlocked = blockable === 'xy';
  const isYBlocked = blockable === 'y' || areBothBlocked;
  const isXBlocked = blockable === 'x' || areBothBlocked;

  return (target: HTMLElement, targetTouches: TouchList, coordinates: Coordinates): boolean => {
    const x = targetTouches[0].clientX - coordinates.x;
    const y = targetTouches[0].clientY - coordinates.y;

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth } = target;

    const atTop = scrollTop === 0 && y > 0;
    const atLeft = scrollLeft === 0 && x > 0;
    const atBottom = scrollHeight - scrollTop <= target.clientHeight && y < 0;
    const atRight = scrollWidth - scrollLeft <= target.clientWidth && x < 0;

    const atHorizontalEdge = isXBlocked && (atLeft || atRight);
    const atVerticalEdge = isYBlocked && (atTop || atBottom);
    const canBlock = atVerticalEdge || atHorizontalEdge;

    return canBlock;
  };
}
