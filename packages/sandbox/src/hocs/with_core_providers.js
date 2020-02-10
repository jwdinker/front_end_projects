import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Box, InputGroup, Input, Column, Row, Text, NormalizeStyle } from '@jwdinker/styled-system';
import { primary } from '../themes';
import Redux from '../redux';
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
