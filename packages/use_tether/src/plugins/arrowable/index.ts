import { ArrowableReturn, Arrowable } from '../../types';
import { ARROW_ROTATIONS } from '../../constants';
import inferAlignment from '../../helpers/infer_alignment';

/*  
To avoid using transform origin and account for different arrow sizes, The
shaded arrow (represented  by *) is accounted for based on the default transform
origin of [50%,50%].  This is dependent on horizontal alignment and is stored in
the rotation offset.  The midpoint of the arrow height and width are subtracted
and the remaining values are used. It's important to note, these will be
different based on whether boundingClientRect or just plan offsets are used
because the dimensions returned from getBoundingClientRect factors in the
transform.
    ___________
***|           |
***|           |
_________^________
|       /X\      |    
|      / X \     |
|_____/     \____|
   |           |
   |___________|
*/

const arrowable: Arrowable = (tetherables, anchor) => {
  const alignment = inferAlignment(anchor, tetherables[0]);
  const isLeft = alignment === 'left';
  const isRight = alignment === 'right';
  const isHorizontallyAligned = isLeft || isRight;
  const key = alignment === 'top' || alignment === 'bottom' ? 'top' : 'left';
  const arrow = tetherables[0];

  let rectangleOffset = 0;
  let rotationOffset = 0;

  if (isRight) {
    rectangleOffset = arrow.height - arrow.width;
    rotationOffset = arrow.width / 2 - arrow.height / 2;
  }
  if (isLeft) {
    rectangleOffset = arrow.width - arrow.height;
    rotationOffset = arrow.height / 2 - arrow.width / 2;
  }

  const offsetWithArrow = {
    ...tetherables[0],
    rotate: ARROW_ROTATIONS[alignment],
    [key]: isHorizontallyAligned ? arrow[key] - rotationOffset : arrow[key],
  };

  const updated: ArrowableReturn = [offsetWithArrow];
  for (let i = 1; i < tetherables.length; i += 1) {
    const offset = tetherables[i];
    updated.push({
      ...offset,
      [key]: isHorizontallyAligned ? offset[key] + rectangleOffset : offset[key],
    });
  }

  return updated;
};

export default arrowable;
