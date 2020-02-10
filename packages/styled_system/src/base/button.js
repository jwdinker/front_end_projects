import styled, { withTheme } from 'styled-components';
import { box } from '../css';

const Button = styled('button')`
  ${box}
  touch-action:manipulation;
  cursor: pointer;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  user-select: none;
`;

Button.defaultProps = {
  bg: 'none',
  display: 'inline-block',
  borderRadius: '0%',
  borderColor: 'none',
  position: 'relative',
};

export default withTheme(Button);
