import { createFluidTypes } from '../helpers';

const FLUID_TYPOGRAPHY_TYPES = {
  lineHeightFluid: {
    themeKey: 'lineHeights',
    cssProperty: 'line-height',
  },
  fontSizeFluid: {
    themeKey: 'fontSizes',
    cssProperty: 'font-size',
  },
};

const fluidTypography = createFluidTypes(FLUID_TYPOGRAPHY_TYPES);

export default fluidTypography;
