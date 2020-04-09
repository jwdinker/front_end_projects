import useEventListener from '@jwdinker/use-event-listener';
import useSSR from '@jwdinker/use-ssr';
import { useMemo, useCallback } from 'react';
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

import { UseScaleOptions, UseScaleReturn, Scale } from './types';

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
  const options = useMemo(() => {
    const { height, width, top, left } = offsets;
    return { initialScale, max, min, height, width, top, left };
  }, [initialScale, max, min, offsets]);

  const [_scale, set] = useScalable(options);

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
            activate();
            set.start(point, center);
          }

          if (isMove(event.type, isScaling)) {
            set.move(point, center);
          }
        }

        if (isEnd(event.type, isScaling)) {
          deactivate();
          set.end();
        }
      }
    },
    [activate, deactivate, element, getCoordinates, getInteractionType, isScaling, set]
  );

  useEventListener(
    useMemo(
      () => ({
        target: element,
        type: 'mousedown',
        handler,
        consolidate: true,
      }),
      [element, handler]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target: isBrowser && mouse ? window : null,
        type: 'mousemove mouseup',
        handler,
        consolidate: true,
      }),
      [handler, isBrowser, mouse]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target: touch > 0 ? element : null,
        type: 'touchstart touchmove touchend touchcancel',
        handler,
        consolidate: true,
      }),
      [element, handler, touch]
    )
  );

  const value = useMemo((): UseScaleReturn => ({ ..._scale, isScaling, scale }), [
    _scale,
    isScaling,
    scale,
  ]);

  return value;
}

export default useScale;
