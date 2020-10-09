import * as React from 'react';

export type BlockableAxis = 'x' | 'y' | 'xy';

export interface UseBlockScrollOptions {
  axis?: BlockableAxis;
  onBlock?(): void;
  onUnblock?(): void;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Dimensions {
  height: number;
  width: number;
}

export type EnableBodyScroll = () => void;
export type DisableBodyScroll = () => void;

export type UseBlockScrollReturn = [EnableBodyScroll, DisableBodyScroll];

export type BlockableElement = React.RefObject<HTMLElement | null | undefined> | null;
