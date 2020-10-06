import React, { useRef, useEffect, useMemo, useState, useCallback, memo } from 'react';
import { Row, Text, Absolute, Input } from '@jwdinker/styled-system';

import useEventListener from '@jwdinker/use-event-listener';

import { useVirtualScroll, LAYOUTS } from '@jwdinker/use-virtual-scroll';
import useSize from '@jwdinker/use-size';
import usePrevious from '@jwdinker/use-previous';
import { withCoreProviders } from '../../hocs';

const Indexes = ({ key, index, data, style, isScrolling }) => {
  return useMemo(() => {
    return (
      <div
        style={{
          ...style,
          display: 'flex',
          background: index % 2 ? 'white' : '#EFEFEF',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px',
        }}>
        {`ROW ${index}`}
      </div>
    );
  }, [index, style]);
};

const MemoizedIndexes = memo(Indexes, (previous, current) => {
  return previous.key === current.key && previous.style.left === current.style.left;
});

const PAGE_STYLE = {
  height: '100vh',
  width: '100vw',
  maxHeight: '100%',
  maxWidth: '100%',
};
function Contents() {
  const element = useRef();
  const [{ height, width }, hasChangedSize] = useSize(element);
  const [toIndex, setToIndex] = useState(0);
  const previousToIndex = usePrevious(toIndex);

  const onChange = useCallback(({ target: { value } }) => {
    const isNumber = !Number.isNaN(value);
    const valueAsNumber = isNumber ? Number(value) : -1;
    if (valueAsNumber >= -1 && valueAsNumber < 1000) {
      setToIndex(valueAsNumber);
    }
  }, []);

  const onKeyboard = useCallback((event) => {
    const { key } = event;
    if (key === 'ArrowUp') {
      setToIndex((previousIndex) => {
        return previousIndex < 1000 ? previousIndex + 1 : previousIndex;
      });
    }
    if (key === 'ArrowDown') {
      setToIndex((previousIndex) => {
        return previousIndex > 0 ? previousIndex - 1 : previousIndex;
      });
    }
  }, []);

  const arrowable = useEventListener(
    typeof window !== 'undefined' ? window : null,
    'keyup',
    onKeyboard
  );

  useEffect(() => {
    arrowable.attach();
    return arrowable.detach;
  }, [arrowable]);

  const args = {
    component: Indexes,
    height,
    width,
    estimatedSize: width ? width / 4 : 50,
    runway: 3,
    itemSize: width / 4,
    numberOfItems: 1000,
    layout: LAYOUTS.HORIZONTAL,
  };

  const { reference, items, styles, indexes, scrollToIndex, reset } = useVirtualScroll(args);

  const goTo = useCallback(() => {
    scrollToIndex(200);
  }, [scrollToIndex]);

  useEffect(() => {
    if (typeof previousToIndex !== 'undefined' && previousToIndex !== toIndex) {
      scrollToIndex(toIndex);
    }
  }, [previousToIndex, scrollToIndex, toIndex]);

  return useMemo(
    () => (
      <>
        <div ref={element} style={PAGE_STYLE}>
          <div ref={reference} style={styles.container}>
            <div style={styles.contents}>{items}</div>
          </div>
        </div>
        <Absolute
          bg="white"
          right="5%"
          top="5%"
          p="10px"
          borderRadius="8px"
          boxShadow="0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)">
          <Row height="100%" width={1}>
            <Row flex={2} justifyContent="center" alignItems="center">
              <Text>Go To Index:</Text>
            </Row>
            <Row>
              <Input
                textAlign="center"
                maxWidth="50px"
                m={0}
                borderRadius="8px"
                fontSize="22px"
                bg="white"
                border="1px solid"
                borderColor="gray.3"
                onChange={onChange}
                value={toIndex}
              />
            </Row>
          </Row>
        </Absolute>
      </>
    ),
    [items, onChange, reference, styles.container, styles.contents, toIndex]
  );
}

export default withCoreProviders(Contents);
