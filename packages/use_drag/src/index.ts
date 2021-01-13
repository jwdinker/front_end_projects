import useDragListener, { DragElement, EnableMove, DisableMove } from '@jwdinker/use-drag-listener';
import get1TouchCoordinates from '@jwdinker/get-1-touch-coordinates';
import getMouseCoordinates from '@jwdinker/get-mouse-coordinates';

import * as React from 'react';

import {
  dragStart,
  dragMove,
  dragEnd,
  dragTo as dragToXY,
  INITIAL_STATE,
  reducer,
} from './actions';

import { UseDragProps, DragReturn } from './types';

const { useState, useCallback } = React;

function useDrag(
  element: DragElement,
  {
    canDrag = () => true,
    initialTranslate = [0, 0],
    mouse = true,
    touch = true,
    passive = true,
    capture = false,
  }: UseDragProps = {}
): DragReturn {
  const [state, setState] = useState(() => {
    return {
      ...INITIAL_STATE,
      translate: initialTranslate,
    };
  });

  const dragTo = useCallback(({ x = 0, y = 0 }) => {
    setState((previousState) => reducer(previousState, dragToXY(x, y)));
  }, []);

  function onStart(event: TouchEvent | MouseEvent, enableMove: EnableMove) {
    setState((previousState) => {
      const coordinates =
        event instanceof MouseEvent ? getMouseCoordinates(event) : get1TouchCoordinates(event);

      const startState = reducer(previousState, dragStart(coordinates));
      if (canDrag(startState, event)) {
        enableMove();

        return startState;
      }
      return previousState;
    });
  }

  function onMove(event: TouchEvent | MouseEvent) {
    setState((previousState) => {
      const coordinates =
        event instanceof MouseEvent ? getMouseCoordinates(event) : get1TouchCoordinates(event);
      const moveState = reducer(previousState, dragMove(coordinates));
      if (canDrag(moveState, event)) {
        return moveState;
      }

      return previousState;
    });
  }

  function onEnd(event: TouchEvent | MouseEvent, disableMove: DisableMove) {
    disableMove();

    setState((previousState) => reducer(previousState, dragEnd()));
  }

  useDragListener(element, {
    onTouchStart: onStart,
    onTouchMove: onMove,
    onTouchEnd: onEnd,
    onMouseDown: onStart,
    onMouseMove: onMove,
    onMouseUp: onEnd,
    mouse,
    touch,
    capture,
    passive,
  });

  return [state, dragTo];
}

export default useDrag;
