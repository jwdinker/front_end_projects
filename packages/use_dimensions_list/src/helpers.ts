import { ReferencedElement } from '@jwdinker/use-element-references-change';
import { Dimensions } from './types';

export const getDimensions = (element: HTMLElement) => {
  return {
    height: element.offsetHeight,
    width: element.offsetWidth,
  };
};

export const handleMatchingReferenceIndex = (
  previousDimensions: Dimensions[],
  referencedElements: ReferencedElement[],
  callback: (element: HTMLElement) => Dimensions
) => {
  return previousDimensions.map((offset, index) => {
    const isMatch = referencedElements[index][0] === index;

    if (isMatch) {
      const element = referencedElements[index][1];
      return callback(element);
    }
    return offset;
  });
};
