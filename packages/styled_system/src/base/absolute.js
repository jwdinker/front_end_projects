import styled, { withTheme } from 'styled-components';
import { absolute } from '../css';

const Absolute = styled('div')`
  ${absolute}
`;

export default withTheme(Absolute);
