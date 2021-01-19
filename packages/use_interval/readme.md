# useInterval

`useInterval` is a React hook for calling functions at or between intervals of time.

<br><br><br><br>

# Installation

```
npm install @jwdinker/use-interval
```

<br><br><br><br>

# Usage

```jsx
import  from '@jwdinker/use-interval'

function Component() {
  const [time, set] = useState(5);
  const [start, end] = useInterval({
    interval: 5000,
    onInterval: () => {
      set(5);
    },
    onWait: (elapsed) => {
      set(Math.ceil(5 - elapsed / 1000));
    },
  });

  useEffect(() => {
    start();
    return end;
  }, [end, start]);

  return <Page>{time}</Page>;
}
```

<br>

![useInterval depiction](depiction.gif)

<br><br><br><br>

# Arguments

`useInterval` accepts a single `options` object as an argument.

<br>

## options

`object`

---

<br>

interval `number`

The duration in milliseconds between invocations of `onInterval`.

<br>

---

<br>

onInterval `function`

```ts
onInterval:(time: number, stop: StopInterval) => void;
```

The function invoked after each `interval`. A `stop` function is included to force interval to stop.

<br>

---

<br>

onWait `function`

```ts
onWait(elapsedTime: number, currentTime: number, stop: StopInterval) => void;
```

The function invoked at each animation frame. A `stop` function is also included to stop the interval loop and prevent future invocations of `onInterval`.

<br>

---

<br><br><br><br>

# Return Value

`array`

The return value is a tuple containing a `start` and `end` function.

<br>

## start

`function`

```ts
type StartInterval = () => void;
```

The start function begins the interval.

<br><br>

## end

`function`

```ts
type EndInterval = () => void;
```

The end function ends the interval.
