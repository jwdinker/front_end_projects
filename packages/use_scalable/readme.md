# useScalable

`useScalable` is a React hook for managing continuous scale state. For scale state bundled with event listeners, check out the [useScale](https://www.notion.so/useScale-86a670586bec429d8b1df3bb72a4dfff) package. This is for those that want more granular control over events. For web documentation, [click here](https://www.notion.so/dinker/useScalable-73ea22d6404445c0a04bf46875eb87fb).

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-scalable
```

<br><br><br><br><br><br>

# Arguments

`useScalable` accepts a single options object as an argument.

<br>

## options

`object`

---

<br>

initialScale `array`
<br>
_default:_ `[1, 1, 1]`

The initial x, y, and z values of the scale.

<br>

---

<br>

min `array`
_default:_ `[0.1, 0.1, 0.1]`

The minimum allowed for the x, y, and z values of the scale.

<br>

---

<br>

max `array`
_default:_ `[2, 2, 2]`

The maximum allowed for the x, y, and z values of the scale.

<br>

---

<br><br><br><br><br><br>

# Return Value

`array`

The return value is tuple containing the scale state object and scale handler functions.

<br><br>

## Scale

`object`

---

<br>

```ts
interface Scale {
    isScaling:boolean;
    distanceToCenter:[number,number,number];
    xyz:[number,number;number];
}
```

<br><br>

## Handlers

`object`

---

<br>

start `function`

```ts
type Point = [number, number];

type ScaleStart = (point: Point, center: Point) => void;
```

A handler function that sets isScaling to true and the initial offset the scale.

<br>

---

<br>

move `function`

```ts
type Point = [number, number];

type ScaleMove = (point: Point, center: Point) => void;
```

A handler function that computes the scale and current distance of the pointer coordinates from the center of the scalable item.

<br>

---

<br>

end `function`

```ts
type ScaleEnd = () => void;
```

A handler function that sets isScaling to false.

<br>

---

<br>

scaleTo `function`

```tsx
type ScaleTo = (xyz: [number, number, number]) => void;
```

A handler function that manually sets the current x, y, and z scale.

<br>

---
