export const isObject = (object) => typeof object === 'object';
export const isNumber = (number) => !isNaN(number);

export const isPx = (value) => value.indexOf('px') > -1;
export const isEm = (value) => value.indexOf('em') > -1;
export const isRem = (value) => value.indexOf('rem') > -1;
export const has = (object, key) => Object.hasOwnProperty.call(object, key);
