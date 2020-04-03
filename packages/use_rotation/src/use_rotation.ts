import useEventListener from '@jwdinker/use-event-listener';
import useSSR from '@jwdinker/use-ssr';
import { useMemo, useCallback } from 'react';
import useToggle from '@jwdinker/use-toggle';
import {
  is,
  getElement,
  getSingleTouchCoordinates,
  getMultiTouchCoordinates,
  getMouseCoordinates,
} from './helpers';
import useRotatable from './use_rotatable';
import { UseRotationOptions, RotatableElement, Point, UseRotationReturn } from './types';
import { MOUSE_EVENTS, TOUCH_EVENTS } from './constants';

/**
 *
 * @param element The react ref of the rotatable element.
 * @param options Configuration options for the rotation.
 * @param options.initialAngle The initial angle of the rotation.
 * @param options.multiTouch Rotation is triggered only if there are 2 touch points on the element.
 * @param options.mouse Rotation can be triggered with the mouse pointer.
 * @param options.touch Rotation can be triggered with a single touch.
 */
function useRotation(
  element: RotatableElement,
  { initialAngle = 0, multiTouch = false, mouse = false, touch = false }: UseRotationOptions = {}
): UseRotationReturn {
  const { isBrowser } = useSSR();
  const [active, { activate, deactivate }] = useToggle();
  const options = useMemo(() => ({ initialAngle }), [initialAngle]);

  const rotation = useRotatable(options);

  const handler = useCallback(
    (event) => {
      const _element = getElement(element);
      if (_element) {
        const touches = !!event && event instanceof TouchEvent ? event.touches : null;

        const isSingleTouch = !multiTouch && touches && touches.length === 1;
        const isMultiTouch = multiTouch && touches && touches.length > 1;
        const isMouse = !!event && event instanceof MouseEvent;

        // active is used to prevent mousemove overriding mouseup
        const isStart = is.start(event.type) && !active;
        const isMove = is.move(event.type) && active;
        const isEnd = is.end(event.type) && active;

        const isRotating = isSingleTouch || isMultiTouch || isMouse;

        // coordinates are only updated only if there are mouse or touch coordinates present.
        if (isRotating) {
          const [point, center] = isMultiTouch
            ? getMultiTouchCoordinates(touches as TouchList)
            : isSingleTouch
            ? getSingleTouchCoordinates(touches as TouchList, _element)
            : isMouse
            ? getMouseCoordinates(event as MouseEvent, _element)
            : ([
                [0, 0],
                [0, 0],
              ] as Point[]);

          if (isStart) {
            activate();
            rotation.start(point, center);
          }

          if (isMove) {
            rotation.move(point, center);
          }
        }

        if (isEnd) {
          deactivate();
          rotation.end();
        }
      }
    },
    [activate, active, deactivate, element, multiTouch, rotation]
  );

  useEventListener(
    useMemo(
      () => ({
        target: isBrowser && mouse ? window : null,
        type: MOUSE_EVENTS,
        handler,
        consolidate: true,
      }),
      [handler, isBrowser, mouse]
    )
  );

  useEventListener(
    useMemo(
      () => ({
        target: touch || multiTouch ? element : null,
        type: TOUCH_EVENTS,
        handler,
        consolidate: true,
      }),
      [element, handler, multiTouch, touch]
    )
  );

  const { direction, angle, total } = rotation;

  const value = useMemo((): UseRotationReturn => ({ active, direction, angle, total }), [
    active,
    angle,
    direction,
    total,
  ]);

  return value;
}

export default useRotation;
