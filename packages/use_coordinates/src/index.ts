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

function useCoordinates(initial: Point = [0, 0]): UseCoordinateReturn {
  const [coordinates, setCoordinates] = useState<UseCoordinatesState>(() => ({
    origin: initial,
    current: initial,
    distance: initial,
    move: [0, 0],
    direction: [0, 0],
  }));

  const start = useCallback<UseCoordinateHandler>((x, y) => {
    setCoordinates((state) => {
      const current: Point = [x, y];
      return {
        ...state,
        origin: current,
        current,
        move: [0, 0],
      };
    });
  }, []);

  const move = useCallback<UseCoordinateHandler>((x, y) => {
    setCoordinates(({ distance, current: previous, origin, ...state }) => {
      const deltaX = previous[0] - x;
      const deltaY = previous[1] - y;

      const nextDistance: Point = [distance[0] - deltaX, distance[1] - deltaY];
      const current: Point = [x, y];

      return {
        ...state,
        origin,
        current,
        move: [x - origin[0], y - origin[1]],
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
    }),
    [end, move, start]
  );

  const value = useMemo((): UseCoordinateReturn => {
    return [coordinates, handlers];
  }, [coordinates, handlers]);

  return value;
}

export default useCoordinates;
