import { useState } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';
import getElement from '@jwdinker/get-element-or-reference';
import { HasChanged, UseBoundingClientRect } from './types';

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

const useBoundingClientRect: UseBoundingClientRect = (element, { addPageOffsets = false } = {}) => {
  const [measurements, setMeasurements] = useState(() => INITIAL_STATE);

  const handler = (): void => {
    const _element = getElement(element);

    if (_element) {
      const { top, bottom, left, right, height, width, x, y } = _element.getBoundingClientRect();
      const rect = {
        top,
        bottom,
        left,
        right,
        height,
        width,
        x,
        y,
      };

      if (addPageOffsets) {
        const scrollLeft = window.pageXOffset;
        const scrollTop = window.pageYOffset;
        rect.top += scrollTop;
        rect.bottom += scrollTop;
        rect.left += scrollLeft;
        rect.right += scrollLeft;
      }

      if (hasChanged(measurements, rect)) {
        setMeasurements(rect);
      }
    }
  };

  const [watch, unwatch] = useAnimationFrame(handler);

  return [measurements, watch, unwatch];
};

export default useBoundingClientRect;
