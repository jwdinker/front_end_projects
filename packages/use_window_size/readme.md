# useWindowSize

`useWindowSize` is a React hook that provides the size of the window in rectangle format.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-window-size
```

<br><br><br><br><br><br>

# Usage

```jsx
import  from '@jwdinker/use-window-size';

function Component(){

  const [size, hasChangedSize] = useWindowSize();

  return <App>;
};
```

<br><br><br><br><br><br>

# Arguments

`useWindowSize` has a single argument:

<br>

## endDelay `number`

The wait time in milliseconds after the last resize event before the size is retaken.

<br><br><br><br><br><br>

# Return Value `array`

The return value is a tuple containing the following:

<br>

## measurements `object`

```ts
interface WindowRect {
  height: number;
  width: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}
```

<br>

## hasChanged `boolean`

A boolean for indicating if any property in the measurements has been changed. Any change to true will be immediately set to false to avoid equality checks.
