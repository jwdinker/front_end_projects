import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  useMemo,
  Children,
  useCallback,
  forwardRef,
} from 'react';
import useWindowSize from '@jwdinker/use-window-size';
import {
  Box,
  Centered,
  Column,
  Text,
  Row,
  Absolute,
  Relative,
  Button,
  Triangle,
} from '@jwdinker/styled-system';
import useBlockScroll from '@jwdinker/use-block-scroll';
import useDimensionsList from '@jwdinker/use-dimensions-list';
import upTo from '@jwdinker/up-to';

import useToggle from '@jwdinker/use-toggle';

import { withCoreProviders } from '../../hocs';

function Index() {
  const refs = useRef([]);

  const [state, setState] = useState([0, 1]);
  const [grow, { toggle }] = useToggle();

  const onClick = useCallback(() => {
    setState((previous) => {
      const numberOfItems = previous.length;
      if (previous.length === 0) {
        return [0, 1];
      }
      return previous.filter((_, index) => index !== numberOfItems - 1);
    });
  }, []);

  const add = useCallback(() => {
    setState((previous) => {
      return previous.concat(previous.length);
    });
  }, []);

  const setRef = useCallback((ref) => {
    refs.current.push(ref);
  }, []);

  const numberOfItems = state.length;

  const [dimensions, remeasure] = useDimensionsList(refs.current);

  console.log('DIMENSIONS: ', dimensions);

  return (
    <Box height="100vh" width="100vw" bg="black">
      <Absolute zIndex={999} right={0}>
        <Button onClick={onClick}>
          <Text color="white">
            {numberOfItems === 0 ? 'add items' : `remove index ${numberOfItems - 1}`}
          </Text>
        </Button>
        <Button
          onClick={() => {
            remeasure(1);
          }}>
          <Text color="white">remeasure</Text>
        </Button>
        <Button onClick={toggle}>
          <Text color="white">grow</Text>
        </Button>
      </Absolute>
      {state.map((key) => {
        return (
          <Box
            key={key}
            height="50%"
            width={key === 1 && grow ? '400px' : 1}
            bg={`blue.${key + 1 * 2}`}
            ref={setRef}>
            {key}
          </Box>
        );
      })}
    </Box>
  );
}

const Page = withCoreProviders(Index);

Page.displayName = 'Dropdown';
export default Page;
