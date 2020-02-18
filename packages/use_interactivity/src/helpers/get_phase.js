import { PHASES } from '../constants';

function getPhase(wasActive, isActive) {
  if (!wasActive && isActive) return PHASES.START;

  if (wasActive && isActive) return PHASES.MOVE;

  if (wasActive && !isActive) return PHASES.END;

  return PHASES.NONE;
}

export default getPhase;
