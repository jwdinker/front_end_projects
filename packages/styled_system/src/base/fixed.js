import styled, { withTheme } from 'styled-components';
import { fixed } from '../css';

const Fixed = styled('div')`
  ${fixed}
`;

export default withTheme(Fixed);
