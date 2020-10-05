export type InteractionEvent =
  | globalThis.TouchEvent
  | globalThis.MouseEvent
  | globalThis.WheelEvent;

export interface InteractionTypes {
  MOUSE: InteractionType;
  TOUCH: InteractionType;
  TOUCHES: InteractionType;
  NONE: InteractionType;
}

export const INTERACTION_TYPES = {
  MOUSE: 'mouse',
  TOUCH: 'touch',
  TOUCHES: 'touches',
  WHEEL: 'wheel',
  NONE: 'none',
  DORMANT: 'dormant',
  IDLE: 'idle',
} as const;

export type InteractionType = typeof INTERACTION_TYPES[keyof typeof INTERACTION_TYPES];

function areTouchEventsSupported(): boolean {
  return typeof window !== 'undefined' && window.ontouchstart === null;
}
const { MOUSE, TOUCH, TOUCHES, NONE, WHEEL } = INTERACTION_TYPES;

export function getInteractionType(event: InteractionEvent): InteractionType {
  const touches =
    !!event && areTouchEventsSupported() && event instanceof TouchEvent ? event.touches : null;

  const isSingleTouch = touches && touches.length === 1;

  if (isSingleTouch) {
    return TOUCH;
  }

  const isMultiTouch = touches && touches.length > 1;

  if (isMultiTouch) {
    return TOUCHES;
  }

  const isMouse = !!event && event instanceof MouseEvent;
  if (isMouse) {
    return MOUSE;
  }

  const isWheel = !!event && event instanceof WheelEvent;
  if (isWheel) {
    return WHEEL;
  }
  return NONE;
}

function makeGetInteractionType(mouse = false, touch = 2) {
  return (event: InteractionEvent): InteractionType => {
    const touches =
      !!event && areTouchEventsSupported() && event instanceof TouchEvent ? event.touches : null;
    const isSingleTouch = touch === 1 && touches && touches.length === 1;

    if (isSingleTouch) {
      return TOUCH;
    }

    const isMultiTouch = touch > 1 && touches && touches.length > 1;
    if (isMultiTouch) {
      return TOUCHES;
    }
    const isMouse = mouse && !!event && event instanceof MouseEvent;
    if (isMouse) {
      return MOUSE;
    }

    const isWheel = !!event && event instanceof WheelEvent;
    if (isWheel) {
      return WHEEL;
    }
    return NONE;
  };
}

export default makeGetInteractionType;
