import { Alignment, AbbreviatedRectangle, Side } from '@jwdinker/use-tether';

export interface UsePopoverProps {
  /**
   * The HTMLElement reference whose coordinates are used to compute the position of the popover and the triangle.
   */
  anchor?: React.RefObject<HTMLElement | undefined> | null;
  /**
   * The HTMLElement reference used for the popover.
   */
  popover?: React.RefObject<HTMLElement | undefined> | null;
  /**
   * The HTMLElement reference used for the arrow.
   */
  arrow?: React.RefObject<HTMLElement | undefined> | null;
  alignment?: Alignment;
}

export interface PaddingOptions {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
}

export interface Padding {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface ArrowRotations {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface ReduceSidesReturnValue {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export type Position = 'absolute' | 'fixed';

export type Visibility = 'visible' | 'hidden';

export interface SharedStyle {
  position: Position;
  visibility: Visibility;
}

export interface PopoverStyles {
  position: Position;
  visibility: Visibility;
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface ArrowStyles {
  position: Position;
  visibility: Visibility;
  rotate: number;
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface UsePopoverReturnValue {
  popover: PopoverStyles;
  arrow: ArrowStyles;
  padding: {
    popover: Padding;
    arrow: Padding;
  };
  anchor: AbbreviatedRectangle;
}
