import { createFluidTypes } from '../helpers';

const FLUID_TYPOGRAPHY_TYPES = {
  paddingFluid: {
    themeKey: 'paddings',
    cssProperty: 'padding',
  },
  p: {
    themeKey: 'paddings',
    cssProperty: 'padding',
  },
  marginFluid: {
    themeKey: 'fontSizes',
    cssProperty: 'font-size',
  },
};

const fluidTypography = createFluidTypes(FLUID_TYPOGRAPHY_TYPES);

export default fluidTypography;
