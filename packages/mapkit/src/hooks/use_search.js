import { useMemo } from 'react';

function useAutocomplete({ language = null, center = null, span = null } = {}) {
  const { CoordinateRegion, Coordinate, CoordinateSpan, Search } = mapkit;

  const _search = useMemo(() => {
    const isRegion = !!center && !!span;
    const region = isRegion ? new CoordinateRegion(new Coordinate(...center), new CoordinateSpan(...span)) : null;

    const isCoordinate = !!center && !isRegion;

    const coordinate = isCoordinate ? new Coordinate(...center) : null;

    return new Search({
      coordinate,
      language,
      region,
    });
  }, [Coordinate, CoordinateRegion, CoordinateSpan, Search, center, language, span]);

  const autocomplete = (value) => {
    if (value.length > 0) {
      return new Promise((resolve, reject) => {
        _search.autocomplete(value, (error, data) => {
          if (!error) {
            resolve(data);
          }

          reject(error);
        });
      });
    }
    return [];
  };

  const search = (value) => {
    const canSearch = typeof value === 'object' || (typeof value === 'string' && value.length > 0);
    if (canSearch) {
      return new Promise((resolve, reject) => {
        _search.search(value, (error, data) => {
          if (!error) {
            resolve(data);
          }

          reject(error);
        });
      });
    }
    return [];
  };

  return { search, autocomplete };
}

export default useAutocomplete;
