# isOverflowing

Utility functions for determining if an element is overflowing the containing element at an edge.

<br><br><br>

# Installation

```
npm install @jwdinker/is-overflowing
```

<br><br><br>

# Types

```ts
interface PositionAndSize {
  top: number;
  left: number;
  height: number;
  width: number;
}

type Side = 'top' | 'bottom' | 'left' | 'right';
```

<br><br><br>

# Functions

<br>

### isTopOverflowing

Given an element and container's size and position, returns true if the element is partly visible and a top portion of the element is overflowing.

```ts
isTopOverflowing(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isBottomOverflowing

Given an element and container's size and position, returns true if the element is partly visible and a bottom portion of the element is overflowing.

```ts
isBottomOverflowing(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isLeftOverflowing

Given an element and container's size and position, returns true if the element is partly visible and a left portion of the element is overflowing.

```ts
isLeftOverflowing(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isRightOverflowing

Given an element and container's size and position, returns true if the element is partly visible and a right portion of the element is overflowing.

```ts
isRightOverflowing(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isOverflowing

Given an element and container's size and position, returns any portion of the element is overflowing the containing element.

```ts
isOverflowing(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### getOverflowingSides

Given an element and container's size and position, returns an array of sides at which the element is overflowing.

```ts
getOverflowingSides(element: PositionAndSize, container: PositionAndSize) => Side[];
```
