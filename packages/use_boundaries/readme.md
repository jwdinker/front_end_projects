# useBoundaries

`useBoundaries` is a React hook that automagically updates and provides the position and size values of any element's overflow boundary, relative to the viewport. The element can be nested anywhere in the DOM hierarchy. This package pairs well with visibility utilities and packages like [useTether](https://www.notion.so/useTether-8ca63e23c8274ecca67cfe6b4c756a15).

<br>
<br>

![depiction of useBoundaries](depiction.gif)

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-boundaries
```

<br><br><br><br><br><br>

# Usage

In this example, `<OverflowScrollingContainer>`'s position and size will be monitored anytime a window scroll or resize event occurs.

```jsx
import useBoundaries from '@jwdinker/use-boundaries';

function Component() {
  const ref = useRef();

  const boundaries = useBoundaries(ref);

  return (
    <OverflowScrollingContainer>
			<OtherContainer>
				<NestedWrapper>

		      <Item ref={ref} />

				<NestedWrapper>
			</OtherContainer>
    </OverflowScrollingContainer>
  );
}
```

<br><br><br><br><br><br>

# Arguments

`useBoundaries` accepts a React reference to an HTML element and a resizeDelay as arguments.

<br>

## element `object`

```ts
type BoundableElement = React.RefObject<HTMLElement | null> | undefined | null;
```

A React reference to an HTML Element. This element scrollable parent's `top` and `left` properties will be monitored for position changes.

<br>

## resizeDelay `number`

The wait time in milliseconds after the last window resize event when the size and position will be updated.

<br><br><br><br><br>

# Return Value

The return value is a boundaries object.

<br>

## boundaries `object`

The boundaries object adapts its position and size when:

- scroll event from a scrollable ancestor occurs.
- a window resize event occurs.

<br>

```ts
interface Boundaries {
  top: number;
  left: number;
  height: number;
  width: number;
}
```
