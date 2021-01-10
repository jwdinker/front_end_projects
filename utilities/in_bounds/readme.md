# inBounds

Utility functions for determining if an element is within the boundaries of a containing element.

<br><br><br>

# Installation

```
npm install @jwdinker/in-bounds
```

<br><br><br>

# Types

```tsx
export interface PositionAndSize {
  top: number;
  left: number;
  height: number;
  width: number;
}
```

<br><br><br>

# Functions

### inBoundsX

Given an element and container's size and position, returns a `boolean` if the element is within the boundaries of the container's x axis.

```tsx
inBoundsX(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### inBoundsY

Given an element and container's size and position, returns a `boolean` if the element is within the boundaries of the container's y axis.

```tsx
inBoundsY(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>

### inBounds

Given an element and container's size and position, returns a true if the element is within the boundaries of the container's x and y axis.

```tsx
inBounds(element: PositionAndSize, container: PositionAndSize) => boolean;
```
