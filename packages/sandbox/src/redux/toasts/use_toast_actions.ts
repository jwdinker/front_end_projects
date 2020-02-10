import {
  createActions,
  createAction,
  handleActions,
  handleAction,
  combineActions,
} from 'redux-actions';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';

import { ToastType } from './types';

const ADD_TOAST_TO_QUEUE = 'ADD_TOAST_TO_QUEUE';
const REMOVE_TOAST_FROM_QUEUE = 'REMOVE_TOAST_FROM_QUEUE';

function useToastActions() {
  const dispatch = useDispatch();

  const add = useCallback(
    (payload: ToastType): void => {
      dispatch({
        type: ADD_TOAST_TO_QUEUE,
        payload,
      });
    },
    [dispatch]
  );

  const remove = useCallback(
    (timestamp: number): void => {
      dispatch({
        type: REMOVE_TOAST_FROM_QUEUE,
        payload: {
          timestamp,
        },
      });
    },
    [dispatch]
  );

  return {
    add,
    remove,
  };
}

export const ACTION_NAMES = {
  ADD_TOAST_TO_QUEUE,
  REMOVE_TOAST_FROM_QUEUE,
};

export default useToastActions;
