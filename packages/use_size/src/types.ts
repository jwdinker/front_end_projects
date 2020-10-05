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

export type UseSizeValue = [Rectangle, boolean];
