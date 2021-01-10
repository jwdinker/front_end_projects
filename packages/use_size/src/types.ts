export interface ContentRect {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
  x?: number;
  y?: number;
}

export interface InitialContentRect {
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

export type UseSizeValue = [ContentRect, boolean];
