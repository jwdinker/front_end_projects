# useRotatable

`useRotatable` is a React hook for managing continuous rotation state. For rotation state bundled with event listeners, check out the [useRotation](https://www.notion.so/useRotation-74d39f5a61b74345995e150b7e8eaf78) package. This is for those that want more granular control over events.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-rotatable
```

<br><br><br><br><br><br>

# Arguments

`useRotatable` accepts a single argument of the initial degrees for the rotation.

<br>

initialAngle `number`

The initial angle of the rotation.

<br><br><br><br><br><br>

# Return Value

`array`

The return value is tuple containing the `rotation` state object and a `rotate` handler function.

<br><br>

## Index 0

`object`

<br>

rotation `object`

```ts
interface Rotation {
  isRotating: boolean;
  direction: 1 | 0 | -1;
  degrees: number;
}
```

<br><br><br>

## Index 1

`object`

<br>

start `function`

```ts
type Point = [number, number];

type StartRotation = (point: Point, center: Point) => void;
```

A handler function that sets isRotating to true and the initial offset of the rotation.

<br><br>

move `function`

```ts
type Point = [number, number];

type MoveRotation = (point: Point, center: Point) => void;
```

A handler function that computes and normalizes the current rotation and direction for compatible with 3rd party animation libraries.

<br><br>

end `function`

```ts
type Point = [number, number];

type EndRotation = () => void;
```

A handler function that sets the direction to 0 and isRotating to false.

<br><br>

rotateTo `function`

```ts
type RotateTo = (degrees: number) => void;
```

A handler function that manually sets the current rotation.
