import React from 'react';
import { withTheme } from 'styled-components';
import Ratio from './ratio';
import Absolute from './absolute';

function Triangle({ theme: { colors }, fill }) {
  const _fill = fill.split('.').reduce((o, i) => o[i], colors);

  return (
    <Ratio ratio="71%">
      <Absolute height="100%" width="100%" top={0} left={0}>
        <svg width="100%" viewBox="0 0 42 30" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M18.542 1.382c1.195-1.843 3.721-1.843 4.916 0L38.696 24.9c1.392 2.148-.03 5.1-2.458 5.1H5.762c-2.427 0-3.85-2.952-2.458-5.1L18.542 1.382z"
            fill={_fill}
          />
          <path d="M5.25 21.897L42 30H0l5.25-8.103z" fill={_fill} />
          <path d="M36.75 21.897L0 30h42l-5.25-8.103z" fill={_fill} />
        </svg>
      </Absolute>
    </Ratio>
  );
}

Triangle.defaultProps = {
  fill: 'white',
};

export default withTheme(Triangle);
