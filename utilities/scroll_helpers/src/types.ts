export interface ScrollCoordinates {
  x: number;
  y: number;
}

export interface ScrollDimensions {
  height: number;
  width: number;
}

export type ScrollableElement = HTMLElement | Window | Document;

export interface ScrollMeasurements extends ScrollCoordinates, ScrollDimensions {}

export type ScrollAncestors = Array<Element | Window>;
