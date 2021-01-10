# getVisibleArea

Utility functions for getting the visible amount of an element within the element's container.

<br><br><br>

# Installation

```
npm install @jwdinker/get-visible-area
```

<br><br><br>

# Types

```tsx
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

### getVisibleX

Given an element and container's size and position, returns the amount of visible pixels on the x axis.

```tsx
getVisibleX(element: PositionAndSize, container: PositionAndSize) => number;
```

<br>

### getVisibleY

Given an element and container's size and position, returns the amount of visible pixels on the y axis.

```tsx
getVisibleY(element: PositionAndSize, container: PositionAndSize) => number;
```

<br>

### getVisiblePixels

Given an element and container's size and position, returns the amount of visible pixels on the x and y axis if the element is visible.

```tsx
getVisiblePixels(element: PositionAndSize, container: PositionAndSize) => [number,number];
```

<br>

### getVisibleArea

Given an element and container's size and position, returns the visible area of the element in pixels or as a percentage.

```tsx
getVisible(element: PositionAndSize, container: PositionAndSize, unit: 'px' | '%' = '%') => number;
```
