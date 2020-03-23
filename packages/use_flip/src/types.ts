export interface Rectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}

export interface AbbreviatedRectangle {
  top: number;
  left: number;
  height: number;
  width: number;
}

export type Alignment = 'top' | 'bottom' | 'left' | 'right';

export type Side = 'top' | 'bottom' | 'left' | 'right';

export interface FlipOptions {
  top?: Side[];
  left?: Side[];
  right?: Side[];
  bottom?: Side[];
}

export interface DefaultFlip {
  top?: Side[];
  left?: Side[];
  right?: Side[];
  bottom?: Side[];
}

export interface UseFlipOptions {
  flip?: FlipOptions;
  preference?: Alignment;
  tethered?: AbbreviatedRectangle[];
}

export interface Perimeter {
  top: number;
  left: number;
  right: number;
  bottom: number;
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
