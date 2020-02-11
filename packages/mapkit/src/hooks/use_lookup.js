import { useInstance } from '../internal';

function useGeocoder(props) {
  const { Coordinate, CoordinateSpan, CoordinateRegion, Geocoder } = window.mapkit;
  const geocoder = useInstance(() => new Geocoder(props));

  function getLookUpOptions(options) {
    if (!options) {
      return null;
    }

    const { coordinate, language, limitToCountries, region } = options;

    const _coordinate = coordinate ? new Coordinate(...coordinate) : null;
    const _language = language ? language : null;
    const _limitToCountries = limitToCountries ? limitToCountries : '';
    const _region = region
      ? new CoordinateRegion(new Coordinate(...region.center), new CoordinateSpan(...region.span))
      : null;
    return {
      coordinate: _coordinate,
      language: _language,
      limitToCountries: _limitToCountries,
      region: _region,
    };
  }

  function lookup(place, options = null) {
    return new Promise((resolve, reject) => {
      geocoder.lookup(
        place,
        (error, data) => {
          if (error) {
            return reject(error);
          }

          resolve(data);
        },
        getLookUpOptions(options)
      );
    });
  }

  function reverseLookup(coordinate, options = { language: null }) {
    return new Promise((resolve, reject) => {
      geocoder.reverseLookup(
        new Coordinate(...coordinate),
        (error, data) => {
          if (error) {
            return reject(error);
          }

          resolve(data);
        },
        options
      );
    });
  }

  return {
    byAddress: lookup,
    byCoordinate: reverseLookup,
    cancel: geocoder.cancel,
  };
}

export default useGeocoder;
