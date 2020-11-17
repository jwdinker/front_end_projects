import * as CSS from 'csstype';

export type TransformKey =
  | 'translateX'
  | 'translateY'
  | 'translateZ'
  | 'translate'
  | 'translate3d'
  | 'scale'
  | 'scaleX'
  | 'scaleY'
  | 'rotate'
  | 'rotate3d'
  | 'rotateX'
  | 'rotateY'
  | 'rotateZ'
  | 'skewX'
  | 'skewY'
  | 'perspective';

export interface Transform extends CSS.Properties {
  translateX?: string;
  translateY?: string;
  translate?: string;
  translate3d?: string;
  scale?: string;
  scaleX?: string;
  scaleY?: string;
  rotate?: string;
  rotate3d?: string;
  rotateX?: string;
  rotateY?: string;
  rotateZ?: string;
  skewX?: string;
  skewY?: string;
  perspective?: string;
}
/**
 *
 * @param order A list containing the order in which the values of the transform
 * will be organized.
 *
 * Probably abstraction overkill, but it has it's use cases. The
 * makeCSSTransformFromObject function returns a getTransform function that
 * accepts an object of transform properties and their values, and combines them
 * into a string based on the order.
 */
function makeCSSTransformFromObject(order: TransformKey[]) {
  return function getTransfrom(props: Transform) {
    return order.reduce((accumulator, key) => {
      const value = props[key];
      if (value) {
        // eslint-disable-next-line no-param-reassign
        accumulator += `${key}(${value}) `;
      }
      return accumulator;
    }, '');
  };
}

export default makeCSSTransformFromObject;
