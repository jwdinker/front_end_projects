import { ScrollDimensions } from './types';

function getDocumentScrollDimensions(): ScrollDimensions {
  if (typeof window !== 'undefined') {
    const height = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight
    );
    const width = Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.body.clientWidth,
      document.documentElement.clientWidth
    );
    return {
      height,
      width,
    };
  }
  return { height: 0, width: 0 };
}

export default getDocumentScrollDimensions;
