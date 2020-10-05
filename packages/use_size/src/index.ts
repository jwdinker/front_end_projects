import { useState, useEffect, useRef } from 'react';
// import ResizeObserver from 'resize-observer-polyfill';
import { ResizeObserver } from '@juggle/resize-observer';
import getElement, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import { unstable_batchedUpdates as batch } from 'react-dom';
import { Rectangle, UseSizeValue } from './types';

const DEFAULT_CONTENT_RECTANGLE = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
};

function useSize(element: ElementOrReference, initialState?: Rectangle): UseSizeValue {
  const resizeObserver = useRef<ResizeObserver | null>();
  const [changed, setChanged] = useState(false);

  const [state, setState] = useState<Rectangle>(() => ({
    ...DEFAULT_CONTENT_RECTANGLE,
    ...initialState,
  }));

  useEffect(() => {
    const _element = getElement(element);

    if (_element) {
      resizeObserver.current = new ResizeObserver((entries) => {
        const entry = entries[0];
        const { contentRect } = entry;
        const { bottom, height, left, right, top, width, x, y } = contentRect;

        const nextState = {
          bottom,
          height,
          left,
          right,
          top,
          width,
          x,
          y,
        };
        batch(() => {
          setState(nextState);
          setChanged(true);
        });
      });

      resizeObserver.current.observe(_element);

      return () => {
        if (resizeObserver.current) {
          resizeObserver.current.unobserve(_element);
        }
      };
    }
  }, [element]);

  useEffect(() => {
    if (changed) {
      setChanged(false);
    }
  }, [changed]);

  return [state, changed];
}

export default useSize;
