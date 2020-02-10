import { typography, system, compose } from 'styled-system';
import box from './box';
import { whiteSpace } from './custom';

const color = system({
  color: {
    property: 'color',
    scale: 'colors',
  },
});

const text = compose(
  box,
  typography,
  whiteSpace,
  color
);

export default text;
