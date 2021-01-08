import { ScalableOptions, ScaleState, ScaleTo } from '@jwdinker/use-scalable';

export type TouchToTrigger = 0 | 1 | 2;

export interface ScaleOptions extends ScalableOptions {
  mouse?: boolean;
  touch?: TouchToTrigger;
}

export type ScaleReturn = [ScaleState, ScaleTo];

export type ScalableElement = React.RefObject<HTMLElement | null>;

export type UseScale = (element: ScalableElement, options: ScaleOptions) => ScaleReturn;
