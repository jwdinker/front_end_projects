export type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

export type Element = React.RefObject<HTMLElement> | Window;

export interface DirectionTypes {
  UP: 'up';
  DOWN: 'down';
  LEFT: 'left';
  RIGHT: 'right';
  NONE: 'none';
}

export interface ScrollBroadcastProps {
  children: React.ReactNode;
  endDelay: number;
  passive: false;
  element: Element;
}

export interface ScrollStateOptions {
  endDelay?: number;
  passive?: boolean;
}

export interface ScrollState {
  active: boolean;
  top: number;
  left: number;
  direction: Direction;
}

export type UseScrollStateReturn = [ScrollState, Event | null];

export type ElementOrWindow = HTMLElement | Window;

export type ScrollElement =
  | React.RefObject<HTMLElement | Window | undefined>
  | Window
  | null
  | HTMLElement;
