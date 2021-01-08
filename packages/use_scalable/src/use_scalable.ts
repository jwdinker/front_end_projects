import * as React from 'react';

import getDistanceFromPoints from '@jwdinker/get-distance-from-points';
import { ScalableReturn, ScalableOptions, ScaleState, ScaleStart, ScaleMove } from './types';
import { getScale, constrain } from './helpers';
import { DEFAULTS } from './constants';

const { useState, useCallback } = React;

/**
 *
 * @param options.initialScale - Initial x,y,z of the scale.
 * @param options.min - Minimum scale for the x,y,z axis.
 * @param options.max - Maximum scale for the x,y,z axis.
 */
function useScalable({
  initialScale = DEFAULTS.INITIAL_SCALE,
  min = DEFAULTS.MIN_SCALE,
  max = DEFAULTS.MAX_SCALE,
}: ScalableOptions = {}): ScalableReturn {
  const [state, setState] = useState<ScaleState>(() => ({
    isScaling: false,
    distanceFromCenter: [0, 0, 0],
    xyz: initialScale,
  }));

  const scaleTo = useCallback((xyz: number[]) => {
    setState((previous) => ({
      ...previous,
      xyz,
    }));
  }, []);

  const start = useCallback<ScaleStart>((point, center) => {
    setState((previous) => {
      const distanceFromCenter = getDistanceFromPoints(point, center);

      return {
        ...previous,
        isScaling: true,
        distanceFromCenter,
      };
    });
  }, []);

  const move = useCallback<ScaleMove>(
    (point, center) => {
      setState((previous) => {
        const { distanceFromCenter: lastDistance, xyz: lastXYZ } = previous;

        const distance = getDistanceFromPoints(point, center);

        const xyz = lastXYZ.map((value, index) => {
          return constrain(
            min[index],
            max[index],
            getScale(value, distance[index], lastDistance[index])
          );
        });

        return {
          ...previous,
          distanceFromCenter: distance.map((d, i) => (d <= 0 ? lastDistance[i] : d)),
          xyz,
        };
      });
    },
    [min, max]
  );

  const end = useCallback(() => {
    setState((previous) => ({
      ...previous,
      isScaling: false,
    }));
  }, []);

  return [state, { start, move, end, scaleTo }];
}

export default useScalable;
