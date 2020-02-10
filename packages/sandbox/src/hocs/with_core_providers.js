import Redux from '../redux';
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { primary } from '../themes';
import { Box, InputGroup, Input, Column, Row, Text, NormalizeStyle } from '@jwdinker/styled-system';
import { Menu } from '../components';
import { GlobalStyle } from '../css';

function withCoreProviders(Component) {
  return function CoreProviders(props) {
    return (
      <>
        <Redux>
          <ThemeProvider theme={primary}>
            <Component {...props} />
            <NormalizeStyle />
          </ThemeProvider>
        </Redux>
      </>
    );
  };
}

export default withCoreProviders;
