# isOverflowed

Utility functions for determining if an element has overflowed the containing element and is no longer visible.

<br><br><br>

# Installation

```
npm install @jwdinker/is-overflowed
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

### isOverflowedX

Given an element and container's size and position, returns true if the element has overflowed the x axis and is not visible.

```ts
isOverflowedX(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isOverflowedY

Given an element and container's size and position, returns true if the element has overflowed the x axis and is not visible.

```ts
isOverflowedY(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isOverflowed

Given an element and container's size and position, returns true if the element is currently overflowed on the x or y axis and is `not` visible.

```ts
isOverflowed(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isTopOverflowed

Given an element and container's size and position, returns true if the element is currently overflowed and above the containing element.

```ts
isTopOverflowed(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isBottomOverflowed

Given an element and container's size and position, returns true if the element is currently overflowed and below the containing element.

```ts
isBottomOverflowed(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isLeftOverflowed

Given an element and container's size and position, returns true if the element is currently overflowed and left of the containing element.

```ts
isLeftOverflowed(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### isRightOverflowed

Given an element and container's size and position, returns true if the element is currently overflowed and right of the containing element

```ts
isRightOverflowed(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### getOverflowedSides

Given an element and container's size and position, returns an array of sides at which the element is overflowed.

```ts
getOverflowedSides(element: PositionAndSize, container: PositionAndSize) => Side[];
```
