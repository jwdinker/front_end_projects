import { StartFrameLoop, StopFrameLoop } from '@jwdinker/use-animation-frame';
import { ElementOrReference } from '@jwdinker/get-element-or-reference';

export type RectangleElement = ElementOrReference;

export interface Rectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
  x?: number;
  y?: number;
}

export type UseBoundingClientRectReturn = [Rectangle, StartFrameLoop, StopFrameLoop];

export interface UseBoundingClientRectOptions {
  /**
   * Boolean for determining whether the window x and y offsets should be
   * included in the measurements.  Defaults to false
   */
  addPageOffsets?: boolean;
}

export type UseBoundingClientRect = (
  /**
   * An HTML element or React reference containing a HTML Element.
   */
  element: RectangleElement,
  options: UseBoundingClientRectOptions
) => UseBoundingClientRectReturn;

export type HasChanged = (previous: Rectangle, current: Rectangle) => boolean;
