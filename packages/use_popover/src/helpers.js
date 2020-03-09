import { OPPOSITES, SHARED_STYLES, TRIANGLE_ROTATIONS, SIDES } from './constants';

export const adjustForViewport = (element, scroll, operator = 1) => {
  const { height, width } = element;
  const top = element.top + scroll.top * operator;
  const left = element.left + scroll.left * operator;
  return {
    height,
    width,
    top,
    left,
    bottom: top + height,
    right: left + width,
  };
};

export const getOverflowingSides = (element, boundaries) => {
  const intersecting = {};
  for (let index = 0; index <= SIDES.length - 1; index += 1) {
    const side = SIDES[index];
    const opposite = OPPOSITES[side];

    const isIntersecting =
      index % 2 === 0
        ? element[side] <= boundaries[side] || element[opposite] <= boundaries[side]
        : element[side] >= boundaries[side] || element[opposite] >= boundaries[side];

    if (isIntersecting) {
      intersecting[side] = true;
    } else {
      intersecting[side] = false;
    }
  }
  return intersecting;
};

export const getOffsetTotal = (alignment, popover, triangle) => {
  const operator = alignment === 'top' || alignment === 'left' ? 1 : -1;
  const oppositeSide = OPPOSITES[alignment];
  const dimensionType = alignment === 'top' || alignment === 'bottom' ? 'height' : 'width';

  // The triangle height is either added or substracted to the popover offset
  // opposite the current alignment
  return {
    ...popover,
    [oppositeSide]: popover[oppositeSide] + triangle.height * operator,
    [dimensionType]: popover[dimensionType] + triangle.height,
  };
};

export const convertTransformToString = ({ translateX, translateY, rotate }) => {
  const translateStyle = `translate3d(${translateX}px,${translateY}px,0)`;
  return typeof rotate === 'number' ? `${translateStyle} rotate(${rotate}deg)` : translateStyle;
};

export const formatStyles = ({ popover, triangle }) => {
  return {
    popover: {
      ...SHARED_STYLES,
      transform: {
        translateX: popover.left,
        translateY: popover.top,
      },
    },
    triangle: {
      ...SHARED_STYLES,
      transform: {
        translateX: triangle.left,
        translateY: triangle.top,
        rotate: triangle.rotate,
      },
    },
  };
};

/*
 *-----------------------------------------------------------------------------
 * styles
 *-----------------------------------------------------------------------------
 * While it is possible to get fancy here and condense all these styles to a
 * fraction of the size using common properties, I found that every time I went
 * back and looked at it, I was spending too much time trying to figure out what
 * the hell was actually going on, I felt it best to go for readability and be
 * specific for each style.
 */
const styles = {
  popover: {
    top: ({ element, popover, triangle }) => {
      const left = element.left + popover.width - Math.abs(element.width - popover.width) / 2;
      const top = element.top - triangle.height - popover.height;
      return {
        top,
        bottom: top + popover.height,
        left,
        right: left + popover.width,
        ...popover,
      };
    },
    bottom: ({ element, popover, triangle }) => {
      const left = element.left + popover.width - Math.abs(element.width - popover.width) / 2;
      const top = element.bottom + triangle.height;
      return {
        top,
        left,
        bottom: top + popover.height,
        right: left + popover.width,
        ...popover,
      };
    },
    left: ({ element, popover, triangle }) => {
      const center = element.top + Math.abs(element.height - popover.height) / 2;
      const left = element.left - triangle.height - popover.width;
      return {
        top: center,
        bottom: center + popover.height,
        left,
        right: left + popover.width,
        ...popover,
      };
    },
    right: ({ element, popover, triangle }) => {
      const center = element.top + Math.abs(element.height - popover.height) / 2;
      const left = element.right + triangle.height;
      return {
        top: center,
        bottom: center + popover.height,
        left,
        right: left + popover.width,
        ...popover,
      };
    },
  },
  triangle: {
    top: ({ element, triangle }) => {
      const center = element.left + element.width / 2 - triangle.width / 2;
      return {
        top: element.top - triangle.height,
        bottom: element.top,
        left: center,
        right: center + triangle.width,
        rotate: TRIANGLE_ROTATIONS.top,
        ...triangle,
      };
    },
    bottom: ({ element, triangle }) => {
      const center = element.left + element.width / 2 - triangle.width / 2;
      return {
        top: element.bottom,
        bottom: element.bottom - triangle.height,
        left: center,
        right: center + triangle.width,
        rotate: TRIANGLE_ROTATIONS.bottom,
        ...triangle,
      };
    },
    left: ({ element, triangle }) => {
      const top = element.top + element.height / 2 - triangle.height / 2;
      const left = element.left - triangle.width / 2 - triangle.height / 2;
      return {
        top,
        bottom: top - triangle.width,
        left,
        right: left + triangle.height,
        rotate: TRIANGLE_ROTATIONS.left,
        ...triangle,
      };
    },
    right: ({ element, triangle }) => {
      const top = element.top + element.height / 2 - triangle.height / 2;
      const left = element.right - triangle.width / 2 + triangle.height / 2;
      return {
        top,
        bottom: top - triangle.width,
        left,
        right: left + triangle.height,
        rotate: TRIANGLE_ROTATIONS.right,
        ...triangle,
      };
    },
  },
};

export const getOffsetPerimeter = (element, popover, triangle) => {
  const { top, left, bottom, right } = element;
  const height = triangle.height + popover.height;
  const width = triangle.height + popover.width;
  return {
    top: top - height,
    left: left - width,
    right: right + width,
    bottom: bottom + height,
  };
};

/*
 *-----------------------------------------------------------------------------
 *  getOffsets
 *-----------------------------------------------------------------------------
 *  Generates the offsets for the popover, triangle and perimeter and creates the total
 *  offsets of the popover with the triangle measurements included.
 *
 */
export const getOffsets = (alignment, measurements) => {
  const popover = styles.popover[alignment](measurements);
  const triangle = styles.triangle[alignment](measurements);
  const { element } = measurements;
  return {
    element,
    popover,
    triangle,
    perimeter: getOffsetPerimeter(element, popover, triangle),
    total: getOffsetTotal(alignment, popover, triangle),
  };
};

const makeHasChanged = (props) => (previous, current) =>
  props.some((prop) => previous[prop] !== current[prop]);

export const hasSidesChanged = makeHasChanged(SIDES);
