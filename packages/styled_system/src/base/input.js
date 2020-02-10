import React, { useCallback } from 'react';
import styled from 'styled-components';
import { system, border, variant } from 'styled-system';
import { typography, box } from '../css';

const variants = {
  large: {
    height: '40px',
    mx: '8px',
    px: '6px',
    py: '11px',
    fontSize: '16px',
  },
  default: {
    height: '32px',
    mx: '8px',
    px: '4px',
    py: '11px',
    fontSize: '14px',
  },
  small: {
    height: '24px',
    mx: '8px',
    px: '1px',
    py: '7px',
    fontSize: '14px',
  },
};

const placeholder = system({
  placeholderFontWeight: {
    property: 'fontWeight',
    scale: 'fontWeights',
  },
  placeholderColor: {
    property: 'color',
    scale: 'colors',
  },
});

const Input = styled('input')`
  ${box}
  ${typography}
  ${border}
  ${variant({
    variants,
  })}

  :focus {
    box-shadow: none;
    outline: none;
  }
  :active {
    box-shadow: none;
  }

  ::placeholder {
    ${placeholder}
  }
`;

Input.defaultProps = {
  borderRadius: '0%',
  border: 'none',
  variant: 'default',
  maxLength: 524288,
};

export default Input;
