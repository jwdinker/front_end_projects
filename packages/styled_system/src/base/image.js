import styled, { withTheme } from 'styled-components';
import { box } from '../css';

const Image = styled('img')`
  ${box}
  ${({ disableDrag }) => {
    if (disableDrag) {
      return `user-drag: none;`;
    }
    return '';
  }}
`;

Image.defaultProps = {
  m: 0,
  src: '',
  width: 1,
  height: 'auto',
  maxWidth: '100%',
  disableDrag: false,
};

export default withTheme(Image);
