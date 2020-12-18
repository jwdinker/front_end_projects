import { useState } from 'react';

import getDistanceFromPoints from '@jwdinker/get-distance-from-points';
import {
  UseScalableState,
  UseScalableHandler,
  UseScalableReturn,
  UseScalableOptions,
  Dimensions,
} from './types';
import { getScale, constrain, makeCenterPoint } from './helpers';
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

  const dimensions: Dimensions = [width, height];

  const coordinates = [top, left];

  const start: UseScalableHandler = (point, center) => {
    const _center = center || makeCenterPoint(dimensions, coordinates);
    setScale((previous) => {
      const distance = getDistanceFromPoints(point, _center);

      return {
        ...previous,
        distance,
      };
    });
  };

  const move: UseScalableHandler = (point, center) => {
    const _center = center || makeCenterPoint(dimensions, coordinates);
    setScale((state) => {
      const { distance: lastDistance, vector } = state;

      const distance = getDistanceFromPoints(point, _center);

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
  };

  const end = (): void => {};

  return [scale, { start, move, end }];
}

export default useScalable;
