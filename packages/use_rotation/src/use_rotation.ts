import useRotatable from '@jwdinker/use-rotatable';
import useOffsets from '@jwdinker/use-offsets';
import useDragListener from '@jwdinker/use-drag-listener';
import getMouseCoordinates from '@jwdinker/get-mouse-coordinates';
import { UseRotation } from './types';
import { getTouchRotation, makeCenterPoint } from './helpers';

/**
 *
 * @param element The react reference to an HTMLElement used as the rotatable element.
 * @param options Configuration options for the rotation.
 * @param options.initialAngle The initial angle of the rotation.
 * @param options.mouse Boolean indicating rotation can be triggered by the mouse.
 * @param options.touch A number indicating the amount of touches before the rotation is recognized.
 */

const useRotation: UseRotation = (element, options) => {
  const { initialAngle = 0, mouse = false, touch = 2 } = options;
  // useOffsets is used to make the center point
  const [offsets] = useOffsets(element);

  const [rotation, { start, move, end, rotateTo }] = useRotatable(initialAngle);

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
      const [point, center] = getTouchRotation(event, touch, offsets);
      start(point, center);
    },
    onTouchMove: (event) => {
      const [point, center] = getTouchRotation(event, touch, offsets);
      move(point, center);
    },
    onTouchEnd: (event, disableMove) => {
      disableMove();
      end();
    },
    mouse,
    touch: touch > 0,
  });

  return [rotation, rotateTo];
};

export default useRotation;
