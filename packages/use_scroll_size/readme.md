# useScrollSize

`useScrollSize` is a React hook for observing changes in scrollHeight and scrollWidth.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-scroll-size
```

<br><br><br><br><br><br>

# Usage

In this example, the `<ScrollableContainer>`'s scrollHeight and scrollWidth are monitored for changes as the images load.

```jsx
import useScrollSize from '@jwdinker/use-scroll-size';

const Component = () => {
  const ref = useRef();

  const [dimensions, hasSizeChanged] = useScrollSize(ref, 1000);

  return (
    <OverflowingContainer ref={ref}>
      {images.map(({ key, src }) => {
        return <img key={key} src={src} />;
      })}
    </OverflowingContainer>
  );
};
```

<br><br><br><br><br><br>

# Arguments

`useScrollSize` accepts a React reference to an element, window, or document object and an interval as arguments.

<br>

## element

`object`

```ts
type ScrollableElement =
  | React.RefObject<Document | Window | HTMLElement | undefined | null>
  | Document
  | Window
  | null;
```

<br><br>

## interval

`number`

_default:_ `1000`

The interval in milliseconds for how often the previous scrollHeight / scrollWidth values are checked against the current scrollHeight / scrollWidth values.

<br><br><br><br><br><br>

# Return Value

`array`

The return value is a tuple containing a `dimensions` object and a `hasSizeChanged` boolean.

<br><br>

## dimensions

`object`

```ts
interface ScrollDimensions {
  height: number;
  width: number;
}
```

The scrollHeight and scrollWidth of the `element`.

<br><br>

## hasSizeChanged

`boolean`

A boolean that reflects changes in the scroll height or width of the referenced element. The `hasSizeChanged` boolean will automatically set itself back to `false` when `true`. The reasoning behind this decision is avoid the potential for several equality checks if injecting this property via context, which is one of the primary use cases for `useScrollSize`.
