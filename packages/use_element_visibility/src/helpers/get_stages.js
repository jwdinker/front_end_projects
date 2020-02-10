import { PRIMARY_SIDES, Y_SIDES } from '../constants';

const STAGES_FROM_DIRECTION = [
  {
    side: 'top_left',
    '1': 'entering',
    '-1': 'exiting',
  },
  {
    side: 'bottom_right',
    '1': 'exiting',
    '-1': 'entering',
  },
];

const getStages = (positions, directions) => {
  const values = {
    entering: [],
    exiting: [],
    overflowing: [],
  };

  for (let i = 0; i < positions.length; i++) {
    const position = positions[i];
    const directionIndex = Y_SIDES.some((side) => side === position) ? 1 : 0;
    const direction = directions[directionIndex];

    if (direction === 0) {
      values.overflowing.push(position);
    } else {
      const stages = STAGES_FROM_DIRECTION.find(({ side }) => side.indexOf(position) > -1);
      const stage = stages[direction];

      values[stage].push(position);
    }
  }

  return values;
};

export default getStages;
