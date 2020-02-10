import styled from 'styled-components';
import { box } from '../css';

const Ratio = styled('div')`
  ${box} ::before {
    content: '';
    width: 1px;
    margin-left: -1px;
    float: left;
    height: 0;
    padding-top: ${({ ratio }) => {
      if (!ratio) {
        return '100%';
      }
      return ratio;
    }};
  }

  ::after {
    content: '';
    display: table;
    clear: both;
  }
`;

Ratio.defaultProps = {
  position: 'relative',
};

export default Ratio;
