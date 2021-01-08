# useScroll

`useScroll` is a react hook that provides scroll coordinates, direction, phases, and cross browser support for scrollTo animations. For web based documention, [click here](https://www.notion.so/dinker/useScroll-e79a10f0bfc1425ca4bb2d069bc5a039).

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-scroll
```

<br><br><br><br><br><br>

# Usage

```jsx
import { useScroll } from '@jwdinker/use-scroll';

const Component = () => {
  const [scroll, scrollTo] = useScroll(window);

  const { isScrolling, isAnimating, phase, x, y, direction } = scroll;

  return <div style={{ height: '10000px', width: '100%' }} />;
};
```

<br><br><br><br><br><br>

# Arguments

<br>

`useScroll` accepts a react reference to an HTML element or window and an options object as arguments.

<br>

## element `object`

```ts
type ScrollableElement = React.RefObject<HTMLElement | Window | null> | Window | null | undefined;
```

A react reference to an HTML Element or Window.

<br><br>

## options `object`

---

<br>

endDelay `number`

_default:_ `45`

The duration of the timeout after the last scroll event. Used to toggle the `isScrolling` and `end` phase. Unfortunately, modern browsers have yet to expose the internal state of scroll, so this hack is required.

<br>

---

<br>

passive `boolean`

_default:_ `true`

A boolean that indicates the handler of the listener will never call `preventDefault`. This is used to improve performance for modern browsers so it is enabled for default. If `false` the browser will display a warning.

<br>

---

<br>

capture `boolean`

_default:_ `false`

A Boolean indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.

<br>

---

<br>

once `boolean`

_default:_ `false`

A boolean that indicates the listener will only fire the event once and then remove itself.

<br>

---

<br>

consolidate `boolean`

_default:_ `false`

A boolean that toggles the use of a custom event emitter on the element object. This is useful if there will be multiple listeners of the same event type on the element. For instance, the window may have multiple scroll listeners. If `true`, all event handlers of said type will be consolidate into a single listener.

<br>

---

<br><br><br><br><br><br>

# Return Value `array`

`useScroll` returns a tuple containing the `scroll` state object and a `scrollTo` helper function.

<br><br>

## scroll `object`

---

<br>

isScrolling `boolean`

A boolean indicating whether a scroll event is currently active or not.

<br>

---

<br>

phase `string`

_default:_ `'idle'`

```ts
type ScrollPhase = 'idle' | 'start' | 'move' | 'end';
```

A string denoting the current phase of the scroll event.

<br>

---

<br>

x `number`

The current x coordinate of the scroll event.

<br>

---

<br>

y `number`

The current y coordinate of the scroll event.

<br>

---

<br>

direction `number`

```ts
type ScrollDirection = -1 | 0 | 1;
```

The current direction of the scroll movement.

- `1` indicates a forwards direction.
- `0` indicates no change in direction.
- `-1` indicates a backwards direction.

<br>

> Note: Unlike touch events, scroll events can only update either the x or y axis with each change in movement. Consequently, a single number is used to indicate a directional change. The alternative of tracking direction by axis would result in constant shifts from 0 to 1/-1 with each small change in direction.

<br>

---

<br>

isAnimating `boolean`

A boolean that indicates whether a scroll event was triggered by a `scrollTo` invocation and that animation is still active.

<br>

---

<br><br><br>

## scrollTo

`function`

```tsx
scrollTo({x:number = 0, y:number, duration:number = 0, easing:'easeInOutQuint' }) => void
```

A helper function used to scroll to coordinates with support for animations. A duration of zero will not trigger an animation.

- available easing types
  - linear
  - easeInQuad
  - easeOutQuad
  - easeInOutQuad
  - easeInCubic
  - easeOutCubic
  - easeInOutCubic
  - easeInQuart
  - easeOutQuart
  - easeInOutQuart
  - easeInQuint
  - easeOutQuint
  - easeInElastic
  - easeOutElastic
  - easeInOutElastic

<br><br><br><br><br><br>

# Examples

<br>

## Element scrolling

This example shows usage with an element reference.

```tsx
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

<br><br>

## Scroll To

This example shows usage of the scrollTo helper.

```jsx
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

<br><br>

## Window Scrolling

This example shows window scrolling if using server side rendering.

```jsx
import { useScroll } from '@jwdinker/use-scroll';

const Contents = () => {
  const _window = typeof window !== 'undefined' ? window : null;
  const [scroll, scrollTo] = useScroll(window);

  const { isScrolling, isAnimating, phase, x, y, direction } = scroll;

  return <div style={{ height: '10000px', width: '100%' }} />;
};
```
