import { useMemo, useCallback, useState } from 'react';

import {
  Point,
  UseCoordinateReturn,
  UseCoordinateHandlers,
  UseCoordinatesState,
  UseCoordinateHandler,
} from './types';
import { getDirection } from './helpers';

function useCoordinates(initial: Point = [0, 0, 0]): UseCoordinateReturn {
  const [coordinates, setCoordinates] = useState<UseCoordinatesState>(() => ({
    origin: initial,
    current: initial,
    distance: initial,
    change: [0, 0, 0],
    direction: [0, 0, 0],
  }));

  const start = useCallback<UseCoordinateHandler>((x, y, z = 0) => {
    setCoordinates((state) => {
      const current: Point = [x, y, z];
      return {
        ...state,
        origin: current,
        current,
        change: [0, 0, 0],
      };
    });
  }, []);

  const move = useCallback<UseCoordinateHandler>((x, y, z = 0) => {
    setCoordinates(({ distance, current: previous, origin, ...state }) => {
      const deltaX = previous[0] - x;
      const deltaY = previous[1] - y;
      const deltaZ = previous[2] - z;

      const nextDistance: Point = [
        distance[0] - deltaX,
        distance[1] - deltaY,
        distance[2] - deltaZ,
      ];
      const current: Point = [x, y, z];
      const change: Point = [x - origin[0], y - origin[1], z - origin[2]];

      return {
        ...state,
        origin,
        current,
        change,
        distance: nextDistance,
        direction: getDirection(previous, current),
      };
    });
  }, []);

  const end = useCallback(() => {
    setCoordinates((state) => ({
      ...state,
      direction: [0, 0, 0],
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
