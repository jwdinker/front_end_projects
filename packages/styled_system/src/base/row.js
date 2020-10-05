import styled, { withTheme } from 'styled-components';
import { flex } from '../css';

const Row = styled('div')`
  ${flex}
`;

Row.defaultProps = {
  flex: 1,
  position: 'relative',
};

export default withTheme(Row);
