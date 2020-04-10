// react
import { useCallback, useMemo } from 'react';

// core
import useEventListener from '@jwdinker/use-event-listener';
import useCoordinates from '@jwdinker/use-coordinates';
import useToggle from '@jwdinker/use-toggle';

// helpers
import { get1Touch } from '@jwdinker/touch-helpers';
import getElement, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import makeGetInteractionType, { INTERACTION_TYPES } from '@jwdinker/make-get-interaction-type';
import { isStart, isMove, isEnd, getPhase } from '@jwdinker/phase-helpers';
import { getMouseCoordinates } from '@jwdinker/mouse-helpers';
import useVelocity from '@jwdinker/use-velocity';
import { UseDragOptions, UseDragReturn } from './types';

const { MOUSE, TOUCH } = INTERACTION_TYPES;

function useDrag(
  element: ElementOrReference = null,
  { mouse = true, touch = 1, initial = [0, 0] }: UseDragOptions = {}
): UseDragReturn {
  const [isDragging, { activate, deactivate }] = useToggle();

  const [{ velocity, duration }, setVelocity] = useVelocity();
  const [coordinates, setCoordinate] = useCoordinates(initial);

  const { origin, move, distance, current, direction } = coordinates;

  const getInteractionType = useMemo(() => makeGetInteractionType(mouse, touch), [mouse, touch]);

  const handler = useCallback(
    (event) => {
      const _element = getElement(element);
      if (_element) {
        const interactionType = getInteractionType(event);
        const [x, y] =
          interactionType === MOUSE
            ? getMouseCoordinates(event as MouseEvent)
            : interactionType === TOUCH
            ? get1Touch(event as TouchEvent)
            : [0, 0];

        const phase = getPhase(event.type);

        if (isStart(event.type)) {
          activate();
          setVelocity[phase](x, y);
          setCoordinate[phase](x, y);
        }
        if (isMove(event.type)) {
          setVelocity[phase](x, y);
          setCoordinate[phase](x, y);
        }
        if (isEnd(event.type)) {
          deactivate();
          setCoordinate[phase](x, y);
        }
      }
    },
    [activate, deactivate, element, getInteractionType, setCoordinate, setVelocity]
  );

  useEventListener(
    useMemo(
      () => ({
        target: mouse && element ? element : null,
        type: 'mousedown',
        handler,
        consolidate: true,
      }),
      [element, handler, mouse]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target: mouse && isDragging && typeof window !== 'undefined' ? window : null,
        type: 'mousemove mouseup',
        handler,
        consolidate: true,
      }),
      [handler, isDragging, mouse]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target: touch && element ? element : null,
        type: 'touchstart touchmove touchend touchcancel',
        handler,
        consolidate: true,
      }),
      [element, handler, touch]
    )
  );

  const value = useMemo(
    (): UseDragReturn => ({
      isDragging,
      origin,
      current,
      move,
      distance,
      direction,
      velocity,
      duration,
    }),
    [current, direction, distance, duration, isDragging, move, origin, velocity]
  );

  return value;
}

export default useDrag;
