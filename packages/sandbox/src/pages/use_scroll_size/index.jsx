import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  forwardRef,
  useLayoutEffect,
  useCallback,
} from 'react';
import {
  Box,
  Row,
  Text,
  Centered,
  Fixed,
  Absolute,
  Relative,
  Column,
  Button,
  Image,
} from '@jwdinker/styled-system';
import useScrollSize from '@jwdinker/use-scroll-size';

import { withCoreProviders } from '../../hocs';
import { dummyImages } from '../../dummy_data';

const Contents = () => {
  const container = useRef();
  const [items, setItems] = useState(dummyImages);

  const [dimensions, changed] = useScrollSize(typeof window !== 'undefined' ? window : null);

  const remove = useCallback(() => {
    setItems((_items) => {
      if (_items.length > 1) {
        return _items.filter((item, index) => {
          return index !== 0;
        });
      }
      return _items;
    });
  }, []);

  const reset = useCallback(() => {
    setItems(dummyImages);
  });

  console.log('STATE', JSON.stringify({ ...dimensions, changed }, null, 2));

  return useMemo(
    () => (
      <Box height="100%" maxWidth="50%">
        <Absolute>
          <Button onClick={remove}>Remove First Image</Button>
          <Button onClick={reset}>Reset Images</Button>
        </Absolute>
        <Centered height="100%" width={1}>
          <Box ref={container}>
            {items.map(({ key, text, image }, index) => {
              return <Image key={key} src={image} />;
            })}
          </Box>
        </Centered>
      </Box>
    ),
    [items, remove, reset]
  );
};

export default withCoreProviders(Contents);
