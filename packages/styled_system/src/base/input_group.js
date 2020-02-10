import React from 'react';
import styled from 'styled-components';
import Flex from './flex';

const InputGroup = styled(Flex)`
  > input {
    flex: 1;
  }
`;

InputGroup.defaultProps = {
  width: '100%',
};

export default InputGroup;
