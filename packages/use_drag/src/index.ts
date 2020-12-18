import useDragListener, { DragCallback, DragElement } from '@jwdinker/use-drag-listener';
import makeGetInteractionType from '@jwdinker/make-get-interaction-type';

import { getTouchForceAtIndex } from '@jwdinker/touch-helpers';
import * as React from 'react';

import { dragStart, dragMove, dragEnd, INITIAL_STATE, reducer } from './actions';

import { UseDragProps, DragState } from './types';
import { getCoordinates } from './helpers';

const { useMemo, useRef, useState } = React;

function useDrag(
  element: DragElement,
  {
    mouse = true,
    touch = 1,
    canDrag = () => true,
    passive = true,
    capture = false,
  }: UseDragProps = {}
): DragState {
  const startTime = useRef(0);
  const [state, setState] = useState(INITIAL_STATE);

  const getInteractionType = useMemo(() => makeGetInteractionType(mouse, touch), [mouse, touch]);

  const start: DragCallback = (event, listeners) => {
    setState((previousState) => {
      const interactionType = getInteractionType(event);
      const coordinates = getCoordinates(event, interactionType);
      const timestamp = Date.now();
      startTime.current = timestamp;

      const startState = reducer(previousState, dragStart(coordinates, timestamp));
      if (canDrag(startState, event)) {
        listeners.listen();
        startTime.current = timestamp;
        return startState;
      }
      return previousState;
    });
  };

  const move: DragCallback = (event) => {
    setState((previousState) => {
      const interactionType = getInteractionType(event);
      const coordinates = getCoordinates(event, interactionType);
      const timestamp = Date.now();
      const duration = timestamp - startTime.current;
      const moveState = reducer(
        previousState,
        dragMove(coordinates, getTouchForceAtIndex(event), duration, timestamp)
      );
      if (canDrag(moveState, event)) {
        return moveState;
      }

      return previousState;
    });
  };

  const end: DragCallback = (event, listeners) => {
    listeners.unlisten();
    const duration = Date.now() - startTime.current;
    setState((previousState) => reducer(previousState, dragEnd(duration)));
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
