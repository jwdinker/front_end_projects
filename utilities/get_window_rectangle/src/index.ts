const INITIAL_MEASUREMENTS = {
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  height: 0,
  width: 0,
};

export interface WindowRectangle {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
}

const getWindowRectangle = (): WindowRectangle => {
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
  return INITIAL_MEASUREMENTS;
};

export default getWindowRectangle;
