import { RefObject } from 'react';

export type EnableMove = () => void;
export type DisableMove = () => void;

export type OnMouseDown = (
  event: globalThis.MouseEvent,
  enable: EnableMove
) => undefined | boolean | void;

export type OnMouseMove = (event: globalThis.MouseEvent) => undefined | boolean | void;

export type OnMouseUp = (
  event: globalThis.MouseEvent,
  disable: DisableMove
) => undefined | boolean | void;

export type OnTouchStart = (
  event: globalThis.TouchEvent,
  enable: EnableMove
) => undefined | boolean | void;

export type OnTouchMove = (event: globalThis.TouchEvent) => undefined | boolean | void;

export type OnTouchEnd = (
  event: globalThis.TouchEvent,
  disable: DisableMove
) => undefined | boolean | void;

export interface UseDragListenerProps {
  onMouseDown?: OnMouseDown;
  onMouseMove?: OnMouseMove;
  onMouseUp?: OnMouseUp;
  onTouchStart?: OnTouchStart;
  onTouchMove?: OnTouchMove;
  onTouchEnd?: OnTouchEnd;
  mouse?: boolean;
  touch?: boolean;
  once?: boolean;
  passive?: boolean;
  capture?: boolean;
}

export type DragElement = RefObject<HTMLElement | undefined | null>;
