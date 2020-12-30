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

export type UpdateBoundingClientRectMeasurements = () => void;

export type UseBoundingClientRectReturn = [Rectangle, UpdateBoundingClientRectMeasurements];

export type UseBoundingClientRect = (
  /**
   * An HTML element or React reference containing a HTML Element.
   */
  element: RectangleElement
) => UseBoundingClientRectReturn;

export type HasChanged = (previous: Rectangle, current: Rectangle) => boolean;
