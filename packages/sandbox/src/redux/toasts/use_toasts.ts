import useToastActions from './use_toast_actions';
import { useMemo } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

import { ToastState } from './types';
import Store from '../store';

const selectToast = (store: Store): ToastState => store.toasts;

function useToasts() {
  const { add, remove } = useToastActions();
  const toasts = useSelector(selectToast);

  const value = useMemo(() => {
    return {
      ...toasts,
      add,
      remove,
    };
  }, [add, remove, toasts]);

  return value;
}

export default useToasts;
