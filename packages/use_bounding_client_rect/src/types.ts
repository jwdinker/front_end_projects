export type DOMRectangleElement =
  | React.RefObject<HTMLElement | null | undefined>
  | null
  | undefined;

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
  element: DOMRectangleElement
) => UseBoundingClientRectReturn;

export type HasChanged = (previous: Rectangle, current: Rectangle) => boolean;
