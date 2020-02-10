import { isPx, isEm, isRem, isNumber } from './conditional_helpers';
// const createFluidStyle = ({ viewport, range: [min, max], property }) => {
//   const maxRangeNum = parseInt(max, 10);
//   const minRangeNum = parseInt(min, 10);
//   const minViewportPx = `${viewport.min}px`;
//   const maxViewportPx = `${viewport.max}px`;
//   const calculation = `calc(${min} + (${maxRangeNum} - ${minRangeNum}) * ((100vw - ${minViewportPx}) / (${viewport.max} - ${viewport.min})));`;
//   return `
//     ${mediaQuery({ [property]: calculation }, { breakpoint: minViewportPx })}
//     ${mediaQuery({ [property]: max }, { breakpoint: maxViewportPx })}
// `;
// };

// export default createFluidStyle;

const createFluidStyle = ({ properties, viewport = { min: 100, max: 1600 } }) => {
  const minViewportPx = `${viewport.min}px`;
  const maxViewportPx = `${viewport.max}px`;

  const { min, max } = Object.keys(properties).reduce(
    (accumulator, property) => {
      const [min, max] = properties[property];
      const maxRangeNum = parseInt(max, 10);
      const minRangeNum = parseInt(min, 10);

      const minimumValue = `calc(${min} + (${maxRangeNum} - ${minRangeNum}) * ((100vw - ${minViewportPx}) / (${viewport.max} - ${viewport.min})));`;

      return {
        min: `${accumulator.min}${property}:${minimumValue};`,
        max: `${accumulator.max}${property}:${max};`,
      };
    },
    { min: '', max: '' }
  );

  return `
    @media screen and (min-width: ${minViewportPx}) {
        ${min}
    }
    @media screen and (min-width: ${maxViewportPx}) {
        ${max}
    }
    `;
};

export default createFluidStyle;
