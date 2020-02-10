import { useState, useEffect, useRef, useCallback } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

const isRef = (object) => Object.hasOwnProperty.call(object, 'current');

const defaultState = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
};

function useSize(target, { onResize = () => {}, initialState = defaultState } = {}) {
  const callbacks = useRef();
  const [state, setState] = useState(() => ({
    ...defaultState,
    initialState,
  }));

  useEffect(() => {
    callbacks.current = {
      onResize,
    };
  }, [onResize]);

  const getTarget = useCallback(() => {
    const isWindow = typeof window !== 'undefined';
    if (!isWindow) {
      return null;
    }
    return target && isRef(target) ? target.current : target;
  }, [target]);

  useEffect(() => {
    const _target = getTarget(target);

    if (_target) {
      const resizeObserver = new ResizeObserver((entries) => {
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

        setState(nextState);
        callbacks.current.onResize(nextState);
      });

      resizeObserver.observe(_target);

      return () => {
        resizeObserver.unobserve(_target);
      };
    }
  }, [getTarget, target]);

  return state;
}

export default useSize;
