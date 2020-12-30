# useBlockScroll

`useBoundingClientRect` is a simple react hook for managing and updating the size and position of an HTML Element relative to the viewport.

<br>
<br>
<br>
<br>
<br>
<br>

# Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
- [Arguments](#Arguments)
  - [`ref`](#1.-ref)
- [Return Value](#Return-Value)
  - [`measurements`](#measurements)
  - [`update`](#update)
- [Example](#Example)

<br>
<br>
<br>
<br>
<br>
<br>

# Installation

```
npm install @jwdinker/use-bounding-client-rect
```

<br>
<br>
<br>
<br>
<br>
<br>

# Usage

```jsx
import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';

function Component() {
  const ref = useRef();

  const [rect, update] = useBoundingClientRect(ref);

  return <div ref={ref}></div>;
}
```

<br>
<br>
<br>
<br>
<br>
<br>

# Arguments

`useBoundingClientRect` accepts a single argument of a react ref:

<br>

## `ref`

```ts
element:React.RefObject<HTMLElement | null | undefined>
```

<br>

```jsx
const ref = useRef();
const [measurements, update] = useBoundingClientRect(ref);

return <div ref={ref}></div>;
```

<br>
<br>
<br>
<br>
<br>
<br>

# Return Value

The return value is a tuple containing the rectangle measurements and an update function.
<br>

```jsx
const [measurements, update] = useBoundingClientRect(ref);
```

<br>
<br>
<br>

## `measurements`

```ts
measurements:{
    height:number = 0,
    width:number = 0,
    top:number = 0,
    left:number = 0,
    right:number = 0,
    bottom:number = 0,
    x:number = 0,
    y:number = 0
}
```

<br>
<br>
<br>

## `update`

```ts
update = () => void;
```

The update function invokes the `getBoundingClientRect` method on the referenced HTML element and updates the measured state. If the rectangle size and position has not change, there will be no re-render.

<br>

> Note: The update function is already invoked in the first call to useEffect, so an initial update is not necessary.

<br>
<br>
<br>
<br>
<br>
<br>

# Example

In this example, the size and position of the `<Item>` is updated on every requestAnimationFrame. Any change, will trigger a re-render.

<br>

```jsx
import * as React from 'react';
import styled from 'styled-components';

import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import useAnimationFrame from '@jwdinker/use-animation-frame';

const Container = styled.div`
  height: 300vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background: #f8f9f9;
`;

const Item = styled.div`
  height: 150px;
  width: 150px;
  box-sizing: border-box;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  background: white;
`;

const { useRef, useEffect } = React;

function Component() {
  const ref = useRef();

  const [measurements, update] = useBoundingClientRect(ref);

  const [start, stop] = useAnimationFrame(update);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return (
    <Container ref={ref}>
      <Item ref={ref} />
    </Container>
  );
}
```
