import useEventListener from '@jwdinker/use-event-listener';
import useSSR from '@jwdinker/use-ssr';
import { useMemo, useCallback, useEffect } from 'react';
import useToggle from '@jwdinker/use-toggle';
import useRotatable, { Point } from '@jwdinker/use-rotatable';
import getElementOrReference, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import makeGetInteractionType, {
  INTERACTION_TYPES,
  InteractionType,
  InteractionEvent,
} from '@jwdinker/make-get-interaction-type';
import { unstable_batchedUpdates as batch } from 'react-dom';

import useOffsets, { Offsets } from '@jwdinker/use-offsets';

import { getMouseCoordinates } from '@jwdinker/mouse-helpers';
import { get1Touch, get2Touches } from '@jwdinker/touch-helpers';
import { isStart, isMove, isEnd } from '@jwdinker/phase-helpers';

import { UseRotationOptions, UseRotationReturn, Rotate } from './types';

function makeCenterPoint(offsets: Offsets): Point {
  const y = offsets.top + offsets.height / 2;
  const x = offsets.left + offsets.width / 2;
  return [x, y];
}

const { MOUSE, TOUCH, TOUCHES } = INTERACTION_TYPES;

const MOUSE_EVENTS = 'mousedown mouseup mousemove';
const TOUCH_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 *
 * @param element The react ref or an HTMLElement used as the rotatable element.
 * @param options Configuration options for the rotation.
 * @param options.initialAngle The initial angle of the rotation.
 * @param options.mouse Boolean indicating rotation can be triggered by the mouse.
 * @param options.touch A number indicating the amount of touches before the rotation is recognized.
 */
function useRotation(
  element: ElementOrReference,
  { initialAngle = 0, mouse = false, touch = 2 }: UseRotationOptions = {}
): UseRotationReturn {
  const { isBrowser } = useSSR();
  const [active, { activate, deactivate }] = useToggle();
  const rotationOptions = useMemo(() => ({ initialAngle }), [initialAngle]);

  // useOffsets is used to make the center point
  const [offsets] = useOffsets(element);
  const getInteractionType = makeGetInteractionType(mouse, touch);

  const [rotation, set] = useRotatable(rotationOptions);

  const rotate = useCallback<Rotate>(
    (point, center) => {
      set.move(point, center);
    },
    [set]
  );

  const getCoordinates = useCallback(
    (type: InteractionType, event: InteractionEvent): Point[] => {
      switch (type) {
        case MOUSE: {
          return [getMouseCoordinates(event as MouseEvent), makeCenterPoint(offsets)];
        }
        case TOUCH: {
          return [get1Touch(event as TouchEvent), makeCenterPoint(offsets)];
        }
        case TOUCHES: {
          return get2Touches(event as TouchEvent);
        }
        default: {
          return [
            [0, 0],
            [0, 0],
          ];
        }
      }
    },
    [offsets]
  );

  const handler = useCallback(
    (event) => {
      const _element = getElementOrReference(element);
      if (_element) {
        const interactionType = getInteractionType(event);
        const isInteracting = interactionType !== INTERACTION_TYPES.NONE;

        if (isInteracting) {
          const [point, center] = getCoordinates(interactionType, event);

          // active is used to prevent mousemove overriding mouseup
          if (isStart(event.type, !active)) {
            batch(() => {
              activate();
              set.start(point, center);
            });
          }

          if (isMove(event.type, active)) {
            set.move(point, center);
          }
        }

        if (isEnd(event.type, active)) {
          batch(() => {
            deactivate();
            set.end();
          });
        }
      }
    },
    [activate, active, deactivate, element, getCoordinates, getInteractionType, set]
  );

  const options = useMemo(() => {
    return { consolidate: true };
  }, []);

  const mouseable = useEventListener(isBrowser ? window : null, MOUSE_EVENTS, handler, options);
  const touchable = useEventListener(element, TOUCH_EVENTS, handler, options);

  useEffect(() => {
    if (mouse) {
      mouseable.attach();
      return mouseable.detach;
    }
  }, [mouse, mouseable]);

  useEffect(() => {
    if (touch > 0) {
      touchable.attach();
      return touchable.detach;
    }
  }, [touch, touchable]);

  const { direction, angle, radians } = rotation;

  const value = useMemo((): UseRotationReturn => ({ active, direction, angle, radians, rotate }), [
    active,
    angle,
    direction,
    radians,
    rotate,
  ]);

  return value;
}

export default useRotation;
