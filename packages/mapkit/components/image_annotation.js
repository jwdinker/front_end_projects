import React from 'react';
import PropTypes from 'prop-types';
import Annotation from './annotation';

function ImageAnnotation(props) {
  return <Annotation {...props} type="image" />;
}

ImageAnnotation.propTypes = {
  url: PropTypes.objectOf((propValue, key, componentName, location, propFullName) => {
    const valueIsString = typeof propValue[key] === 'string';
    const keyIsNumber = key.match(/^[0-9]+$/) != null;
    if (!valueIsString) {
      return new Error(
        `\n\nThere is a problem with the url property of the ${componentName} component. \nThe value supplied to the object key '${key}' must be a string.\n\n`
      );
    }

    if (!keyIsNumber) {
      return new Error(
        `\n\nThere is a problem with the url property of the ${componentName} component.\nThe object key '${key}' is not an integer. \n\n To fix this the key should look something like this: \n\n <ImageAnnotation url={{\n\t1:"path_to_image_1",\n\t2:"path_to_image_2"\n}}>\n\n`
      );
    }
  }).isRequired,
};

export default ImageAnnotation;
