# useScrollCoordinates

`useScrollCoordinates` is a bare bones React hook that provides scroll coordinates for an element. For more advanced use cases, check out the [useScroll](https://www.notion.so/useScroll-e79a10f0bfc1425ca4bb2d069bc5a039) package.

<br><br><br><br>

# Installation

```
npm install @jwdinker/use-scroll-coordinates
```

<br><br><br><br>

# Usage

```jsx
import useScrollCoordinates from '@jwdinker/use-scroll-coordinates';

const Component = () => {
  const _window = typeof window !== 'undefined' ? window : null;
  const coordinates = useScrollCoordinates(_window);

  const { x, y } = coordinates;

  return <div style={{ height: '10000px', width: '100%' }} />;
};
```

<br><br><br><br>

# Arguments

`useScroll` accepts a react reference to an HTML `element`, document object, or window object and an `options` object as arguments.

<br>

## element

`object`

```ts
type ScrollableElement =
  | React.RefObject<HTMLElement | Window | Document | null | undefined>
  | Window
  | Document
  | null
  | undefined;
```

<br><br>

## options

`object`

---

<br>

passive `boolean`

_default:_ `true`

A boolean that indicates the handler of the listener will never call `preventDefault`. This is used to improve performance for modern browsers so it is enabled for default. If `false` the browser will display a warning.

<br>

---

<br>

capture `boolean`

_default:_ `false`

A Boolean indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.

<br>

---

<br>

once `boolean`

_default:_ `false`

A boolean that indicates the listener will only fire the event once and then remove itself.

<br>

---

<br>

consolidate `boolean`

_default:_ `false`

A boolean that toggles the use of a custom event emitter on the element object. This is useful if there will be multiple listeners of the same event type on the element. For instance, the window may have multiple scroll listeners. If `true`, all event handlers of said type will be consolidate into a single listener.

<br>

---

<br><br><br><br>

# Return Value

`object`

`useScroll` returns a `coordinates` object containing the coordinates of the scroll.

<br>

## coordinates

`object`

---

<br>

x `number`

The current x coordinate of the scroll event.

<br>

---

<br>

y `number`

The current y coordinate of the scroll event.

<br>

---
