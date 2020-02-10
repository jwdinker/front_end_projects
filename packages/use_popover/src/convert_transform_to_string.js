function convertTransformToString({ translateX, translateY, rotate }) {
  const translateStyle = `translate3d(${translateX}px,${translateY}px,0)`;
  return typeof rotate === 'number' ? `${translateStyle} rotate(${rotate}deg)` : translateStyle;
}

export default convertTransformToString;
