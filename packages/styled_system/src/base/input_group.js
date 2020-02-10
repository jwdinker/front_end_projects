import React from 'react';
import Flex from './flex';
import styled from 'styled-components';

const InputGroup = styled(Flex)`
  > input {
    flex: 1;
  }
`;

InputGroup.defaultProps = {
  width: '100%',
};

export default InputGroup;
