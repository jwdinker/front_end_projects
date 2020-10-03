import useDragListener, { DragCallback, DragElement } from '@jwdinker/use-drag-listener';
import makeGetInteractionType from '@jwdinker/make-get-interaction-type';

import { getTouchForceAtIndex } from '@jwdinker/touch-helpers';
import * as React from 'react';

import { dragStart, dragMove, dragEnd, INITIAL_STATE, reducer } from './actions';

import { UseDragProps, DragState } from './types';
import { getCoordinates } from './helpers';

const { useMemo, useReducer, useRef } = React;

function useDrag(
  element: DragElement,
  {
    mouse = true,
    touch = 1,
    initialCoordinates = [0, 0],
    canDrag = () => true,
    passive = true,
    capture = false,
  }: UseDragProps = {}
): DragState {
  const startTime = useRef(0);
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  const getInteractionType = useMemo(() => makeGetInteractionType(mouse, touch), [mouse, touch]);

  const start: DragCallback = (event, listeners) => {
    if (canDrag(event)) {
      listeners.listen();
      const interactionType = getInteractionType(event);
      const coordinates = getCoordinates(event, interactionType);
      const timestamp = Date.now();
      startTime.current = timestamp;
      dispatch(dragStart(coordinates, timestamp));
    }
  };

  const move: DragCallback = (event) => {
    const interactionType = getInteractionType(event);
    const coordinates = getCoordinates(event, interactionType);
    const timestamp = Date.now();
    const duration = timestamp - startTime.current;
    dispatch(dragMove(coordinates, getTouchForceAtIndex(event), duration, timestamp));
  };

  const end: DragCallback = (event, listeners) => {
    listeners.unlisten();
    const duration = Date.now() - startTime.current;
    dispatch(dragEnd(duration));
  };

  useDragListener(element, {
    onStart: start,
    onMove: move,
    onEnd: end,
    touch: touch > 0,
    pointer: false,
    mouse: true,
    passive,
    capture,
  });

  return state;
}

export default useDrag;
