import * as React from 'react';

export type BlockableAxis = 'x' | 'y' | 'xy';

export interface UseBlockScrollOptions {
  blockable?: BlockableAxis;
}

export interface Coordinates {
  x: number;
  y: number;
}

export type BlockScroll = () => void;
export type RestoreScroll = () => void;

export type UseBlockScrollReturn = [BlockScroll, RestoreScroll];

export type BlockableElement = React.RefObject<HTMLElement | null | undefined> | null;
