import styled, { withTheme } from 'styled-components';
import { box } from '../css';

const Label = styled('label')`
  ${box}
`;

export default withTheme(Label);
