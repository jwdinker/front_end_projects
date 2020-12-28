# useSwipe

`useSwipe` is a animation agnostic react hook that provides normalized, computed values from wheel and touch events for powering swipe animations.

<br>
<br>
<br>
<br>
<br>
<br>

# Table of Contents

- [`Installation`](#Installation)
- [`Usage`](#Usage)
- [`Options`](#Options)
  - [`wheel`](#wheel)
  - [`touch`](#touch)
  - [`canSwipe`](#canSwipe)
- [`Return Value`](#Return-Value)

  - [`State`](#State)
    - [`phase`](#phase)
    - [`isSwiping`](#isSwiping)
    - [`xy`](#xy)
    - [`direction`](#direction)
    - [`current`](#current)
    - [`origin`](#origin)
    - [`move`](#move)
  - [`Helpers`](#Helpers)
    - [`snapTo`](#snapTo)
  - [`Examples`](#Examples)

    - [`Snap`](#Snap)


    <br>
    <br>
    <br>
    <br>
    <br>
    <br>

# Installation

```bash
npm install @jwdinker/use-swipe
```

<br>
<br>
<br>
<br>
<br>
<br>

# Usage

```jsx
import useSwipe from '@jwdinker/use-swipe';
import { useSpring, animated } from 'react-spring';
import { withCoreProviders } from '../../hocs';

function Component() {
  const ref = useRef();

  const [
    {
      move: [moveX],
      phase,
    },
    snapTo,
  ] = useSwipe(ref, {
    wheel: true,
    touch: 1,
  });

  const [animation, set] = useSpring(() => {
    return {
      border: '1px solid black',
      transform: `translate3d(0px,0px,0)`,
    };
  });

  if (phase === 'end') {
    snapTo({ x: 0 });
  }

  set(() => ({
    border: '1px solid black',
    transform: `translate3d(${moveX * -1}px,0px,0)`,
  }));

  return (
    <div ref={ref} id="swipe_container" style={{ overflow: 'hidden' }}>
      <animated.div style={animation}>Move Me</animated.div>
    </div>
  );
}
```

<br>
<br>
<br>
<br>
<br>
<br>

# Options

`useSwipe` accepts two arguments. The first argument is a reference to the containing HTML element that listens for events. The second is an options object.

```jsx
function Component() {
  const ref = useRef();

  const options = {
    wheel: true,
    touch: true,
    canSwipe: ({ xy: [x, y] }) => y >= 0,
  };

  const [state, snapTo] = useSwipe(ref, options);

  return <div ref={ref} id="swipe_container" style={{ overflow: 'hidden' }}></div>;
}
```

<br>
<br>
<br>

The options object has the following properties:

- [`wheel`](#wheel)
- [`touch`](#touch)
- [`canSwipe`](#canSwipe)

<br>
<br>
<br>

### `wheel`

```ts
wheel: boolean = true;
```

A boolean that determines whether wheel events will trigger swipe events.

<br>
<br>
<br>

### `touch`

```ts
touch: boolean = true;
```

A boolean that determines whether touch events will trigger swipe events.

<br>
<br>
<br>

### `canSwipe`

```ts
canSwipe: (nextSwipeState) => boolean;
```

A callback function that determines whether a swipe is allowed. The function receives the potential next swipe state. If the `true` the swipe state will be updated, triggering a re-render. If `false` the state update will not occur and the component will not re-render.

<br>
<br>
<br>
<br>
<br>
<br>

# Return Value

The return value is an array containing the state and a snapTo helper function.

```jsx
const [swipeState, snapTo] = useSwipe(ref);

const {
  phase,
  isSwiping,
  xy: [x, y],
  direction: [directionX, directionY],
  origin: [originX, originY],
  current: [currentX, currentY],
  move: [moveX, moveY],
} = swipeState;
```

<br>
<br>
<br>

## **State**

The state is an object containing the following:

- [`phase`](#phase)
- [`isSwiping`](#isSwiping)
- [`xy`](#xy)
- [`direction`](#direction)
- [`current`](#current)
- [`origin`](#origin)
- [`move`](#move)

<br>
<br>
<br>

### `phase`

```ts
phase:'idle' | 'start' | 'move' | 'end' = 'idle';
```

A string denoting the current phase of the wheel or touch event.

<br>
<br>
<br>

### `isSwiping`

```ts
isSwiping: boolean = false;
```

A boolean indicating whether or not a swipe event is occuring.

<br>
<br>
<br>

### `xy`

```ts
xy: [number, number] = [0, 0];
```

The continuous x and y values that persist between swipe events.

<br>
<br>
<br>

### `direction`

```ts
direction: [number, number] = [0, 0];
```

The current direction of the swipe movement for both x and y axis.

- `1` indicates a forwards direction.
- `-1` indicates a backwards direction.
- `0` indicates no change in direction.

<br>
<br>
<br>

### `current`

```ts
current: [number, number] = [0, 0];
```

The current x and y coordinates of the swipe event.

> _Note: does not reflect the x and y coordinates of the mouse if the event is triggered by a wheel event._

<br>
<br>
<br>

### `origin`

```ts
origin: [number, number] = [0, 0];
```

The origin x and y coordinates of the swipe event.

> _Note: does not reflect the x and y coordinates of the mouse if the event is triggered by a wheel event._

<br>
<br>
<br>

### `move`

```ts
move: [number, number] = [0, 0];
```

The difference from the current x and y movement from the origin x and y coordinates.

<br>
<br>
<br>
<br>
<br>
<br>

## **Helpers**

### `snapTo`

```ts
snapTo({x:number = 0,y:number = 0}):void
```

A helper function used to override and set the xy values in the state. This function is useful for snapping at the `end` phase of a swipe event.

<br>
<br>
<br>
<br>
<br>
<br>

# Examples

<br>
<br>
<br>

## Snap

Below is trivial example of infinite swiping in both directions with snapping using the `react-spring` animation library.

<br>

> If you intend to animate items that will be larger than the container, use the `CONTAINER_STYLE` and `TRANSLATOR_BASE_STYLE` with absolutely positioned children. This prevents the scrollbar from being triggered and messing with your animation. If percentages are used for animating items, the size will be based of the `CONTAINER_STYLE` since it is relatively positioned.

<br>

```jsx
import React, { useRef } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';

import useSwipe, { CONTAINER_STYLE, TRANSLATOR_BASE_STYLE } from '@jwdinker/use-swipe';
import upTo from '@jwdinker/up-to';

const HEIGHT_OF_ITEM = 200;

const Item = styled.div`
  position: absolute;
  height: ${HEIGHT_OF_ITEM}px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  font-weight: bold;
`;

function roundToMultiple(multiple, digit) {
  if (digit > 0) return Math.ceil(digit / multiple) * multiple;
  if (digit < 0) return Math.floor(digit / multiple) * multiple;
  return multiple;
}

const Items = ({ startIndex, endIndex }) => {
  return upTo(startIndex, endIndex, (key) => {
    return (
      <Item style={{ top: `${key * HEIGHT_OF_ITEM}px` }} key={key}>
        {key}
      </Item>
    );
  });
};

const MemoizedItems = React.memo(
  Items,
  (previous, current) =>
    previous.startIndex === current.startIndex && previous.endIndex === current.endIndex
);

function SnapExample() {
  const ref = useRef();

  const options = {
    wheel: true,
    touch: true,
  };

  const [state, snapTo] = useSwipe(ref, options);

  const { phase, xy } = state;

  const y = xy[1];

  const [animation, set] = useSpring(() => {
    return {
      ...TRANSLATOR_BASE_STYLE,
      transform: `translate3d(0,0px,0)`,
    };
  });

  const index = roundToMultiple(HEIGHT_OF_ITEM, y) / HEIGHT_OF_ITEM;

  if (phase === 'end') {
    snapTo({ y: index * HEIGHT_OF_ITEM });
  }

  set(() => ({
    ...TRANSLATOR_BASE_STYLE,
    transform: `translate3d(0,${y * -1}px,0)`,
  }));

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div ref={ref} style={CONTAINER_STYLE}>
        <animated.div style={animation}>
          <MemoizedItems startIndex={index - 10} endIndex={index + 10} />
        </animated.div>
      </div>
    </div>
  );
}
```
