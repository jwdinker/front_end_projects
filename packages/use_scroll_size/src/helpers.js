const SIZE_PROPS = ['height', 'width'];

export const hasDimensionChanged = (previous, current) =>
  SIZE_PROPS.some((prop) => previous[prop] !== current[prop]);

export function getDimensions(target) {
  return target === window
    ? {
        height:
          (document.documentElement && document.documentElement.scrollHeight) ||
          document.body.scrollHeight,
        width:
          (document.documentElement && document.documentElement.scrollWidth) ||
          document.body.scrollWidth,
      }
    : {
        height: target.scrollHeight,
        width: target.scrollWidth,
      };
}
