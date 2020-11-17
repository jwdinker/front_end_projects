import React from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';
import { NormalizeStyle } from '@jwdinker/styled-system';

import { Mapkit } from '@jwdinker/react-mapkitjs';

// import { NextPage } from 'next';

import { primary } from '../themes';

const GlobalStyle = createGlobalStyle`
body {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
`;

function withCoreProviders(Component) {
  return function CoreProviders(props) {
    return (
      <ThemeProvider theme={primary}>
        {/* <Mapkit
            handleAuthorization={(done) => {
              fetch('https://192.168.1.4:8000/jwt/mapkit')
                .then((response) => response.json())
                .then(({ token }) => done(token));
            }}
          /> */}
        <Component {...props} />

        <NormalizeStyle />
        <GlobalStyle />
      </ThemeProvider>
    );
  };
}

export default withCoreProviders;
