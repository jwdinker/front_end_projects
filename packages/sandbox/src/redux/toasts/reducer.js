import { handleActions } from 'redux-actions';
import produce from 'immer';
import initialState from './initial_state';

const reducer = handleActions(
  {
    ADD_TOAST_TO_QUEUE: produce((draft, { payload }) => {
      draft.queue[payload.timestamp] = payload;
    }),
    REMOVE_TOAST_FROM_QUEUE: produce((draft, { payload: { timestamp } }) => {
      delete draft.queue[timestamp];
    }),
  },
  initialState
);

export default reducer;
