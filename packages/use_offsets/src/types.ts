import { RefObject } from 'react';

export interface Offsets {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}

export interface GetPositionReturn {
  top: number;
  left: number;
}

export type UseOffsetsElement =
  | RefObject<HTMLElement | undefined | null>
  | HTMLElement
  | undefined
  | null;

export type Remeasure = () => void;

export type UseOffsetsReturn = [Offsets, Remeasure];
