import styled, { withTheme } from 'styled-components';
import { flex } from '../css';

const Flex = styled('div')`
  ${flex}
`;

export default withTheme(Flex);
