# getMouseCoordinates

`getMouseCoordinates` is a utility function that retrieves the x and y coordinates of a requested type from a MouseEvent object and returns the coordinates in array format.

<br><br>

# Installation

```
npm install @jwdinker/get-mouse-coordinates
```

<br><br>

# Types

```ts
type CoordinateType = 'page' | 'client' | 'screen';

type MouseCoordinates = number[];
```

<br><br>

# Usage

```tsx
const onMouse = (event: MouseEvent) => {
  const [x, y] = getMouseCoordinates(event, 'page');
};
```
