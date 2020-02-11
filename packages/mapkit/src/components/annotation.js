import React, { cloneElement, Children, useMemo, useContext, useEffect, Fragment } from 'react';
import { createPortal } from 'react-dom';
import { useInstance, usePrevious } from '../internal';
import { MapContext } from '../contexts';
import useAnnotationAndOverlayEvents from '../hooks/use_annotation_and_overlay_events';
import PropTypes from 'prop-types';

function Annotation({
  type,
  latitude,
  longitude,
  onSelect,
  onDeselect,
  onDragStart,
  onDrag,
  onDragEnd,
  children,
  custom,
  padding,
  anchorOffset,
  ...props
}) {
  const { Annotation, Padding, MarkerAnnotation, ImageAnnotation, Coordinate } = mapkit;

  const { hasMapLoaded, index } = useContext(MapContext);

  const map = useMemo(() => {
    if (hasMapLoaded) {
      return mapkit.maps[index];
    }
    return null;
  }, [hasMapLoaded, index]);

  const isCustom = type === 'custom';
  const isImage = type === 'image';
  const isMarker = type === 'marker';
  const hasCallout = !!children;

  const previousProps = usePrevious(props);

  const annotationProps = { ...props, padding: new Padding(padding), anchorOffset: new DOMPoint(...anchorOffset) };
  const coordinate = useInstance(() => new Coordinate(latitude, longitude));
  const annotation = useInstance(() => {
    if (isCustom) {
      const element = document.createElement('div');
      return new Annotation(coordinate, () => element, annotationProps);
    }

    if (isMarker) {
      return new MarkerAnnotation(coordinate, annotationProps);
    }

    if (isImage) {
      return new ImageAnnotation(coordinate, annotationProps);
    }
  });

  useAnnotationAndOverlayEvents(annotation, { onSelect, onDeselect, onDragStart, onDrag, onDragEnd });

  useEffect(() => {
    if (previousProps) {
      return Object.keys(props).forEach((key) => {
        const value = props[key];

        const previousValue = previousProps[key];
        if (value !== previousValue) {
          annotation[key] = value;
        }
      });
    }
  }, [annotation, previousProps, props]);

  useEffect(() => {
    if (hasMapLoaded) {
      map.addAnnotation(annotation);
      return () => {
        /*
      !Since react will call map.destroy() in the unmount effect higher in the
      !component tree, I have to have a way to discern when an annotation
      !component is being unmounted vs when the annotation is nuked from the
      !global state via map.destroy.  I use map.element to make this
      !decision where it is infered that if the map element is gone, and the
      !unmount is called, then I shouldn't call map.removeAnnotation because it
      !is going to disappear when the map is destroyed. This is a consequence of
      !apple managing their own global state.
    */
        if (map.element) {
          map.removeAnnotation(annotation);
        }
      };
    }
  }, [annotation, hasMapLoaded, map]);

  return (
    <Fragment>
      {isCustom ? createPortal(custom(annotation), annotation.element) : null}
      {hasCallout && Children.only(children) ? cloneElement(children, { annotation }) : null}
    </Fragment>
  );
}

Annotation.defaultProps = {
  type: null,
  latitude: 0,
  longitude: 0,
  onSelect: () => {},
  onDeselect: () => {},
  onDragStart: () => {},
  onDrag: () => {},
  onDragEnd: () => {},
  accessibilityLabel: '',
  data: {},
  draggable: false,
  animates: true,
  enabled: true,
  selected: false,
  displayPriority: 250,
  visible: true,
  animates: true,
  clusteringIdentifier: null,
  appearanceAnimation: '',
  collisionMode: 'rectangle',
  padding: {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  anchorOffset: [0, 0],
};

export default Annotation;
