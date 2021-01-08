import useScalable, { DEFAULTS } from '@jwdinker/use-scalable';
import useOffsets from '@jwdinker/use-offsets';
import useDragListener from '@jwdinker/use-drag-listener';
import getMouseCoordinates from '@jwdinker/get-mouse-coordinates';
import { UseScale } from './types';
import { makeCenterPoint, getTouchScale } from './helpers';

/**
 *
 * @param element The react ref or an HTMLElement used as the scalable element.
 * @param options Configuration options for the scale.
 * @param options.initialScale - Initial x,y,z of the scale.
 * @param options.min - Minimum scale for the x,y,z axis.
 * @param options.max - Maximum scale for the x,y,z axis.
 * @param options.mouse Boolean indicating scale can be triggered by the mouse.
 * @param options.touch A number indicating the amount of touches before the scale is recognized.
 */
const useScale: UseScale = (
  element,
  {
    initialScale = DEFAULTS.INITIAL_SCALE,
    min = DEFAULTS.MIN_SCALE,
    max = DEFAULTS.MAX_SCALE,
    mouse = false,
    touch = 2,
  } = {}
) => {
  const [offsets] = useOffsets(element);

  const options = {
    initialScale,
    max,
    min,
  };

  const [state, { start, move, end, scaleTo }] = useScalable(options);

  useDragListener(element, {
    onMouseDown: (event, enableMove) => {
      enableMove();
      start(getMouseCoordinates(event), makeCenterPoint(offsets));
    },
    onMouseMove: (event) => {
      move(getMouseCoordinates(event), makeCenterPoint(offsets));
    },
    onMouseUp: (event, disableMove) => {
      disableMove();
      end();
    },
    onTouchStart: (event, enableMove) => {
      enableMove();
      const [point, center] = getTouchScale(event, touch, offsets);
      start(point, center);
    },
    onTouchMove: (event) => {
      const [point, center] = getTouchScale(event, touch, offsets);
      move(point, center);
    },
    onTouchEnd: (event, disableMove) => {
      disableMove();
      end();
    },
    mouse,
    touch: touch > 0,
  });

  return [state, scaleTo];
};

export default useScale;
