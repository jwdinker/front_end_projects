import styled, { withTheme } from 'styled-components';
import { box } from '../css';

const Box = styled('div')`
  ${box}
`;

Box.defaultProps = {
  position: 'relative',
};

export default withTheme(Box);
