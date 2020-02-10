import { TRIANGLE_ROTATIONS } from './constants';
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

/*
 *-----------------------------------------------------------------------------
 *  makeOffsets
 *-----------------------------------------------------------------------------
 *  Generates the offsets for the popover, triangle and creates the total
 *  offsets of the popover with the triangle measurements included.
 *
 */
function makeOffsets(props) {
  return (alignment) => {
    return {
      popover: styles.popover[alignment](props),
      triangle: styles.triangle[alignment](props),
    };
  };
}

export default makeOffsets;
