export interface Boundaries {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export type BoundaryElement = React.RefObject<HTMLElement | undefined> | Window | null;
