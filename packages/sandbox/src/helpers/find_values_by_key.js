function findValuesByKey(key) {
  return function reduce(object, result = []) {
    return Object.keys(object).reduce((next, k) => {
      const value = object[k];
      if (k === key) {
        return next.concat(value);
      }
      if (typeof value === 'object') {
        return reduce(value, next);
      }
      return next;
    }, result);
  };
}

export default findValuesByKey;
