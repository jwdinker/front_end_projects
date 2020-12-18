import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Box, Centered, Text, Absolute, Row } from '@jwdinker/styled-system';

import useVirtualList, { areEqual } from '@jwdinker/use-virtual-list';
import useDebouncedCallback from '@jwdinker/use-debounce-callback';
import usePrevious from '@jwdinker/use-previous';
import useSize from '@jwdinker/use-size';
import upTo from '@jwdinker/up-to';
import getRandomColor from '@jwdinker/get-random-color';
import getRandomNumberInRange from '@jwdinker/get-random-number-in-range';

import { withCoreProviders } from '../../hocs';

const NUMBER_OF_ITEMS = 10000;

const BACKGROUND_COLORS = upTo(0, NUMBER_OF_ITEMS - 1, () => {
  return getRandomColor();
});
const MyComponent = (props) => {
  const { style, index } = props;

  return (
    <Box bg={BACKGROUND_COLORS[index]} border="1px solid" style={style}>
      <Centered width={1} height="100%">
        <Text fontSizeFluid={['25px', '75px']}>{index}</Text>
      </Centered>
    </Box>
  );
};

const MemoizedComponent = React.memo(MyComponent, areEqual);

const inputStyle = {
  color: 'white',
  fontSize: '20px',
  fontWeight: '700',
  outline: 'none',
  borderRadius: '8px',
  border: 'none',
  width: '100%',
  maxWidth: '50px',
  minWidth: '0px',
  textAlign: 'center',
  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1),0 4px 6px -2px rgba(0,0,0,0.05)',
  background: '#202a37',
  padding: '10px',
};

const axis = 'y';
const dimension = axis === 'y' ? 'height' : 'width';

function VirtualList({ submittedIndex, handleChange, inputIndex }) {
  const container = useRef();
  const [sizing] = useSize(container);

  const previouslySubmittedIndex = usePrevious(submittedIndex);
  const containerSize = sizing[dimension];

  const [items, { scroller, spacer, indexes, scrollToIndex, scroll }] = useVirtualList({
    component: MemoizedComponent,
    itemSize: () => {
      return getRandomNumberInRange(10, 60);
    },
    axis,
    responsive: true,
    numberOfItems: NUMBER_OF_ITEMS,
    estimatedItemSize: 50,
    containerSize,
    hasActiveScroll: true,
    buffer: 3,
  });

  const debounceResize = useDebouncedCallback(() => {
    scrollToIndex(submittedIndex, { alignment: 'start', behavior: 'auto' });
  }, 300);

  useEffect(() => {
    if (previouslySubmittedIndex !== submittedIndex) {
      scrollToIndex(submittedIndex, {
        alignment: 'start',
        duration: 1000,
        easing: 'easeInOutCubic',
      });
    }
  }, [previouslySubmittedIndex, scroll.isScrolling, scrollToIndex, submittedIndex]);

  useEffect(() => {
    const handleResize = () => {
      debounceResize();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [debounceResize]);

  const [startIndex, endIndex] = indexes.visible;

  return (
    <>
      <Absolute
        p="2%"
        zIndex={1}
        borderRadius="8px"
        bg="white"
        right="2%"
        top="2%"
        display="flex"
        flexDirection="column"
        boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)">
        <Text>{`indexes: ${startIndex} -> ${endIndex}`}</Text>

        <Row>
          <Text>Go To:</Text>
          <input maxLength={5} style={inputStyle} onChange={handleChange} value={inputIndex} />
        </Row>
      </Absolute>
      <Box height="100%" width={1} border="solid 1px">
        <Box ref={container} height="100%" width={1}>
          <div ref={scroller.ref} style={scroller.style}>
            {items}
            <div style={spacer.style} />
          </div>
        </Box>
      </Box>
    </>
  );
}

function Index() {
  const [currentIndex, setIndex] = useState(0);

  const handleChange = useCallback((event) => {
    const {
      target: { value },
    } = event;

    if (!Number.isNaN(value)) {
      const min = Math.max(0, value);
      const max = Math.min(value, NUMBER_OF_ITEMS - 1);
      setIndex(max);
    }
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.which === 40) {
        event.preventDefault();
        setIndex((previous) => {
          return Math.min(previous + 1, NUMBER_OF_ITEMS);
        });
      }
      if (event.which === 38) {
        event.preventDefault();
        setIndex((previous) => {
          return Math.max(0, previous - 1);
        });
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <Box height="100vh" width={1}>
      <Box height="100%" width={1} border="solid 1px">
        <VirtualList
          inputIndex={currentIndex}
          handleChange={handleChange}
          submittedIndex={currentIndex}
        />
      </Box>
    </Box>
  );
}

const Page = withCoreProviders(Index);
export default Page;
