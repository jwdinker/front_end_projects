export interface ToastType {
  type: string;
  name?: string;
  message: string;
  timestamp: number;
  duration: number | undefined;
}

export interface ToastState {
  queue: { [key: string]: ToastType };
}

export const ADD_TOAST_TO_QUEUE = 'ADD_TOAST_TO_QUEUE';
export const REMOVE_TOAST_FROM_QUEUE = 'REMOVE_TOAST_FROM_QUEUE';

export interface AddToastToQueueAction {
  type: typeof ADD_TOAST_TO_QUEUE;
  payload: ToastType;
}
export interface RemoveToastFromQueueAction {
  type: typeof REMOVE_TOAST_FROM_QUEUE;
  payload: {
    timestamp: number;
  };
}

export type ToastActionTypes = AddToastToQueueAction | RemoveToastFromQueueAction;
