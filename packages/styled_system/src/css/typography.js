import { typography, system, compose, layout, space } from 'styled-system';
import box from './box';
import { whiteSpace } from './custom';

const color = system({
  color: {
    property: 'color',
    scale: 'colors',
  },
});

const text = compose(space, layout, typography, whiteSpace, color);

export default text;
