# useAncestorsScrollListener

`useAncestorsScrollListener` is a React hook for attaching/detaching a scroll listener to all scrollable ancestors of an element. The primary use case for this is hook is for position adjustments.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-ancestors-scroll-listener
```

<br><br><br><br><br><br>

# Usage

In this example, `useAncestorsScrollListener` will traverse the DOM tree and add a scroll event listener for every overflowing container of the referenced item. That means:

- The `<ScrollingContainer>` component will have a scroll listener attached to it.
- The `<NestedScrollingContainer>` component will have a scroll listener attached to it.
- The `window` will have a scroll listener attached to it.

<br>

```jsx
import useAncestorsScrollListener from '@jwdinker/use-ancestors-scroll-listener';

const Component = () => {
  const ref = useRef();

  const handler = (event) => {
    // do stuff with on scroll event
  };

  useAncestorsScrollListener(ref, handler, { passive: true });

  return (
    <ScrollingContainer>
      <NestedScrollingContainer>
        <Item ref={ref} />
      </NestedScrollingContainer>
    </ScrollingContainer>
  );
};
```

<br><br><br><br><br><br>

# Arguments

`useAncestorsScrollListener` accepts a _single_ or _array of_ React reference to an HTML `element` , a `handler` function, and an `options` object as arguments.

<br>

## element(s)

`object | array`

```ts
type HTMLElementReference = React.RefObject<HTMLElement | undefined | null>;

type HTMLElementReferences = HTMLElementReference[];
```

A single React reference to an HTML element or an array of React references to an HTML element.

<br>

> Note: If multiple references are passed as an argument, `useAncestorsScrollListener` handlers removing duplicate listeners if the children share the same scrolling parent.

<br><br>

## handler

`function`

```ts
type EventHandler = (event: any) => void;
```

The handler will be invoked with the scroll event of each scrollable ancestor.

<br><br>

## options

`object`

---

<br>

passive `boolean`

_default:_ `false`

<br>

A boolean that indicates the handler of the listener will never call `preventDefault`. This is used to improve performance for modern browsers so it is enabled for default. If `false` the browser will display a warning.

<br>

---

<br>

capture `boolean`

_default:_ `true`

<br>

A Boolean indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. This is `true` by default to preserve hierarchy.

<br>

---

once `boolean`

_default:_ `false`

<br>

A boolean that indicates the listener will only fire the event once and then remove itself.

<br>

---

<br><br><br><br><br><br>

# Return Value

There is no return value. The listener(s) will automatically be removed when the component is unmounted.
