import React, { forwardRef, useRef, useEffect, useMemo, useCallback } from 'react';
import { Box, Triangle, Button, Centered, Text, Flex } from '@jwdinker/styled-system';
import useToggle from '@jwdinker/use-toggle';
import useTether, { flippable, getTransform, useAlignment } from '@jwdinker/use-tether';
import { useSpring, animated, useTransition } from 'react-spring';
import usePortal from '@jwdinker/use-portal';
import useBoundaries from '@jwdinker/use-boundaries';
import styleObjectToString from '@jwdinker/style-object-to-string';
import { withCoreProviders } from '../../hocs';

const SCROLLABLE_AREA_STYLE = {
  height: '300vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function useElementRefs() {
  const references = useRef(new Map());

  const setReference = useCallback((key) => {
    return () => {};
  }, []);
}

function MyComponent() {
  const anchorReference = useRef();

  const box1Ref = useRef();
  const box2Ref = useRef();

  const [tetheredOffsets, anchorOffsets] = useTether(anchorReference, [box1Ref, box2Ref], 'bottom');

  const styles = tetheredOffsets.map(({ top, left }) => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      padding: '10px',
      background: 'gray',
      transform: `translate3d(${left}px,${top}px,0px)`,
    };
  });

  useEffect(() => {
    const refs = [box1Ref, box2Ref];
    refs.forEach((ref, index) => {
      const measurements = tetheredOffsets[index];
      console.log('MEASUREMENTS: ', measurements);
      ref.current.style = styleObjectToString({
        position: 'absolute',
        top: '0',
        left: '0',
        transform: getTransform(measurements),
      });
    });
  });

  return (
    <div>
      <div style={{ height: '100%', width: '100%', overflow: 'scroll' }}>
        <div
          style={{
            height: '300vh',
            width: '100%',
            display: 'flex',

            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <div ref={anchorReference}>anchor</div>
        </div>
      </div>

      <div ref={box1Ref}>box 1</div>

      <div ref={box2Ref}>box2</div>
    </div>
  );
}

const TetherExample = withCoreProviders(MyComponent);
TetherExample.displayName = 'TetherExample';
export default TetherExample;
