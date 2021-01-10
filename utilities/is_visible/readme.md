# isVisible

Utility functions for determining if an element is visible or partially visible within the element's containing element.

<br><br>

# Installation

```
npm install @jwdinker/is-visible
```

<br><br><br>

# Types

```ts
export interface PositionAndSize {
  top: number;
  left: number;
  height: number;
  width: number;
}
```

<br><br><br>

# Functions

<br>

### isVisibleX

Given an element and container's size and position, returns true if the element is visible or partially visible on the x axis.

```ts
isVisibleX(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br>
<br>

### isVisibleY

Given an element and container's size and position, returns true if the element is visible or partially visible on the y axis.

```ts
isVisibleY(element: PositionAndSize, container: PositionAndSize) => boolean;
```

<br><br>

### isVisible

Given an element and container's size and position, returns true if the element is visible or partially visible on the x or y axis.

```ts
isVisibleY(element: PositionAndSize, container: PositionAndSize) => boolean;
```
