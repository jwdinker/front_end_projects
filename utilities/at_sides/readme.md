# atSides

Utility functions for determining if an element's sides are flush with a container's side.

<br><br><br>

# Installation

```
npm install @jwdinker/at-sides
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

### atTop

Given an element and container's size and position, returns true if the element is at least partly visible and flush with the top of the containing element..

```ts
atTop(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### atBottom

Given an element and container's size and position, returns true if the element is at least partly visible and flush with the bottom of the containing element..

```ts
atBottom(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### atRight

Given an element and container's size and position, returns true if the element is at least partly visible and flush with the right of the containing element..

```ts
atRight(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### atLeft

Given an element and container's size and position, returns true if the element is at least partly visible and flush with the left of the containing element..

```ts
atLeft(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### getAtSides

Given an element and container's size and position, returns an array of the sides of the element that are flush with that of the containing element

```ts
getAtSides(element: PositionAndSize, container: PositionAndSize) => Side[];
```
