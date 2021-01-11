# useBoundingClientRect

`useBoundingClientRect` is a React hook for persisting and updating the [DOMRect](https://developer.mozilla.org/en-US/docs/Web/API/DOMRect) measurements of an element.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-bounding-client-rect
```

# Usage

```jsx
import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';

function Component() {
  const ref = useRef();

  const [rect, update] = useBoundingClientRect(ref);

  return <div ref={ref}></div>;
}
```

<br><br><br><br><br><br>

# Arguments

`useBoundingClientRect` accepts a single React reference to an HTML element as an argument.

<br>

## element

`object`

```ts
type ElementReference = React.RefObject<HTMLElement | null> | undefined | null;
```

<br><br><br><br><br><br>

# Return Value

`array`

The return value is a tuple containing the DOMRect `measurements` and an `update` function.

The update function is already called in the first useEffect, so an initial update is not necessary.

<br><br>

## measurements

`object`

```ts
interface Rectangle {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
  x?: number;
  y?: number;
}
```

<br><br>

## update

`function`

```tsx
update() => void;
```

The update function recomputes the DOMRect. If any of the property's value have changed, the state will be updated, triggering a re-render.

<br><br><br><br><br><br>

# Examples

In this example, the <Item/> component has its position and size constantly updated anytime it changes.

```jsx
import useBoundingClientRect from '@jwdinker/use-bounding-client-rect';
import useAnimationFrame from '@jwdinker/use-animation-frame';

function Component() {
  const ref = useRef();

  const [measurements, update] = useBoundingClientRect(ref);

  const [start, stop] = useAnimationFrame(update);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return (
    <Scroller>
      <Item ref={ref} />
    </Scroller>
  );
}
```
