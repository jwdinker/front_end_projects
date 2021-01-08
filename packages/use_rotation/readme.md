# useRotation

`useRotation` is a React hook that provides rotation values of an element from a mouse, touch, or multi-touch event.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-rotation
```

<br><br><br><br><br><br>

# Usage

```jsx
import useRotation from '@jwdinker/use-rotation';

const Component = () => {
  const element = useRef();

  const [rotation] = useRotation(element, { mouse: true, touch: 2 });

  const { isRotating, angle, direction } = rotation;

  useLayoutEffect(() => {
    if (isRotating) {
      element.current.style.transform = `rotate(${angle}deg)`;
    }
  }, [angle, isRotating]);

  return <Item ref={element} />;
};
```

<br>

![rotation.gif](rotation.gif)

<br><br><br><br><br><br>

# Arguments

`useRotation` accepts a react reference to an HTML Element and an options object as arguments.

<br>

## element

`object`

```ts
type RotatableElement = React.RefObject<HTMLElement | null | undefined>;
```

The react reference to an HTMLElement used as the rotatable element.

<br><br>

## options

`object`

<br>

---

<br>

initialDegrees `number`
<br>
_default:_ `0`

The initial angle of the rotation.

<br>

---

<br>

mouse `boolean`
<br>
_default:_ `false`

Enables the mouse events to trigger rotation. The rotation is computed with the mouse coordinates along the element's center point.

<br>

---

<br>

touch `number`
<br>
_default:_ 2

```ts
type TouchToTrigger = 0 | 1 | 2;
```

The number of touches needed to trigger a rotation event.

- If a single touch is used, the rotation is computed with the touch coordinates along the element's center point.
- If 2 touches are used, the rotation is computed between the center point of the 2 touches.

<br>

---

<br><br><br><br><br><br>

# Return Value

`array`

The return value is tuple containing the `rotation` state object and a `rotate` handler function.

<br>

---

<br>

rotation `object`

```ts
interface Rotation {
  isRotating: boolean;
  direction: 1 | 0 | -1;
  degrees: number;
}
```

<br>

---

<br>

rotate `function`

```ts
type RotateTo = (degrees: number) => void;
```

A handler function that manually sets the current rotation.

<br>

---
