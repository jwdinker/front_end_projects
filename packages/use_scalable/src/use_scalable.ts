import { useState, useCallback, useMemo } from 'react';

import {
  UseScalableState,
  UseScalableHandler,
  UseScalableReturn,
  UseScalableOptions,
  Point,
  Dimensions,
} from './types';
import { getDistance, getScale, constrain, makeCenterPoint } from './helpers';
import { DEFAULTS } from './constants';

/**
 *
 * @param options.initialScale - Initial x,y,z of the scale.
 * @param options.min - Minimum scale for the x,y,z axis.
 * @param options.max - Maximum scale for the x,y,z axis.
 * @param options.height - Initial height of the element used in conjunction with the top coordinate to calculate the center y coordinate.  Note: This is only needed if you are calculating from a single coordinate.
 * @param options.width - Initial width of the element used in conjunction with the left coordinate to calculate the center x coordinate.  Note: This is only needed if you are calculating from a single coordinate.  Note: This is only needed if you are calculating from a single coordinate
 * @param options.top - Initial top coordinate of the element used in conjunction with the height dimension to calculate the center y coordinate.  Note: This is only needed if you are calculating from a single coordinate.
 * @param options.left - Initial left coordinate of the element used in conjunction with the width dimension to calculate the center x coordinate.  Note: This is only needed if you are calculating from a single coordinate.
 */
function useScalable({
  initialScale = DEFAULTS.INITIAL_SCALE,
  min = DEFAULTS.MIN_SCALE,
  max = DEFAULTS.MAX_SCALE,
  height = 0,
  width = 0,
  top = 0,
  left = 0,
}: UseScalableOptions = {}): UseScalableReturn {
  const [scale, setScale] = useState<UseScalableState>(() => ({
    distance: [0, 0, 0],
    vector: initialScale,
  }));

  const dimensions = useMemo((): Dimensions => {
    return [width, height];
  }, [height, width]);

  const coordinates = useMemo((): Point => {
    return [top, left];
  }, [left, top]);

  const start = useCallback<UseScalableHandler>(
    (point, center) => {
      const _center = center || makeCenterPoint(dimensions, coordinates);
      setScale((previous) => {
        const distance = getDistance(point, _center);

        return {
          ...previous,
          distance,
        };
      });
    },
    [coordinates, dimensions]
  );

  const move = useCallback<UseScalableHandler>(
    (point, center) => {
      const _center = center || makeCenterPoint(dimensions, coordinates);
      setScale((state) => {
        const { distance: lastDistance, vector } = state;

        const distance = getDistance(point, _center);

        const _vector = vector.map((value, index) => {
          return constrain(
            min[index],
            max[index],
            getScale(value, distance[index], lastDistance[index])
          );
        });

        return {
          distance: distance.map((d, i) => (d <= 0 ? lastDistance[i] : d)),
          vector: _vector,
        };
      });
    },
    [coordinates, dimensions, max, min]
  );

  const end = useCallback((): void => {}, []);

  const handlers = useMemo(
    () => ({
      start,
      move,
      end,
    }),
    [end, move, start]
  );

  const value = useMemo((): UseScalableReturn => {
    return [scale, handlers];
  }, [handlers, scale]);

  return value;
}

export default useScalable;
