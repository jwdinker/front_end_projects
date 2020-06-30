import { EasingType } from '@jwdinker/easing-fns';
import { ScrollCoordinates } from '@jwdinker/scroll-helpers';
import { Direction } from '@jwdinker/get-directions';
import { SCROLL_PHASES } from './constants';

export type Element = React.RefObject<HTMLElement | undefined> | Window;

export type ScrollPhase = typeof SCROLL_PHASES[keyof typeof SCROLL_PHASES];

export interface ScrollStateOptions {
  endDelay?: number;
  passive?: boolean;
  capture?: boolean;
  once?: boolean;
}

export type ElementOrWindow = HTMLElement | Window;

export type ScrollElement =
  | React.RefObject<HTMLElement | Window | undefined | null>
  | Window
  | null;

export type PreviousScrollCoordinates = number[];

export type ScrollDistance = [number, number];

export interface ScrollState {
  phase: ScrollPhase;
  isScrolling: boolean;
  x: number;
  y: number;
  direction: Direction[];
  velocity: number;
}

export interface ScrollToProps {
  x?: number;
  y?: number;
  smooth?: boolean;
  easing?: EasingType;
  duration?: number;
}

export type ScrollTo = (props: ScrollToProps) => void;

export type ScrollStateReturn = [ScrollState, ScrollTo, Event | null];

export interface SmoothScrollProps {
  start: ScrollCoordinates;
  end: ScrollCoordinates;
  duration: number;
  easing: EasingType;
}

export type SmoothScrollCallback = (x: number, y: number) => void;
