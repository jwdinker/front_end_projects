# get1TouchCoordinates

`get1TouchCoordinates` is a utility function for getting the x and y coordinates of a certain type in array format given a touch event.

<br>

# Installation

```
npm install @jwdinker/get-1-touch-coordinates
```

<br><br>

# Types

```ts
type CoordinateType = 'page' | 'client' | 'screen';

type TouchCoordinates = number[];
```

<br>
<br>

# Usage

```ts
const onTouch = (event: TouchEvent) => {
  const [x, y] = get1TouchCoordinates(event, 'page');
};
```
