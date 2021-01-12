import { useState, useEffect, useRef } from 'react';
import { ResizeObserver } from '@juggle/resize-observer';
import getHTMLElementReference, {
  HTMLElementReference,
} from '@jwdinker/get-html-element-from-reference';
import { InitialContentRect, UseSizeValue } from './types';

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

function useSize(
  element: HTMLElementReference,
  initialContentRect: InitialContentRect = {}
): UseSizeValue {
  const resizeObserver = useRef<ResizeObserver | null>();

  const [state, setState] = useState<UseSizeValue>(() => {
    return [
      {
        ...DEFAULT_CONTENT_RECTANGLE,
        ...initialContentRect,
      },
      false,
    ];
  });

  useEffect(() => {
    const _element = getHTMLElementReference(element);

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
        setState([nextState, true]);
      });

      resizeObserver.current.observe(_element);

      return () => {
        if (resizeObserver.current) {
          resizeObserver.current.unobserve(_element);
        }
      };
    }
    return undefined;
  }, [element]);

  const changed = state[1];

  useEffect(() => {
    if (changed) {
      setState((previous) => {
        return [previous[0], false];
      });
    }
  }, [changed]);

  return state;
}

export default useSize;
