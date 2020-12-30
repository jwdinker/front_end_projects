import * as React from 'react';
import getElement, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import { HasChanged, UseBoundingClientRectReturn } from './types';

export * from './types';

const INITIAL_STATE = {
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  height: 0,
  width: 0,
  x: 0,
  y: 0,
};

const MEASURABLE_PROPERTIES = ['top', 'left', 'height', 'width'] as const;

const hasChanged: HasChanged = (previous, current) =>
  MEASURABLE_PROPERTIES.some((property) => previous[property] !== current[property]);

const { useState, useEffect, useCallback } = React;

const getMeasurements = (element: HTMLElement) => {
  const { top, bottom, left, right, height, width, x, y } = element.getBoundingClientRect();
  return {
    top,
    bottom,
    left,
    right,
    height,
    width,
    x,
    y,
  };
};

function useBoundingClientRect(element: ElementOrReference): UseBoundingClientRectReturn {
  const [measurements, setMeasurements] = useState(() => INITIAL_STATE);

  const update = useCallback(() => {
    const _element = getElement(element);

    if (_element) {
      const nextMeasurements = getMeasurements(_element);

      setMeasurements((previousMeasurements) => {
        return hasChanged(previousMeasurements, nextMeasurements)
          ? nextMeasurements
          : previousMeasurements;
      });
    }
  }, [element]);

  useEffect(() => {
    update();
  }, [update]);

  return [measurements, update];
}

export default useBoundingClientRect;
