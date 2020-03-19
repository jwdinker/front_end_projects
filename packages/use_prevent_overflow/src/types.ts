export type Side = 'top' | 'bottom' | 'left' | 'right';

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

export interface AbbreviatedRectangle {
  top: number;
  left: number;
  height: number;
  width: number;
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

export type SideOptions = {
  top: boolean;
  left: boolean;
  right: boolean;
  bottom: boolean;
};

export type Overflowing = {
  top: boolean;
  left: boolean;
  bottom: boolean;
  right: boolean;
};

export interface UsePreventOverflowOptions {
  padding?: PaddingOptions;
  sides?: Side[];
}

export type UsePreventOverflowReturn = [AbbreviatedRectangle | Rectangle, Overflowing];
