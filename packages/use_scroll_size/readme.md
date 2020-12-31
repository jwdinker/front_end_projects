# useScrollSize

`useScrollSize` is a React hook for observing changes in the scroll height or scroll width of an element.

<br><br><br><br><br><br>

# Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
  <br>
- [Arguments](#Arguments)

  1. [`ref`](#.1-ref)

  2. [`interval`](#.2-interval)

* [Return Value](#Return-Value)


    - [dimensions](#dimensions)

    - [hasSizeChanged](#hasSizeChanged)

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-scroll-size
```

<br><br><br><br><br><br>

# Usage

In this example, the `<ScrollableContainer>`'s scrollHeight and scrollWidth are monitored for changes as the images load.

<br>

```jsx
import useScrollSize from '@jwdinker/use-scroll-size';

const Component = () => {
  const ref = useRef();

  const [dimensions, hasSizeChanged] = useScrollSize(ref, 1000);

  return (
    <ScrollableContainer ref={ref}>
      {images.map(({ key, src }) => {
        return <img key={key} src={src} />;
      })}
    </ScrollableContainer>
  );
};
```

<br><br><br><br><br><br>

# Arguments

useScrollSize accepts 2 arguments:

<br><br><br>

## 1. ref.

```ts
ref:React.RefObject<HTMLElement | Window | null | undefined> | Window | null | undefined
```

A react reference to an HTML Element or the window object.

<br><br><br>

## 2. interval.

```ts
interval: number = 1000;
```

The interval in milliseconds for how often the previous scrollHeight / scrollWidth values are checked against the current scrollHeight / scrollWidth values.

<br><br><br><br><br><br>

# Return Value

The return value is a tuple containing a `dimensions` object and a `hasSizeChanged` boolean,

```ts
const [dimensions, hasChangedSize] = useScrollSize(ref);

const { height, width } = dimensions;
```

<br><br><br>

## `dimensions`

```ts
dimensions:{height:number = 0, width:number = 0};
```

The scroll height and scroll width of the referenced element.

<br><br><br>

## `hasSizeChanged`

```ts
hasSizeChanged: boolean = false;
```

A boolean that reflects changes in the scroll height or width of the referenced element. The `hasSizeChanged` boolean will automatically set itself back to `false` when `true`. The reasoning behind this decision is avoid the potential for several equality checks if injecting this property via context, which is one of the primary use cases for `useScrollSize`.
