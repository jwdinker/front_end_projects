export interface Rectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export type Side = 'top' | 'bottom' | 'right' | 'left';

export interface AbbreviatedRectangle {
  top: number;
  left: number;
  height: number;
  width: number;
}

export interface Overflowing {
  top?: boolean;
  bottom?: boolean;
  left?: boolean;
  right?: boolean;
}

export interface Boundaries {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface UseOverflowingReturn {
  isOverflowing: boolean;
  sides: Side[];
  changed: boolean;
}
