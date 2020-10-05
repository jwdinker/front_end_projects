import { useMemo, useCallback, useState } from 'react';

import getDirections from '@jwdinker/get-directions';
import {
  Point,
  UseCoordinateReturn,
  UseCoordinateHandlers,
  UseCoordinatesState,
  UseCoordinateHandler,
} from './types';

export { UseCoordinatesState, UseCoordinateHandler } from './types';
export { default as getDirections } from '@jwdinker/get-directions';
export { Direction } from '@jwdinker/get-directions';

const DEFAULT_STATE: UseCoordinatesState = {
  initial: [0, 0],
  current: [0, 0],
  delta: [0, 0],
  distance: [0, 0],
  move: [0, 0],
  direction: [0, 0],
};

function useCoordinates(initialCoordinates: Point = [0, 0]): UseCoordinateReturn {
  const [coordinates, setCoordinates] = useState<UseCoordinatesState>(() => ({
    ...DEFAULT_STATE,
    initial: initialCoordinates,
    current: initialCoordinates,
    distance: initialCoordinates,
  }));

  const reset = useCallback(() => {
    setCoordinates(DEFAULT_STATE);
  }, []);

  const start = useCallback<UseCoordinateHandler>((x, y) => {
    setCoordinates((state) => {
      const current: Point = [x, y];
      return {
        ...state,
        initial: current,
        current,
        move: [0, 0],
      };
    });
  }, []);

  const move = useCallback<UseCoordinateHandler>((x, y) => {
    setCoordinates(({ distance, current: previous, initial, ...state }) => {
      const deltaX = previous[0] - x;
      const deltaY = previous[1] - y;

      const nextDistance: Point = [distance[0] - deltaX, distance[1] - deltaY];
      const current: Point = [x, y];

      return {
        ...state,
        initial,
        current,
        delta: [deltaX, deltaY],
        move: [x - initial[0], y - initial[1]],
        distance: nextDistance,
        direction: getDirections(previous, current),
      };
    });
  }, []);

  const end = useCallback(() => {
    setCoordinates((state) => ({
      ...state,
      direction: [0, 0],
    }));
  }, []);

  const handlers = useMemo(
    (): UseCoordinateHandlers => ({
      start,
      move,
      end,
      reset,
    }),
    [end, move, reset, start]
  );

  const value = useMemo((): UseCoordinateReturn => {
    return [coordinates, handlers];
  }, [coordinates, handlers]);

  return value;
}

export default useCoordinates;
