import { DragEvent } from '@jwdinker/use-drag-listener';
import { INTERACTION_TYPES, InteractionType } from '@jwdinker/make-get-interaction-type';

import { getMouseCoordinates } from '@jwdinker/mouse-helpers';
import { get1Touch } from '@jwdinker/touch-helpers';

import { Coordinates } from './types';

export const getCoordinates = (event: DragEvent, interactionType: InteractionType): Coordinates => {
  const coordinates =
    interactionType === INTERACTION_TYPES.MOUSE
      ? getMouseCoordinates(event as MouseEvent)
      : interactionType === INTERACTION_TYPES.TOUCH || interactionType === INTERACTION_TYPES.TOUCHES
      ? get1Touch(event as TouchEvent)
      : [0, 0];

  return coordinates as Coordinates;
};

export const getVelocity = (distance: number, elapsed: number): number => {
  const number = distance / elapsed;
  return Math.round((number + Number.EPSILON) * 100) / 100;
};
