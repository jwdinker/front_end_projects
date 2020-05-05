import { useRef, useEffect, useCallback, useMemo } from 'react';
import {
  createConsolidatedEventStore,
  EVENT_STORE,
  getSupportedEventOptions,
} from '@jwdinker/event-store';

import {
  EventTarget,
  Listener,
  EventListenerOptions,
  EventHandler,
  UseEventListenerReturn,
} from './types';

export { UseEventListenerReturn } from './types';

function isRefObject<T = any>(target: unknown): target is React.RefObject<T> {
  return target && Object.hasOwnProperty.call(target, 'current');
}

/**
 * Handles the complexity of adding and removing event listeners;
 * also consolidates the event listeners on the target and does
 * the checks for you to see if passive, once and capture are supported
 * and if not it will handle this for you.
 */
function useEventListener(
  target: EventTarget,

  type: string,
  handler: EventHandler,
  options: EventListenerOptions = {}
): UseEventListenerReturn {
  const {
    capture = false,
    once = false,
    passive = false,
    consolidate = false,
    storeName = EVENT_STORE,
  } = options;

  const listener = useRef<Listener | null>(null);
  const handle = useRef<EventHandler>(() => {});
  const saved = useRef<EventHandler>(handler);

  /*
    Handlers are saved so useCallback hell can be avoided and listeners are not
    constantly added and removed.
  */
  useEffect(() => {
    saved.current = handler;
  }, [handler]);

  /*
  -------------
  | getOptions |
  -------------
    Checks which addEventListener options are supported by the browser.
  */

  const _options = useMemo(() => {
    return getSupportedEventOptions({ capture, passive, once });
  }, [capture, once, passive]);

  const types = useMemo(() => {
    return type.split(' ');
  }, [type]);

  /*
  -------------
  | getTarget |
  -------------
    Checks if the target prop is a reference by looking if it contains a
    'current' key. Otherwise it's assumed that it is window, document, etc. 
  */
  const getTarget = useCallback(() => {
    if (typeof window === 'undefined' || !target) {
      return null;
    }
    if (isRefObject(target)) {
      return target.current;
    }
    return target;
  }, [target]);

  /*
  ----------
  | detach |
  ----------
    Removes the event listener from the event store.  If there are no handlers
    remaining on the event, the event key is removed.
  */
  const detach = useCallback(() => {
    if (listener.current) {
      listener.current.unsubscribe();
      listener.current = null;
    } else {
      const _target = getTarget();
      if (_target) {
        types.forEach((name) => {
          _target.removeEventListener(name, handle.current);
        });
      }
    }
  }, [getTarget, types]);

  /*
  ----------
  | attach |
  ----------
    Adds the listener to the target if it exists.
  */
  const attach = useCallback(() => {
    const _target = getTarget();

    if (_target) {
      handle.current = (payload: Event): void => {
        saved.current(payload);
      };

      const _handler = (payload: Event): void => {
        saved.current(payload);
      };

      if (consolidate) {
        const store = createConsolidatedEventStore(_target, storeName);
        listener.current = store.subscribe(type, _handler, _options);
      } else {
        types.forEach((name) => {
          _target.addEventListener(name, handle.current, _options);
        });
      }
    }
  }, [_options, consolidate, getTarget, storeName, type, types]);

  const value = useMemo((): UseEventListenerReturn => {
    return {
      attach,
      detach,
    };
  }, [attach, detach]);
  return value;
}

export default useEventListener;
