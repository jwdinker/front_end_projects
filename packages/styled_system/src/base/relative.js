import styled, { withTheme } from 'styled-components';
import { relative } from '../css';

const Relative = styled('div')`
  ${relative}
`;

export default withTheme(Relative);
