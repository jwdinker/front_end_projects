# useOffsets

`useOffsets` is a React hook that persists the offsets of an element.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-offsets
```

<br><br><br><br><br><br>

# Usage

```jsx
import useOffsets from '@jwdinker/use-offsets';

function Component() {
  const ref = useRef();

  const [offsets, measure] = useOffsets(ref);

  const { top, bottom, left, right, height, width } = offsets;

  return <Item ref={ref} />;
}
```

<br><br><br><br><br><br>

# Arguments

`useOffsets` accepts a React referenced HTML `element` and a position `type` as arguments.

<br>

## element

`object`

```tsx
type HTMLElementReference = React.RefObject<HTMLElement | undefined | null>;
```

<br>
<br>

## type

`string`

_default:_ `'relative'`

```tsx
type OffsetType = 'relative' | 'absolute';
```

- when `'relative'`, the distance related offset properties are computed from the border of the current element relative to the inner border of the offset parent node.
- when `'absolute'`, the distance related offset properties are computed by traversing the DOM tree and accumulating the distance related offset properties of all the offset parent nodes.

<br><br><br><br><br><br>

# Return Value

`array`

The return value is tuple containing the `offsets` object and `measure` function.

<br>

## offsets

`object`

```tsx
export type Offsets = {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
};
```

<br><br>

## measure

`function`

```tsx
type MeasureOffsets = () => void;
```

A helper function that will remeasure the offsets.

> Note: `measure` is invoked in the first `useEffect` in order to get the initial offsets.
