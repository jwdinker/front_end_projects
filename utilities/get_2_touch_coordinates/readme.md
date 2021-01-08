# get2TouchCoordinates

`get2TouchCoordinates` is a utility function, that given a touch event, does the following:

- retrieves the x and coordinates of 1 target touch.
- sorts and retrieves the x and y coordinates of the farthest right touch.
- returns an array of arrays of x and y coordinates

<br><br>

# Installation

```
npm install @jwdinker/get-2-touch-coordinates
```

<br><br>

# Types

```ts
type CoordinateType = 'page' | 'client' | 'screen';

type TouchCoordinates = number[];

type Get2TouchCoordintesReturn = TouchCoordinates[];
```

<br><br>

# Usage

```tsx
const onTouch = (event: TouchEvent) => {
  const [touch1, touch2] = get2TouchCoordinates(event, 'page');

  const [x1, y1] = touch1;
  const [x2, y2] = touch2;
};
```
