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
 * 
 * @param target Checks if the target prop is a reference by looking if it contains a
    'current' key. Otherwise it's assumed that it is window, document, etc. 
 */
function getTarget(target: EventTarget) {
  if (typeof window === 'undefined' || !target) {
    return null;
  }
  if (isRefObject(target)) {
    return target.current;
  }
  return target;
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
  const savedHandler = useRef<EventHandler>();
  const caller = useRef<EventHandler>();

  /*
    Handlers are saved so useCallback hell can be avoided and listeners are not
    constantly added and removed.
  */
  useEffect(() => {
    caller.current = handler;
    return () => {
      caller.current = undefined;
    };
  }, [handler]);

  /**
   * Removes the event listener from the event store.  If there are no handlers
   * remaining on the event, the event key is removed.
   */
  const detach = useCallback(() => {
    if (listener.current) {
      listener.current.unsubscribe();
      listener.current = null;
    } else {
      const element = getTarget(target);
      if (element) {
        type.split(' ').forEach((name) => {
          if (savedHandler.current) {
            element.removeEventListener(name, savedHandler.current);
          }
        });
      }
    }
  }, [target, type]);

  /**
   * Adds the listener to the target if it exists
   */
  const attach = useCallback(() => {
    const element = getTarget(target);

    if (element) {
      savedHandler.current = (payload: Event): void => {
        if (caller.current) {
          caller.current(payload);
        }
      };

      if (consolidate) {
        const store = createConsolidatedEventStore(element, storeName);

        listener.current = store.subscribe(type, savedHandler.current, { passive, capture, once });
      } else {
        savedHandler.current = (payload: Event) => {
          if (caller.current) {
            caller.current(payload);
          }
        };

        const eventOptions = getSupportedEventOptions({ capture, passive, once });

        type.split(' ').forEach((name) => {
          if (savedHandler.current) {
            element.addEventListener(name, savedHandler.current, eventOptions);
          }
        });
      }
    }
  }, [capture, consolidate, once, passive, storeName, target, type]);

  useEffect(() => {
    return () => {
      savedHandler.current = undefined;
    };
  }, []);

  const value = useMemo((): UseEventListenerReturn => {
    return {
      attach,
      detach,
    };
  }, [attach, detach]);
  return value;
}

export default useEventListener;
