function hasOwnProperty<O extends {}, P extends PropertyKey>(
  object: O,
  property: P
): object is O & Record<P, unknown> {
  // eslint-disable-next-line no-prototype-builtins
  return object.hasOwnProperty(property);
}

export default hasOwnProperty;
