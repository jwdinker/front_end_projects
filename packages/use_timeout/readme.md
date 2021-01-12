# useTimeout

`useTimeout` is a React hook that invokes a callback function after specified duration in milliseconds. Furthermore, the hook uses requestAnimationFrame if available and setTimeout as a fallback.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-timeout
```

<br><br><br><br><br><br>

# Usage

```jsx
import useTimeout from '@jwdinker/use-timeout';

function Component() {
  const [canLaunch, { activate }] = useToggle();

  const [start, clear] = useTimeout(() => {
    activate();
  }, 5000);

  return (
    <Button
      onClick={() => {
        clear();
        start();
      }}>
      {canLaunch ? 'LAUNCH!' : 'WAITING...'}
    </Button>
  );
}
```

<br><br><br><br><br><br>

# Arguments

`useTimeout` accepts a callback and milliseconds as arguments.

<br>

## onTimeout `function`

```ts
type onTimeout = () => void;
```

The function called after the specified duration of the `milliseconds` argument.

<br><br>

## milliseconds `number`

The wait time in milliseconds before the `onTimeout` function is called.

<br>

<br><br><br><br><br><br>

# Return Value

`array`

The return value is a tuple containing a `start` and `stop` function.

<br>

## start `function`

```ts
type StartTimeout = () => void;
```

<br><br>

## clear `function`

```ts
type ClearTimeout = () => void;
```

Clears the active timeout.
