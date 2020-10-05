import { Store, Dispatch } from './types';

export const interjector = <State, Action>(store: Store<State, Action>) => (
  next: Dispatch<Action>
) => (action: Action) => {
  if (typeof action === 'function') {
    const { dispatch, getState } = store;
    return action(dispatch, getState);
  }

  return next(action);
};

const { info, log } = console;

export const logger = <State, Action>(store: Store<State, Action>) => (next: any) => (
  action: any
) => {
  log('\n\n\n\n\n');
  log('-------------------------------------------------');
  log(
    '%cPrevious State \n -------------- \n',
    'background:#ffe43a;color:#5A440D;font-weight:bold;'
  );
  info(store.getState());

  const result = next(action);

  log(
    '%c\n\n Next State \n -------------- \n',
    'background:#00a1ff;color:#000036;font-weight:bold;'
  );
  info(store.getState());
  log('-------------------------------------------------');
  log('\n\n\n\n\n');

  return result;
};
