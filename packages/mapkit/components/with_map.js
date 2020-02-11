import React from 'react';
import MapProvider from './map_provider';

function withMap(Component) {
  return function MapProviderWrapper(props) {
    return (
      <MapProvider>
        <Component {...props} />
      </MapProvider>
    );
  };
}

export default withMap;
