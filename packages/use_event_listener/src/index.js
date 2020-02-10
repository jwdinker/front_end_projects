import { useRef, useEffect, useCallback } from 'react';
import EventStore, {
  createConsolidatedEventStore,
  EVENT_STORE,
  getSupportedEventOptions,
} from '@jwdinker/event-store';

function useEventListener({
  target = null,
  type = '',
  capture = false,
  once = false,
  passive = false,
  handler = () => {},
  onAdd = () => {},
  onRemove = () => {},
  togglable = false,
  consolidate = false,
  storeName = EVENT_STORE,
} = {}) {
  const listener = useRef();
  const canAddListenerOnEffect = !togglable;

  const saved = useRef();

  /*
    Handlers are saved so useCallback hell can be avoided and listeners are not
    constantly added and removed.
  */
  useEffect(() => {
    saved.current = {
      handler,
      onAdd,
      onRemove,
    };
  }, [handler, onAdd, onRemove]);

  /*
  -------------
  | getOptions |
  -------------
    Checks which addEventListener options are supported by the browser.
  */
  const getOptions = useCallback(() => {
    const options = { capture, passive, once };
    return getSupportedEventOptions(options);
  }, [capture, once, passive]);

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
    if (Object.hasOwnProperty.call(target, 'current')) {
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
      saved.current.onRemove();
      listener.current.unsubscribe();
      listener.current = null;
    }
  }, []);

  /*
  ----------
  | attach |
  ----------
    Adds the listener to the target if it exists.
  */
  const attach = useCallback(() => {
    const _target = getTarget(target);

    if (_target) {
      saved.current.onAdd();
      const _target = getTarget();
      const options = getOptions();

      const _handler = (payload) => {
        saved.current.handler(payload);
      };

      const store = consolidate
        ? createConsolidatedEventStore(_target, storeName)
        : new EventStore(_target);
      listener.current = store.subscribe(type, _handler, options);

      return () => {
        detach();
      };
    }
  }, [consolidate, detach, getOptions, getTarget, storeName, target, type]);

  /*
  Since events can be toggled, if the listener is toggled on, there needs to be
  an assurance that the event listener is removed as well on an unmount.
  */
  useEffect(
    () => () => {
      detach();
    },
    [detach]
  );

  useEffect(() => {
    if (canAddListenerOnEffect) {
      return attach();
    }
  }, [attach, canAddListenerOnEffect]);

  return [attach, detach];
}

export default useEventListener;
