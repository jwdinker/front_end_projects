function getWindowMeasurements() {
  if (typeof window !== 'undefined') {
    const width =
      window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const height =
      window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    return {
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
    };
  }
  return {
    height: 0,
    width: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };
}

export default getWindowMeasurements;
