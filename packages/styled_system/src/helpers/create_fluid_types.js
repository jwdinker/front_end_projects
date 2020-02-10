import { isNumber, has } from './conditional_helpers';
import createFluidStyle from './create_fluid_style';

/*
injectThemeValues checks if the value in the range is from the theme, and
replaces the value if it is from the theme.
*/
function injectThemeValues(theme, fluidProps) {
  return fluidProps.reduce((properties, { range, themeKey, cssProperty, key }) => {
    const isValidRange = Array.isArray(range) && range.length === 2;

    if (!isValidRange) {
      throw new Error(`\n\nThe property '${key}' is a fluid css property and requires an array of 2 values.\n\n`);
    }

    return {
      ...properties,
      [cssProperty]: range.reduce((accumulator, value) => {
        const _isNumber = isNumber(value);
        const valuesFromTheme = theme[themeKey];
        if (!_isNumber && valuesFromTheme) {
          const valueInTheme = valuesFromTheme[value];

          if (valueInTheme) {
            return accumulator.concat(valueInTheme);
          }
        }
        return accumulator.concat(value);
      }, []),
    };
  }, {});
}

/*
createFluidTypes takes an object containing multiple property names that will be
used on the component, and returns a function that creates the media query for
those values.  Instead of creating a bunch of media queries for each single
property, I decided to group them together.
*/
function createFluidTypes(types) {
  const hasRequiredKeys = Object.values(types).every((type) => has(type, 'themeKey') || has(type, 'cssProperty'));

  if (!hasRequiredKeys) {
    throw new Error('\n\nCreating fluid types requires each property has a themeKey and a cssProperty\n\n');
  }

  return ({ theme, ...props }) => {
    const fluidProps = Object.keys(types).reduce((accumulator, key) => {
      const range = props[key];

      return range ? accumulator.concat({ range, ...types[key], key }) : accumulator;
    }, []);

    const isFluidProps = fluidProps.length > 0;
    if (!isFluidProps) return '';

    const { viewport } = theme;

    const transformedProperties = injectThemeValues(theme, fluidProps);

    return createFluidStyle({ properties: transformedProperties, viewport });
  };
}

export default createFluidTypes;
