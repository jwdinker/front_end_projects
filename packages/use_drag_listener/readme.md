# useDragListener

`useDragListener` is a React hook for adding and normalizing event listeners on elements for both mouse and touch events. Web documentation can be [found here](https://www.notion.so/dinker/useDragListener-43740b58c96f476d9df7892a5ad53978).

# Installation

```
npm install @jwdinker/use-drag-listener
```

# Usage

- use_drag_state.js

  ```tsx
  function useDragState() {
    const [state, setState] = useState({
      isDragging: false,
      xy: [0, 0],
      movement: [0, 0],
    });
    const dragStart = (x, y) => {
      setState((previous) => {
        return {
          ...previous,
          xy: [x, y],
        };
      });
    };

    const dragMove = (x, y) => {
      const xy = [x, y];
      setState((previous) => {
        const delta = previous.xy.map((value, index) => value - xy[index]);
        const movement = previous.movement.map((value, index) => value - delta[index]);
        return {
          ...previous,
          isDragging: true,
          xy,
          movement,
        };
      });
    };

    const dragEnd = () => {
      setState((previous) => ({ ...previous, isDragging: false }));
    };

    return [state, { dragStart, dragMove, dragEnd }];
  }
  ```

```jsx
import useDragListener from '@jwdinker/use-drag-listener';
import useDragState from './use_drag_state';

const Component = () => {
  const element = useRef();

  const [state, { dragStart, dragMove, dragEnd }] = useDragState();

  useDragListener(element, {
    onMouseDown: (event, enableMove) => {
      enableMove();
      dragStart(event.pageX, event.pageY);
    },
    onMouseMove: (event) => {
      dragMove(event.pageX, event.pageY);
    },
    onMouseUp: (event, disableMove) => {
      disableMove();
      dragEnd();
    },
  });

  const { movement } = state;

  const [x, y] = movement;
  const transform = `translate3d(${x}px,${y}px,0)`;

  return (
    <Page>
      <Item ref={element} style={{ transform }} />
    </Page>
  );
};
```

# Arguments

`useDragListener` accepts a react reference to an HTML Element and an options object as arguments.

---

- element `object`

  ```tsx
  type DragElement = RefObject<HTMLElement | undefined | null>;
  ```

  A react reference to an HTML Element.

  The touch events' listeners and the mousedown event listener will be added to the element. The mousemove and mouseup event listeners will added to the window to account for fast movements of the mouse.

---

## Options

`object`

- onTouchStart `function`

  ```ts
  type OnTouchStart = (
    event: globalThis.TouchEvent,
    enable: EnableMove
  ) => undefined | boolean | void;
  ```

  Receives the standard touch event object with the addition of an `enable` function that when invoked, allows `onTouchMove` and `onTouchEnd` to be invoked.

---

- onTouchMove `function`

  ```ts
  export type OnTouchMove = (event: globalThis.TouchEvent) => undefined | boolean | void;
  ```

---

- onTouchEnd `function`

  ```ts
  export type OnTouchEnd = (
    event: globalThis.TouchEvent,
    disable: DisableMove
  ) => undefined | boolean | void;
  ```

  Receives the standard touch event object with the addition of a `disable` function that when invoked, disables future invocations of `onMouseMove` and `onMouseUp`.

---

- onMouseDown `function`

  ```ts
  type OnMouseDown = (
    event: globalThis.MouseEvent,
    enable: EnableMove
  ) => undefined | boolean | void;
  ```

  Receives the standard mouse event object with the addition of an `enable` function that when invoked, allows `onMouseMove` and `onMouseUp` to be invoked.

---

- onMouseMove `function`

  ```ts
  export type OnMouseMove = (event: globalThis.MouseEvent) => undefined | boolean | void;
  ```

---

- onMouseUp `function`

  ```ts
  export type OnMouseUp = (
    event: globalThis.MouseEvent,
    disable: DisableMove
  ) => undefined | boolean | void;
  ```

  Receives the standard mouse event object with the addition of a `disable` function that when invoked, disables future invocations of `onMouseMove` and `onMouseUp`.

---

- mouse `boolean`
  _default:_ `true`

      A boolean for enabling and disabling attaching a mousedown event listener on the element and mouseup and mousemove event listener on window.

---

- touch `boolean`
  _default:_ `true`

      A boolean for enabling and disabling attaching touch event listeners on the element.

---

- passive `boolean`
  _default:_ `false`

      A boolean that indicates the handler of the listener will never call `preventDefault`. This is used to improve performance for modern browsers so it is enabled for default. If `false` the browser will display a warning.

---

- capture `boolean`
  _default:_ `false`

      A Boolean indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.

---

- once `boolean`
  _default:_ `false`

      A boolean that indicates the listener will only fire the event once and then remove itself.
