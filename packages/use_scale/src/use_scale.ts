import useEventListener from '@jwdinker/use-event-listener';
import useSSR from '@jwdinker/use-ssr';
import { useMemo, useCallback, useEffect } from 'react';
import useToggle from '@jwdinker/use-toggle';
import useScalable, { DEFAULTS, Point } from '@jwdinker/use-scalable';
import getElementOrReference, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import makeGetInteractionType, {
  INTERACTION_TYPES,
  InteractionEvent,
  InteractionType,
} from '@jwdinker/make-get-interaction-type';
import useOffsets from '@jwdinker/use-offsets';
import { get1Touch, get2Touches } from '@jwdinker/touch-helpers';
import { getMouseCoordinates } from '@jwdinker/mouse-helpers';
import { isStart, isMove, isEnd } from '@jwdinker/phase-helpers';

import { unstable_batchedUpdates as batch } from 'react-dom';
import { UseScaleOptions, UseScaleReturn, Scale } from './types';

const TOUCH_EVENTS = 'touchstart touchmove touchend touchcancel';
const MOUSE_DOWN = 'mousedown';
const WINDOW_MOUSE_EVENTS = 'mousemove mouseup';
const { MOUSE, TOUCH, TOUCHES } = INTERACTION_TYPES;
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
function useScale(
  element: ElementOrReference,
  {
    initialScale = DEFAULTS.INITIAL_SCALE,
    min = DEFAULTS.MIN_SCALE,
    max = DEFAULTS.MAX_SCALE,
    mouse = false,
    touch = 2,
  }: UseScaleOptions = {}
): UseScaleReturn {
  const { isBrowser } = useSSR();
  const [isScaling, { activate, deactivate }] = useToggle();
  const [offsets] = useOffsets(element);
  const getInteractionType = useMemo(() => makeGetInteractionType(mouse, touch), [mouse, touch]);
  const scaleOptions = useMemo(() => {
    const { height, width, top, left } = offsets;
    return { initialScale, max, min, height, width, top, left };
  }, [initialScale, max, min, offsets]);

  const [_scale, set] = useScalable(scaleOptions);

  const scale = useCallback<Scale>(
    (point, center) => {
      set.move(point, center);
    },
    [set]
  );

  const getCoordinates = useCallback((type: InteractionType, event: InteractionEvent): Point[] => {
    switch (type) {
      case MOUSE: {
        return [getMouseCoordinates(event as MouseEvent)];
      }
      case TOUCH: {
        return [get1Touch(event as TouchEvent)];
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
  }, []);

  const handler = useCallback(
    (event) => {
      const _element = getElementOrReference(element);
      if (_element) {
        const interactionType = getInteractionType(event);
        const isInteracting = interactionType !== INTERACTION_TYPES.NONE;

        if (isInteracting) {
          const [point, center] = getCoordinates(interactionType, event);

          if (isStart(event.type, !isScaling)) {
            batch(() => {
              activate();
              set.start(point, center);
            });
          }

          if (isMove(event.type, isScaling)) {
            set.move(point, center);
          }
        }

        if (isEnd(event.type, isScaling)) {
          batch(() => {
            deactivate();
            set.end();
          });
        }
      }
    },
    [activate, deactivate, element, getCoordinates, getInteractionType, isScaling, set]
  );

  const options = useMemo(() => {
    return { consolidate: true };
  }, []);

  const downable = useEventListener(element, MOUSE_DOWN, handler, options);

  const moveable = useEventListener(
    isBrowser ? window : null,
    WINDOW_MOUSE_EVENTS,
    handler,
    options
  );
  const touchable = useEventListener(element, TOUCH_EVENTS, handler, options);

  useEffect(() => {
    if (mouse) {
      downable.attach();
      moveable.attach();
      return (): void => {
        downable.detach();
        moveable.detach();
      };
    }
  }, [downable, mouse, moveable]);

  useEffect(() => {
    if (touch > 0) {
      touchable.attach();
      return touchable.detach;
    }
  }, [touch, touchable]);

  return {
    ..._scale,
    isScaling,
    scale,
  };
}

export default useScale;
