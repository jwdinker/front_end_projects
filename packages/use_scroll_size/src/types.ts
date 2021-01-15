/**
 * Scroll dimensions of the element passed into useScrollSize.
 */
export interface ScrollDimensions {
  height: number;
  width: number;
}

export type GetDimensionsTarget = Document | Window | HTMLElement;

export type ScrollableElement =
  | React.RefObject<Document | Window | HTMLElement | undefined | null>
  | Document
  | Window
  | null

/**
 * boolean true when the scroll dimensions have changed, false when scroll
 * dimensions have not changed
 */
export type Changed = boolean;

export type UseScrollSizeReturn = [ScrollDimensions, Changed];
