# useAnimationFrame

`useAnimationFrame` is a react hook that provides the ability to invoke a callback at a specified interval.

<br>
<br>
<br>
<br>
<br>
<br>

# Table of Contents

- [Installation](#Installation)
- [Usage](#Usage)
- [Arguments](#Arguments)

  1. [`onFrame`](#1.-onFrame)
  2. [`interval`](#2.-interval)

- [Return Value](#Return-Value)
  - [`start`](#start)
  - [`stop`](#stop)

<br>
<br>
<br>
<br>
<br>
<br>

# Installation

```
npm install @jwdinker/use-animation-frame
```

<br>
<br>
<br>
<br>
<br>
<br>

# Usage

This example runs the request animation frame loop at every frame for the life of the component.

```jsx
import * as React from 'react';
import useAnimationFrame from '@jwdinker/use-animation-frame';

const { useEffect } = React;

function Component() {
  const [start, stop] = useAnimationFrame((time, elapsedTime) => {
    // do stuff on every interval of frame
  }, 0);

  useEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return <div />;
}
```

<br>
<br>
<br>
<br>
<br>
<br>

# Arguments

useAnimationFrame accepts 2 arguments:

<br>

## 1. `onFrame`

```ts
onFrame = (now:number, elapsedTime:number) => void;
```

The callback executed at the specified interval.

<br>
<br>
<br>

## 2. `interval`

```ts
interval: number = 0;
```

The duration between each invocation of the `onFrame` callback.

<br>
<br>
<br>
<br>
<br>
<br>

# Return Value

The return value is a tuple containing a start and stop function.
<br>

```jsx
const [start, stop] = useAnimationFrame(handler);
```

<br>
<br>
<br>

## `start`

```ts
start = () => void;
```

Begins the animation frame loop where the `onFrame` callback will be invoked at the set `interval`.

<br>
<br>
<br>

## `stop`

```ts
stop = () => void;
```

Ceases the animation frame loop and stops the `onFrame` callback from being invoked.

<br>
<br>
<br>
