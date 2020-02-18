function calculateVelocity(distance, startTime, endTime) {
  const denominator = endTime - startTime;
  if (Number.isNaN(denominator) || denominator === 0) {
    return 0;
  }
  return Math.abs(distance / denominator);
}

export default calculateVelocity;
