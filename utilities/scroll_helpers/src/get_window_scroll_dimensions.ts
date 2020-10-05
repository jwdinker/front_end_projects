import { ScrollDimensions } from './types';

function getWindowScrollDimensions(includeScrollBar = true): ScrollDimensions {
  if (typeof window !== 'undefined') {
    if (includeScrollBar) {
      return {
        width:
          window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
        height:
          window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
      };
    }
    return {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    };
  }
  return {
    height: 0,
    width: 0,
  };
}

export default getWindowScrollDimensions;
