import { useRef, useEffect, useCallback } from 'react';
import EventStore, {
  createConsolidatedEventStore,
  EVENT_STORE,
  getSupportedEventOptions,
} from '@jwdinker/event-store';

type Handler = (event: Event) => void;

type ToggleHandler = (event?: Event) => void;

function isRefObject<T = any>(target: unknown): target is React.RefObject<T> {
  return target && Object.hasOwnProperty.call(target, 'current');
}

interface EventListenerOptions {
  /** What should we add the event listener to? */
  target?: HTMLElement | Window | null | React.RefObject<HTMLElement>;
  type?: string;
  /** If true, this will run during the "capture" phase (not recommended); if false then it will run during the bubbling phase which occurs later but in the typically desired order. */
  capture?: boolean;
  once?: boolean;
  passive?: boolean;

  /** This is the main thing we care about - what to do when the event is triggered */
  handler?: Handler;
  onAdd?: ToggleHandler;
  onRemove?: ToggleHandler;
  togglable?: boolean;
  consolidate?: boolean;
  storeName?: string;
}

type Listener = {
  unsubscribe: () => void;
};

/**
 * Handles the complexity of adding and removing event listeners;
 * also consolidates the event listeners on the target and does
 * the checks for you to see if passive, once and capture are supported
 * and if not it will handle this for you.
 */
function useEventListener(options: EventListenerOptions) {
  const {
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
  } = options;
  const listener = useRef<Listener | null>(null);
  const canAddListenerOnEffect = !togglable;

  const saved = useRef<{
    handler: typeof handler;
    onAdd: typeof onAdd;
    onRemove: typeof onRemove;
  }>({ handler, onAdd, onRemove });

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
    const _options = { capture, passive, once };
    return getSupportedEventOptions(_options);
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
    const _target = getTarget();

    if (_target) {
      saved.current.onAdd();

      const _handler = (payload: Event) => {
        saved.current.handler(payload);
      };

      const store = consolidate
        ? createConsolidatedEventStore(_target, storeName)
        : new EventStore(_target);
      listener.current = store.subscribe(type, _handler, getOptions());

      return () => {
        detach();
      };
    }
  }, [consolidate, detach, getOptions, getTarget, storeName, type]);

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
