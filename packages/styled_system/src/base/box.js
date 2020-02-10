import styled, { withTheme } from 'styled-components';
import { box } from '../css';

const Box = styled('div')`
  ${box}
`;

export default withTheme(Box);
