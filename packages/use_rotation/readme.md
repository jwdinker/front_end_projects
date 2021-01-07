# useRotation

`useRotation` is a React hook that provides rotation values of an element from a mouse, touch, or multi-touch event.

# Installation

```
npm install @jwdinker/use-rotation 
```

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

# Arguments

`useRotation` accepts a react reference to an HTML Element and an options object as arguments. 

---

- element `object`

    ```tsx
    type RotatableElement = React.RefObject<HTMLElement | null | undefined>;
    ```

    The react reference to an HTMLElement used as the rotatable element.

---

- options `object`
    - initialAngle `number`
    *default:* `0`

        The initial angle of the rotation.

    ---

    - mouse `boolean`
    *default:* `false`

        Enables the mouse events to trigger rotation.   The rotation is computed with the mouse coordinates along the element's center point.

    ---

    - touch `number`
    *default:* 2

        ```tsx
        type TouchToTrigger = 1 | 2
        ```

        The number of touches needed to trigger a rotation event.  

        - If a single touch is used,  the rotation is computed with the touch coordinates along the element's center point.
        - If 2 touches are used, the rotation is computed between the center point of the 2 touches.

    ---

---

# Return Value

`array`  

The return value is tuple containing the `rotation` state object and a `rotate` handler function.

---

- rotation `object`

    ```tsx
    interface Rotation {
    	isRotating:boolean;
      direction:1 | 0 | -1;
      angle:number;
    }
    ```

---

- rotate `function`

    ```tsx
    type RotateTo = (degrees: number) => void;
    ```

    A handler function that manually sets the current rotation.

---