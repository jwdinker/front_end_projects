import styled, { withTheme } from 'styled-components';
import { typography, fluidTypography } from '../css';

const Text = styled('div')`
  ${typography}
  ${fluidTypography}
`;

export default withTheme(Text);
