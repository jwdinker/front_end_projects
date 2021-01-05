/* eslint-disable no-param-reassign */
import * as React from 'react';

import getTransform from '../helpers/get_transform';
import { TetheredElement, TetherableMeasurements, TetheredPosition } from '../types';

const { useLayoutEffect } = React;

function useTetheredTransform(
  elements: TetheredElement[],
  measurements: TetherableMeasurements,
  position: TetheredPosition = 'fixed'
) {
  useLayoutEffect(() => {
    elements.forEach((ref, index) => {
      if (ref && ref.current) {
        const currentMeasurements = measurements[index];
        const transform = getTransform(currentMeasurements);

        ref.current.style.position = `${position}`;
        ref.current.style.top = '0px';
        ref.current.style.left = '0px';
        ref.current.style.transform = transform;
      }
    });
  }, [elements, measurements, position]);
}

export default useTetheredTransform;
