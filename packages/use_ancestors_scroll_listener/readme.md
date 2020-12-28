# useAncestorsScrollListeners

`useAncestorsScrollListeners` is a React hook for attaching/detaching a scroll listener to all scrollable ancestors of an element. The primary use case for this is hook is for position adjustments.

<br>
<br>
<br>
<br>
<br>
<br>

# Table of Contents

- [Installation](#Installation)
- [Usage](#Installation)
- [Arguments](#Arguments)

  - [Ref or Refs[]](#1.-Ref-or-Refs[])
  - [Handler](#2.-Handler)
  - [Options](#3.-Options)

    - [`passive`](#passive)
    - [`capture`](#capture)
    - [`once`](#once)

<br>
<br>
<br>
<br>
<br>
<br>

# Installation

```
npm install @jwdinker/use-ancestors-scroll-listener
```

<br>
<br>
<br>
<br>
<br>
<br>

# Usage

In this example, `useAncestorsScrollListener` will traverse the DOM tree and add a scroll event listener for every overflowing container of the referenced item (div with "scroll_child" id). Assuming that the `window`, `overflowing_container`, and `nested_overflowing_container` were all overflowing, the handler would be invoked anytime one of these elements were scrolled.

<br>

```jsx
const Component = () => {
  const itemRef = useRef();

 const handler = (event) => {
     // do stuff with events
 }

  useAncestorsScrollListener(ref, handler, {passive:true});

  return (
      <div id="overflowing_container" >
        <div id="nested_overflowing_container">
            <div ref={ref} id="scroll_child">
        </div>
      </div>
  );
};
```

<br>
<br>
<br>
<br>
<br>
<br>

# Arguments

`useAncestorsScrollListener` accepts 3 arguments:

<br>
<br>
<br>

## 1. Ref or Refs[]

```ts
element:React.RefObject<HTMLElement> | HTMLElement | React.RefObject<HTMLElement>[] | HTMLElement[]
```

The first argument is a _array of_ or single react reference to an HTMLElement or a reference to an HTMLElement.

<br>

> Note: If multiple refs are passed as an argument, useAncestorsScrollListener handlers removing duplicate listeners if the children share the same scrolling parent.

<br>
<br>
<br>

## 2. Handler

```ts
handler = (event:ScrollEvent) => void;
```

The second argument is the handler that will be invoked with the scroll event of each scrollable ancestor.

<br>
<br>
<br>

## 3. Options

The 3rd argument is an options object that contains the standard event options that will applied to each scrollable ancestor:

- [`passive`](#passive)
- [`capture`](#capture)
- [`once`](#once)

<br>
<br>
<br>

### `passive`

```ts
passive: boolean = true;
```

A boolean that indicates the handler of the listener will never call `preventDefault`. This is used to improve performance for modern browsers so it is enabled for default. If `false` the browser will display a warning.

<br>
<br>
<br>

### `capture`

```ts
capture: boolean = true;
```

A Boolean indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree. This is `true` by default to preserve invocation hierarchy.

<br>
<br>
<br>

### `once`

```ts
once: boolean = false;
```

A boolean that indicates the listener will only fire the event once and then remove itself.

<br>
<br>
<br>
