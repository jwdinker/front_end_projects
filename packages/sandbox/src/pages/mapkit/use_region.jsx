import React, { useRef, useEffect, useState } from 'react';
import {
  withMap,
  useMap,
  useMapkitListener,
  useGeocoder,
  useRegion,
} from '@jwdinker/react-mapkitjs';
import { RatioMap } from '../../components';
import { withCoreProviders } from '../../hocs';

function UseRegionExample() {
  const ref = useRef();
  const [coordinates, setCoordinates] = useState([0, 0]);

  const { lookup } = useGeocoder();

  useRegion({
    center: coordinates,
    span: [0.01, 0.1],
    animate: true,
  });

  useMap(ref);

  useEffect(() => {
    const getRegion = async () => {
      try {
        const [
          {
            coordinate: { latitude, longitude },
          },
        ] = await lookup('nashville, tn');
        setCoordinates([latitude, longitude]);
      } catch (error) {
        console.log('Error finding nashville');
      }
    };
    if (coordinates.every((c) => c === 0)) {
      getRegion();
    }
  }, [coordinates, lookup]);

  return <RatioMap ref={ref} />;
}

export default withCoreProviders(withMap(UseRegionExample));
