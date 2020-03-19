import { useState, useCallback } from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';

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

export interface Rectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
  x?: number;
  y?: number;
}

const MEASURABLE_PROPERTIES = ['top', 'left', 'height', 'width'] as const;

const hasChanged = (previous: Rectangle, current: Rectangle): boolean =>
  MEASURABLE_PROPERTIES.some((property) => previous[property] !== current[property]);

type UseBoundingClientRectReturnValue = [Rectangle, () => void, () => void];

function useBoundingClientRect(
  element: React.RefObject<HTMLElement | undefined> | HTMLElement | null,
  { addPageOffsets = false } = {}
): UseBoundingClientRectReturnValue {
  const [measurements, setMeasurements] = useState(() => INITIAL_STATE);

  const getElement = useCallback(() => {
    if (element) {
      if ('current' in element) {
        return element.current;
      }
      return element;
    }
    return null;
  }, [element]);

  const handler = useCallback(() => {
    const _element = getElement();

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
  }, [addPageOffsets, getElement, measurements]);

  const [watch, unwatch] = useAnimationFrame(handler);

  return [measurements, watch, unwatch];
}

export default useBoundingClientRect;
