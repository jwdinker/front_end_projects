import { RotatableState, RotateTo } from '@jwdinker/use-rotatable';

export type RotatableElement = React.RefObject<HTMLElement | null | undefined>;

export type TouchToTrigger = 1 | 2;
export interface UseRotationOptions {
  initialAngle?: number;
  mouse?: boolean;
  touch?: TouchToTrigger;
}

export type RotationReturn = [RotatableState, RotateTo];

export type UseRotation = (
  element: RotatableElement,
  options: UseRotationOptions
) => RotationReturn;
