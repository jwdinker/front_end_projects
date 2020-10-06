import React from 'react';

function ArrowLeft({ fill = '#B1B1B3' }) {
  return (
    <svg width="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30.83 32.67l-9.17-9.17 9.17-9.17L28 11.5l-12 12 12 12 2.83-2.83z" fill={fill} />
    </svg>
  );
}

export default ArrowLeft;
