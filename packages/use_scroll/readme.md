# useScroll

`useScroll` is a react hook that provides scroll coordinates, direction, phases, and cross browser support for scrollTo animations.

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

  - [`consolidate`](#consolidate)
  - [`endDelay`](#endDelay)
  - [`passive`](#passive)
  - [`capture`](#capture)
  - [`once`](#once)

- [`Return Value`](#Return-Value)

  - [`State`](#State)

    - [`isScrolling`](#isScrolling)
    - [`phase`](#phase)
    - [`x`](#x)
    - [`y`](#y)
    - [`direction`](#direction)
    - [`isAnimating`](#isAnimating)

  - [`Helpers`](#Helpers)

    - [`scrollTo`](#scrollTo)

- [`Examples`](#Examples)

  - [`HTML Element Scroll`](#HTML-Element-Scroll)
  - [`Scroll To`](#Scroll-To)
  - [`Window Scrolling`](#Window-Scrolling)

    <br>
    <br>
    <br>
    <br>
    <br>
    <br>

# Installation

```bash
npm install @jwdinker/use-scroll
```

<br>
<br>
<br>
<br>
<br>
<br>

# Usage

```jsx
import { useScroll } from '@jwdinker/use-scroll';

const Contents = () => {
  const [scroll, scrollTo] = useScroll(window);

  const { isScrolling, isAnimating, phase, x, y, direction } = scroll;

  return <div style={{ height: '10000px', width: '100%' }} />;
};
```

<br>
<br>
<br>
<br>
<br>
<br>

# Options

`useScroll` accepts two arguments.

<br>

The first argument can be react reference to an HTML Element or the window.

```ts
    element:React.RefObject<HTMLElement | Window | null | undefined> | HTMLElement | Window | null | undefined;
```

<br>

The second argument is an options object that contains the standard event options with the addition of a few extra properties:

- [`consolidate`](#consolidate)
- [`endDelay`](#endDelay)
- [`passive`](#passive)
- [`capture`](#capture)
- [`once`](#once)

<br>
<br>
<br>

### `consolidate`

```ts
consolidate: boolean = false;
```

A boolean that toggles the use of a custom event emitter. This is useful if there will be multiple listeners of the same event type on the element. For instance, the window may have multiple scroll listeners. It will consolidate all the handlers and only add one listener.

<br>
<br>
<br>

### `endDelay`

```ts
endDelay: number = 45;
```

The duration of the timeout after the last scroll event. Used to toggle the `isScrolling` and `end` phase. Unfortunately, modern browsers have yet to expose the internal state of scroll, so this hack is required.

<br>
<br>
<br>

### `passive`

```ts
passive: boolean = true;
```

A boolean that indicates the handler of the listener will never call `preventDefault`. This is used to improve performance for modern browsers so it is enabled for default. If `false` the browser will display a warning.

<br>
<br>
<br>

### `capture`

```ts
capture: boolean = false;
```

A Boolean indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.

<br>
<br>
<br>

### `once`

```ts
once: boolean = false;
```

A boolean that indicates the listener will only fire the event once and then remove itself.

<br>
<br>
<br>

<br>
<br>
<br>

# Return Value

The return value is an array containing the `state` and a `scrollTo` helper function.

```ts
const [scroll, scrollTo] = useScroll(_window);
```

<br>
<br>
<br>

## **State**

The state is an object containing the following:

- [`isScrolling`](#isScrolling)
- [`phase`](#phase)
- [`x`](#x)
- [`y`](#y)
- [`direction`](#direction)
- [`isAnimating`](#isAnimating)

<br>
<br>
<br>

### `isScrolling`

```ts
isScrolling: boolean = false;
```

A boolean indicating whether a scroll event is currently active or not.

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

### `x`

```ts
x: number = 0;
```

The current x coordinate of the scroll event.

<br>
<br>
<br>

### `y`

```ts
y: number = 0;
```

The current y coordinate of the scroll event.

<br>
<br>
<br>

### `direction`

```ts
direction: [number, number] = [0, 0];
```

The current direction of the scroll movement.

<br>

> Note: Unlike touch events, scroll events can only update either the x or y axis with each change in movement. Consequently, a single number is used to indicate a directional change. The alternative of tracking direction by axis would result in constant shifts from 0 to 1/-1 with each small change in direction.

<br>

- `1` indicates a forwards direction.
- `0` indicates no change in direction.
- `-1` indicates a backwards direction.

<br>
<br>
<br>

### `isAnimating`

```ts
isAnimating: boolean = false;
```

A boolean that indicates whether a scroll event, triggered by a scrollTo event, is still animating.

<br>
<br>
<br>
<br>
<br>
<br>

## **Helpers**

### `scrollTo`

```ts
scrollTo({x:number = 0,y:number = 0, duration:number = 0, easing:'easeInOutQuint'}):void
```

A helper function used to scroll to coordinates with cross browser support for animations. A duration of zero will not trigger an animation.

The following easing types are available:

- `linear`
- `easeInQuad`
- `easeOutQuad`
- `easeInOutQuad`
- `easeInCubic`
- `easeOutCubic`
- `easeInOutCubic`
- `easeInQuart`
- `easeOutQuart`
- `easeInOutQuart`
- `easeInQuint`
- `easeOutQuint`
- `easeInOutQuint`
- `easeInElastic`
- `easeOutElastic`
- `easeInOutElastic`

<br>

They can also be accessed via an import:

<br>

```jsx
import { EASING_TYPES } from '@jwdinker/use-scroll';
```

<br>
<br>
<br>
<br>
<br>
<br>

# Examples

- [`HTML Element Scroll`](#HTML-Element-Scroll)
- [`Scroll To`](#Scroll-To)
- [`Window Scrolling`](#Window-Scrolling)

<br>
<br>
<br>

### HTML Element Scroll

This example shows usage with a ref.
<br>

```jsx
import * as React from 'react';
import upTo from '@jwdinker/up-to';
import styled from 'styled-components';
import { useScroll } from '@jwdinker/use-scroll';

const { useRef } = React;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20%;
  width: 100%;
  box-sizing: border-box;
  border: solid 1px black;
  font-weight: bold;
  font-size: 30px;
`;

const Component = () => {
  const ref = useRef();
  const [scroll, scrollTo] = useScroll(ref);

  return (
    <Container ref={ref}>
      {upTo(0, 100, (key) => (
        <Item key={key}>{key}</Item>
      ))}
    </Container>
  );
};
```

<br>
<br>
<br>

### Scroll To

This example shows usage of the scrollTo helper.
<br>

```jsx
import * as React from 'react';
import upTo from '@jwdinker/up-to';
import styled from 'styled-components';
import { useScroll, EASING_TYPES } from '@jwdinker/use-scroll';

const { useRef, useCallback } = React;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20%;
  width: 100%;
  box-sizing: border-box;
  border: solid 1px black;
  font-weight: bold;
  font-size: 30px;
`;

const Button = styled.button`
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 30px;
  background: #45baff;
  color: #004c78;
  padding: 10px 6px;
  border: none;
  border-radius: 8px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`;

function Items() {
  return upTo(0, 30, (key) => <Item key={key}>{key}</Item>);
}

const Contents = () => {
  const ref = useRef();
  const [scroll, scrollTo] = useScroll(ref);

  const slowScrollTo1000px = useCallback(() => {
    scrollTo({ y: 1000, duration: 5000, easing: EASING_TYPES.EASE_IN_OUT_QUAD });
  }, [scrollTo]);

  return (
    <>
      <Button onClick={slowScrollTo1000px}>Slow Scroll to 1000px</Button>
      <Container ref={ref}>
        <Items />
      </Container>
    </>
  );
};
```

<br>
<br>
<br>

### Window Scrolling

This example shows window scrolling if using server side rendering.

<br>

```jsx
import { useScroll } from '@jwdinker/use-scroll';

const Contents = () => {
  const _window = typeof window !== 'undefined' ? window : null;
  const [scroll, scrollTo] = useScroll(window);

  const { isScrolling, isAnimating, phase, x, y, direction } = scroll;

  return <div style={{ height: '10000px', width: '100%' }} />;
};
```
