import { RefObject } from 'react';

export type DragEvent = globalThis.MouseEvent | globalThis.TouchEvent;

export interface OnDragListenerHandlers {
  listen(): void;
  unlisten(): void;
}

export type DragCallback = (event: DragEvent, handlers: OnDragListenerHandlers) => void;
export type KeyboardCallback = (event: KeyboardEvent, handlers: OnDragListenerHandlers) => void;

export interface UseDragListenerProps {
  onStart?: DragCallback;
  onMove?: DragCallback;
  onEnd?: DragCallback;
  onKeyUp?: KeyboardCallback;
  onKeyDown?: KeyboardCallback;
  mouse?: boolean;
  touch?: boolean;
}

export interface UseDragListenerReturn {
  listen(): void;
  unlisten(): void;
}

export type DragElement = RefObject<HTMLElement | undefined | null>;
