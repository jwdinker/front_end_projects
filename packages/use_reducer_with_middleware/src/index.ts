import * as React from 'react';

import { Middleware, Store, Dispatch, SubscriptionCallback, Subscribe } from './types';

const { useRef, useCallback, useMemo, useState } = React;

export { interjector, logger } from './utilities';

export { Dispatch, Middleware, Store, GetState } from './types';

const compose = <V>(...fns: Array<(value: V) => V>) => (value: V) =>
  fns.reduceRight((prevValue, fn) => fn(prevValue), value);

function useReducerWithMiddleware<State, Action>(
  reducer: React.Reducer<State, Action>,
  initialState: State,
  middlewares: Middleware<State, Action>[] = []
): [State, Dispatch<Action>, Subscribe<State>] {
  const state = useRef(initialState);
  const [_, setState] = useState(initialState);
  const subscribers = useRef<SubscriptionCallback<State>[]>([]);

  const subscribe = useCallback(
    (fn: SubscriptionCallback<State>) => {
      subscribers.current.push(fn);
      return () => {
        const index = subscribers.current.indexOf(fn, 0);
        subscribers.current.splice(index, 1);
      };
    },
    [subscribers]
  );

  const getState = useCallback(() => {
    return state.current;
  }, []);

  const forward = useCallback(
    (action) => {
      state.current = reducer(state.current, action);
      setState(state.current);
      subscribers.current.forEach((subscriber) => {
        subscriber(state.current);
      });
      return action;
    },
    [reducer]
  );

  const dispatch = useMemo(() => {
    let _dispatch: Dispatch<Action> = () => {};

    const store: Store<State, Action> = {
      getState,
      dispatch: (...args: [Action]) => _dispatch(...args),
    };

    const chain = middlewares.map((middleware) => middleware(store));

    _dispatch = compose<typeof dispatch>(...chain)(forward);
    return _dispatch;
  }, [forward, getState, middlewares]);

  return [state.current, dispatch, subscribe];
}

export default useReducerWithMiddleware;
