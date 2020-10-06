import { useRef, useEffect, useCallback } from 'react';
import { useInstance } from '../internal';

function useGeocoder({ language = null, getsUserLocation = false } = {}) {
  const geocoder = useInstance(() => {
    const { Geocoder } = window.mapkit;
    return new Geocoder({ language, getsUserLocation });
  });

  const lookup = useCallback(
    (place, options = null) => {
      return new Promise((resolve, reject) => {
        geocoder.lookup(
          place,
          (error, data) => {
            if (!error) {
              resolve(data.results);
            }
            reject(error);
          },
          options
        );
      });
    },
    [geocoder]
  );

  const reverseLookup = useCallback(
    (coordinate, options = null) => {
      return new Promise((resolve, reject) => {
        geocoder.reverseLookup(
          new window.mapkit.Coordinate(...coordinate),
          (error, data) => {
            if (!error) {
              resolve(data.results);
            }

            reject(error);
          },
          options
        );
      });
    },
    [geocoder]
  );

  return {
    lookup,
    reverseLookup,
  };
}

export default useGeocoder;
