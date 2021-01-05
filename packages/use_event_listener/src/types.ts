export type EventTarget =
  | HTMLElement
  | Window
  | Document
  | null
  | undefined
  | React.RefObject<HTMLElement | Document | Window | undefined | null>;

export type Listener = {
  unsubscribe: () => void;
};

export type EventHandler = (event: Event) => void;

export interface EventListenerOptions {
  /** If true, this will run during the "capture" phase (not recommended); if false then it will run during the bubbling phase which occurs later but in the typically desired order. */
  capture?: boolean;
  once?: boolean;
  passive?: boolean;

  /** This is the main thing we care about - what to do when the event is triggered */
  consolidate?: boolean;
  storeName?: string;
}

type AttachListener = () => void;
type DetachListener = () => void;

export interface UseEventListenerReturn {
  attach: AttachListener;
  detach: DetachListener;
}
