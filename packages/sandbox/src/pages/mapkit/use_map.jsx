import React, { useRef, useEffect } from 'react';
import { withMap, useMap, useMapkitListener, useGeocoder } from '@jwdinker/react-mapkitjs';
import { Box, Relative, Absolute } from '@jwdinker/styled-system';
import { RatioMap } from '../../components';
import { withCoreProviders } from '../../hocs';

function MyUseMapComponent() {
  const ref = useRef();

  console.log('HERE');

  // useMapkitListener({
  //   onError: (error) => {
  //     console.log('%cMapkit Initialization Failure: ', 'background:red;color:white;', error);
  //   },
  //   onConfigurationChange: (event) => {
  //     console.log('%cMapkit Initialized: ', 'background:green;color:white;', event);
  //   },
  // });

  useMapkitListener({
    onError: (error) => {
      console.log(
        '\n\n%cMapkit Initialization Failure: ',
        'background:red;color:white;',
        error,
        '\n\n'
      );
    },
    onInitialization: (event) => {
      console.log('\n\n%cMapkit Initialized: ', 'background:green;color:white;', event, '\n\n');
    },
  });

  useMap(ref);

  return (
    <Box width={1} maxWidth="700px">
      <Relative
        height="0px"
        width="100%"
        pt="66%"
        overflow="hidden"
        borderRadius="16px"
        boxShadow="0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)">
        <Absolute ref={ref} top={0} left={0} height="100%" width="100%" />
      </Relative>
    </Box>
  );
  // return <RatioMap ref={ref} />;
}

export default withCoreProviders(withMap(MyUseMapComponent));
