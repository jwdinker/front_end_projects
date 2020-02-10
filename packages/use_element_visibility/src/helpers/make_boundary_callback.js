export const POSITION_PROPS = [
  ['left', 'right', 'width'],
  ['top', 'bottom', 'height'],
];

const makeBoundaryCallback = (callback) => {
  return (element, ancestor) => {
    const formatted = POSITION_PROPS.map((prop) => {
      const offsetType = prop[0];
      const oppositeOffsetType = prop[1];
      const dimensionType = prop[2];

      const size = element[dimensionType];
      const offset = element[offsetType];
      const oppositeOffset = offset + size;

      return {
        element: {
          start: offset,
          end: oppositeOffset,
        },
        ancestor: {
          start: ancestor[offsetType],
          end: ancestor[offsetType] + ancestor[dimensionType],
        },
        position: {
          start: offsetType,
          end: oppositeOffsetType,
        },
      };
    });
    return callback(formatted);
  };
};

export default makeBoundaryCallback;
