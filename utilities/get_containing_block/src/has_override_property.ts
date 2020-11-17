/*
4. - If the position property is absolute or fixed, the containing block may also
  be formed by the edge of the padding box of the nearest ancestor element that
  has the following:
    - A transform or perspective value other than none
    - A will-change value of transform or perspective
    - A filter value other than none or a will-change value of filter (only
      works on Firefox).
    - A contain value of paint (e.g. contain: paint;)
*/
const hasOverrideProperty = (elementOrStyle: CSSStyleDeclaration | HTMLElement): boolean => {
  if (elementOrStyle instanceof HTMLElement) {
    return hasOverrideProperty(getComputedStyle(elementOrStyle));
  }
  // @ts-ignore
  const { transform, perspective, willChange, filter, contain } = elementOrStyle;
  const hasTransform = transform !== 'none';
  const hasPerspective = perspective !== 'none';
  // @ts-ignore
  const isFirefox = typeof InstallTrigger !== 'undefined';
  const hasWillChange = willChange === 'transform' || willChange === 'perspective';
  const isPaintContained = contain === 'paint';
  const isFirefoxException = isFirefox && (filter !== 'none' || willChange === 'filter');

  return hasTransform || hasPerspective || hasWillChange || isPaintContained || isFirefoxException;
};

export default hasOverrideProperty;
