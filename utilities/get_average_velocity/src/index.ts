const getAverageVelocity = (displacement: number, changeInTime: number): number => {
  if (Number.isNaN(changeInTime) || changeInTime === 0) {
    return 0;
  }

  return Math.abs(displacement / changeInTime);
};

export default getAverageVelocity;
