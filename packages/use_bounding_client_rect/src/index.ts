import { useState, useRef, useEffect } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';
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
  const hasInitiallyMeasured = useRef(false);
  const [measurements, setMeasurements] = useState(() => INITIAL_STATE);

  const handler = (): void => {
    const _element = getElement(element);

    if (_element) {
      const { top, bottom, left, right, height, width, x, y } = _element.getBoundingClientRect();
      const nextMeasurements = {
        top,
        bottom,
        left,
        right,
        height,
        width,
        x,
        y,
      };

      setMeasurements((previousMeasurements) => {
        return hasChanged(previousMeasurements, nextMeasurements)
          ? nextMeasurements
          : previousMeasurements;
      });
    }
  };

  const [watch, unwatch] = useAnimationFrame(handler);

  useEffect(() => {
    const _element = getElement(element);
    if (!hasInitiallyMeasured.current && _element) {
      setMeasurements(getMeasurements(_element));
    }
  }, [element]);

  const handlers = {
    update: handler,
    watch,
    unwatch,
  };

  return [measurements, handlers];
}

export default useBoundingClientRect;
