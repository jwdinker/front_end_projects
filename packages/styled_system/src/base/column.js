import styled, { withTheme } from 'styled-components';
import { flex } from '../css';

const Column = styled('div')`
  ${flex}
  flex-direction:column;
`;

Column.defaultProps = {
  flex: 1,
};

export default withTheme(Column);
