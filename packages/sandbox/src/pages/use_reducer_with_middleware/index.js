import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Row,
  Text,
  Centered,
  Fixed,
  Absolute,
  Relative,
  Button,
  Column,
  Flex,
} from '@jwdinker/styled-system';
import useReducerWithMiddleware, {
  logger,
  interjector,
} from '@jwdinker/use-reducer-with-middleware';
import { withCoreProviders } from '../../hocs';

const addOne = () => ({
  type: 'ADD_ONE',
});

const add = (amount) => ({
  type: 'ADD',
  payload: {
    amount,
  },
});

const subOne = () => ({
  type: 'SUB_ONE',
});

const setPhase = (phase) => ({
  type: 'SET_PHASE',
  payload: {
    phase,
  },
});

const initialState = {
  phase: 'none',
  count: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_ONE': {
      return {
        ...state,
        count: state.count + 1,
      };
    }
    case 'SUB_ONE': {
      return {
        ...state,
        count: state.count - 1,
      };
    }
    case 'ADD': {
      return {
        ...state,
        count: state.count + action.payload.amount,
      };
    }
    case 'SET_PHASE': {
      return {
        ...state,
        phase: action.payload.phase,
      };
    }
    default: {
      return state;
    }
  }
};

const middleware = [interjector, logger];

function Index() {
  const [state, dispatch, subscribe] = useReducerWithMiddleware(reducer, initialState, middleware);

  const handleSubscription = useCallback((nextState) => {
    console.log('Subscription Fired:', nextState);
  }, []);

  useEffect(() => {
    console.log(
      '%c\n\n RERENDERED \n -------------- \n',
      'background:green;color:white;font-weight:bold;',
      JSON.stringify(state, null, 2)
    );
  }, [state]);

  useEffect(() => {
    subscribe(handleSubscription);
  }, [handleSubscription, subscribe]);
  return (
    <Box height="100vh" width={1}>
      <Column height="100%" width={1}>
        <Absolute width={1}>
          <Centered flex={1} width={1}>
            <Button
              style={{ background: 'blue', color: 'white' }}
              p={3}
              onClick={() => {
                dispatch(addOne());
              }}>
              add
            </Button>

            <Button
              style={{ background: 'red' }}
              p={3}
              onClick={() => {
                dispatch(subOne());
              }}>
              subtract
            </Button>
          </Centered>
        </Absolute>
        <Centered flex={9} width={1}>
          <Text fontSize="50px" fontWeight="bold">
            {state.count}
          </Text>
        </Centered>
      </Column>
    </Box>
  );
}

export default withCoreProviders(Index);
