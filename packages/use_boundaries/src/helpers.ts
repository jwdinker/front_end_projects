import { SimpleScrollState } from '@jwdinker/use-scroll';
import { WindowRectangle } from '@jwdinker/use-window-size';
import { Boundaries } from './types';

export function mergeViewportScrollWithWindowRect(
  values: WindowRectangle,
  scroll: SimpleScrollState
): Boundaries {
  const { height, width } = values;
  const top = values.top + scroll.top;
  const left = values.left + scroll.left;
  return {
    top,
    left,
    right: left + width,
    bottom: top + height,
  };
}
