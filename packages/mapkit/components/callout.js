import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useInstance } from '../internal';

function Callout({ annotation, appear, animate, children, type, animation }) {
  const container = useInstance(() => {
    const element = document.createElement('div');
    element.style.height = '100%';
    element.style.width = '100%';
    return element;
  });

  useEffect(() => {
    annotation.callout = {};
    if (type === 'custom') {
      annotation.callout.calloutElementForAnnotation = () => container;
    }

    if (type === 'content') {
      annotation.callout.calloutContentForAnnotation = () => container;
    }

    return () => {
      annotation.callout = null;
    };
  }, [annotation.callout, annotation.subtitle, annotation.title, container, type]);

  useEffect(() => {
    annotation.callout.calloutShouldAppearForAnnotation = appear;
  }, [appear, annotation.callout]);

  useEffect(() => {
    annotation.callout.calloutShouldAnimateForAnnotation = animate;
  }, [animate, annotation.callout]);

  useEffect(() => {
    if (animation) {
      annotation.callout.calloutAppearanceAnimationForAnnotation = () => {
        return animation;
      };
    }
  }, [animate, animation, annotation.callout]);

  const isRenderProps = typeof children === 'function';
  return createPortal(isRenderProps ? children(annotation) : children, container);
}

Callout.defaultProps = {
  appear: true,
  animate: true,
  type: '',
  animation: null,
};

export default Callout;
