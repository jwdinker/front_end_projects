import React, {
  useRef,
  useMemo,
  createElement,
  useEffect,
  useCallback,
  memo,
  useState,
} from 'react';
import { Box, Centered, Text, Absolute, Relative, Button } from '@jwdinker/styled-system';
import useMeasurementsIndexer from '@jwdinker/use-measurements-indexer';
import upTo from '@jwdinker/up-to';
import { useSpring, animated } from 'react-spring';
import useWindowSize from '@jwdinker/use-window-size';
import useDrag from '@jwdinker/use-drag';


import { withCoreProviders } from '../../hocs';

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const MyComponent = ({ style, index }) => {
  return (
    <Box style={style}>
      <Centered width={1} height="100%">
        <Text fontSizeFluid={['25px', '75px']}>{index}</Text>
      </Centered>
    </Box>
  );
};

const MemoizedComponent = memo(MyComponent, () => true);

const axis = 0;

function Index() {
  const container = useRef();
  const dragger = useRef();
  const cachedProps = useRef({});

  const [_window, hasSizeChanged] = useWindowSize();

  const getSize = (index) => {
    return randomIntFromInterval(100, 800);
  };

  const saveProps = useCallback((index, { size, offset }) => {
    cachedProps.current[index] = {
      key: index,
      index,
      style: {
        position: 'absolute',
        width: `${size}px`,
        height: '100%',
        left: `${offset}px`,
        background: getRandomColor(),
      },
    };
  }, []);

  const drag = useDrag(container, {
    mouse: true,
    canDrag: (state) => {
      const { xy } = state;
      const coordinate = xy[axis];
      return coordinate <= 0;
    },
  });

  console.log('DRAG: ', JSON.stringify(drag, null, 2));

  const {
    phase,
    xy,
    direction,
    move,
    coordinates: { origin, initial },
  } = drag;

  const {
    clear,
    getIndexRangeFromOffsets,
    getMeasurements,
    getTotalSizeOfItems,
    findIndexAtOffset,
  } = useMeasurementsIndexer({
    itemSize: 400,
    onMeasure: saveProps,
    log: true,
    boundaries: [0, 100],
  });

  const coordinate = xy[axis];
  const canRender = _window.width !== 0;

  const [index, setIndex] = useState(0);
  const [offset, setOffset] = useState(0);

  const indexes = canRender
    ? getIndexRangeFromOffsets(Math.max(0, offset - _window.width), offset + _window.width)
    : [0, 0];
  const previousDirection = usePrevious(direction);

  const [startIndex, endIndex] = indexes;

  const items = useMemo(() => {
    if (!canRender) {
      return [];
    }
    return upTo(startIndex, endIndex, (i) => {
      return createElement(MemoizedComponent, cachedProps.current[i]);
    });
  }, [canRender, endIndex, startIndex]);

  const [animation, set] = useSpring(() => ({
    height: '100%',
    width: '100%',
    transform: 'translate3d(0px,0px,0)',
  }));

  const totalSize = getTotalSizeOfItems();
  console.log('totalSize: ', totalSize);

  let translate = 0;
  const m = move[axis];
  const snapPoint = getMeasurements(index).offset;
  const d = previousDirection ? previousDirection[axis] : 0;
  const point = snapPoint + m;

  if (phase === 'end') {
    translate = Math.min(-offset, 0);
  } else {
    translate = Math.min(0, Math.min(point, totalSize));
  }

  const [nextIndex, nextOffset] =
    phase === 'end' && Math.abs(m) > 100
      ? [index + d, getMeasurements(index + d).offset]
      : [index, offset];

  useEffect(() => {
    setIndex(nextIndex);
    setOffset(nextOffset);
  }, [nextIndex, nextOffset]);

  useEffect(() => {
    set(() => {
      return {
        height: '100%',
        width: '100%',
        transform: `translate3d(${translate}px,${0}px,0)`,
      };
    });
  }, [set, translate]);

  useEffect(() => {
    return () => {
      cachedProps.current = {};
    };
  }, []);

  return (
    <>
      <Absolute
        p="2%"
        zIndex={1}
        borderRadius="8px"
        bg="white"
        right="2%"
        top="2%"
        boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)">
        <Text>{`indexes: ${startIndex} -> ${endIndex}`}</Text>
      </Absolute>
      <Relative ref={container} height="80vh" width={1} maxHeight="80vh" overflow="hidden">
        <animated.div ref={dragger} style={animation}>
          {items}
        </animated.div>
      </Relative>
    </>
  );
}

export default withCoreProviders(Index);
