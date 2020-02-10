import { css } from 'styled-components';
import {
  space,
  color,
  layout,
  background,
  position,
  flexbox,
  border,
  shadow,
  compose,
} from 'styled-system';
import overflow from './overflow';

const box = css`
  box-sizing: border-box;
  ${compose(
    overflow,
    position,
    layout,
    background,
    flexbox,
    space,
    color,
    border,
    shadow,
    overflow
  )}
`;

export default box;
