export type InteractionType = 'mouse' | 'touch' | 'touches' | 'none';

export type InteractionEvent = globalThis.TouchEvent | globalThis.MouseEvent;

export interface InteractionTypes {
  MOUSE: InteractionType;
  TOUCH: InteractionType;
  TOUCHES: InteractionType;
  NONE: InteractionType;
}

export const INTERACTION_TYPES: InteractionTypes = {
  MOUSE: 'mouse',
  TOUCH: 'touch',
  TOUCHES: 'touches',
  NONE: 'none',
};

function areTouchEventsSupported(): boolean {
  return typeof window !== 'undefined' && window.ontouchstart === null;
}
const { MOUSE, TOUCH, TOUCHES, NONE } = INTERACTION_TYPES;

function makeGetInteractionType(mouse = false, touch = 2) {
  return (event: InteractionEvent): InteractionType => {
    const touches =
      !!event && areTouchEventsSupported() && event instanceof TouchEvent ? event.touches : null;
    const isSingleTouch = touch === 1 && touches && touches.length === 1;
    const isMultiTouch = touch > 1 && touches && touches.length > 1;
    const isMouse = mouse && !!event && event instanceof MouseEvent;

    if (isSingleTouch) {
      return TOUCH;
    }

    if (isMultiTouch) {
      return TOUCHES;
    }

    if (isMouse) {
      return MOUSE;
    }
    return NONE;
  };
}

export default makeGetInteractionType;
