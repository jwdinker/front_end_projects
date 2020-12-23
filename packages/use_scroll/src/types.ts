import { EasingType } from '@jwdinker/easing-fns';
import { SCROLL_PHASES } from './constants';

export interface ScrollCoordinates {
  x: number;
  y: number;
}

export type ScrollPhase = typeof SCROLL_PHASES[keyof typeof SCROLL_PHASES];

export interface ScrollState extends ScrollCoordinates {
  isScrolling: boolean;
  direction: number;
  phase: ScrollPhase;
  isAnimating: boolean;
}

export type ScrollElement =
  | React.RefObject<HTMLElement | Window | null | undefined>
  | HTMLElement
  | Window
  | null
  | undefined;

export type ScrollTarget = HTMLElement | globalThis.Window;

export interface ScrollToAnimationProps {
  easing?: EasingType;
  duration?: number;
}

export interface ScrollToOptions extends ScrollToAnimationProps {
  x?: number;
  y?: number;
}

export type ScrollToCoord = [number, number];

export type ScrollTo = (options: ScrollToOptions) => void;

export type UseScrollReturn = [ScrollState, ScrollTo];

export type ScrollOptions = {
  passive?: boolean;
  capture?: boolean;
  once?: boolean;
  consolidate?: boolean;
  endDelay?: number;
};
