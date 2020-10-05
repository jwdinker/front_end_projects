import { ScrollState } from '@jwdinker/use-scroll';
import { WindowRectangle } from '@jwdinker/use-window-size';
import { Boundaries } from './types';

export function mergeViewportScrollWithWindowRect(
  values: WindowRectangle,
  scroll: ScrollState
): Boundaries {
  const { height, width } = values;
  const top = values.top + scroll.y;
  const left = values.left + scroll.x;
  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
  };
}
