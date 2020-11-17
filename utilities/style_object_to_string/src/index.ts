import camelCaseTo from '@jwdinker/camel-case-to';

function styleObjectToString(style: Record<string, any>): string {
  if (typeof style !== 'object') {
    throw new TypeError('styleObjectToString requires an object as a parameter.');
  }
  return Object.keys(style).reduce((accumulator, key) => {
    const value = style[key];
    const formattedKey = camelCaseTo(key, '-');
    // eslint-disable-next-line no-param-reassign
    accumulator += `${formattedKey}:${value};`;
    return accumulator;
  }, '');
}

export default styleObjectToString;
