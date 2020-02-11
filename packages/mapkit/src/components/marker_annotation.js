import React from 'react';
import Annotation from './annotation';

function MarkerAnnotation({ type, ...props }) {
  return <Annotation {...props} type="marker" />;
}

MarkerAnnotation.defaultProps = {
  title: '',
  subtitle: '',
  titleVisibility: 'adaptive',
  subtitleVisibility: 'adaptive',
  color: '#ff5b40',
  glyphColor: 'white',
  glyphText: '',
  glyphImage: null,
  selectedGlyphImage: null,
  custom: null,
};

export default MarkerAnnotation;
