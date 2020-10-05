import * as React from 'react';

export type Dispatch<Action> = (action: Action) => void;

export type GetState<State> = () => State;

export interface Store<State, Action> {
  getState: GetState<State>;
  dispatch: Dispatch<Action>;
}

export type Middleware<State, Action> = (
  store: Store<State, Action>
) => (dispatch: Dispatch<Action>) => (action: Action) => void;

export type SubscriptionCallback<State> = (state: State) => void;

export type Unsubscribe = () => void;

export type Subscribe<State> = (fn: SubscriptionCallback<State>) => Unsubscribe;
