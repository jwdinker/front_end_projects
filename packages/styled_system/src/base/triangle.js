import React from 'react';
import { withTheme } from 'styled-components';

function Triangle({ theme: { colors }, fill }) {
  const _fill = fill.split('.').reduce((o, i) => o[i], colors);

  return (
    <svg width="100%" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.18.46a.959.959 0 0 1 1.64 0l5.079 7.84c.464.716-.01 1.7-.82 1.7H1.921c-.81 0-1.284-.984-.82-1.7L6.181.46z"
        fill={_fill}
      />
      <path d="M1.75 7.3L14 10H0l1.75-2.7z" fill={_fill} />
      <path d="M12.25 7.3L0 10h14l-1.75-2.7z" fill={_fill} />
    </svg>
  );
}

Triangle.defaultProps = {
  fill: 'black',
};

export default withTheme(Triangle);
