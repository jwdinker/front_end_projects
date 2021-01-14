# useForceUpdate

`useForceUpdate` is a simple React hook that provides a function for forcing re-renders.

<br><br>

# Installation

```
npm install @jwdinker/use-force-update
```

<br><br>

# Usage

The primary use case for `useForceUpdate` is dealing with changing values stored in objects and es6 classes outside of React that wouldn't necessarily cause a re-render.

```jsx
import  from '@jwdinker/use-force-update'

function Component() {
	const cache = useRef({});
	const [force, hasForcedUpdate] = useForceUpdate();

	const clearCache = () => {
		cache.current = {};
		force();
	}


	return <App/>
}
```

<br><br>

# Arguments

`useForceUpdate` has no arguments.

<br><br>

# Return Value

`array`

The return value is a tuple containing a `force` handler function and a force `count`.

<br><br>

## force

`function`

The handler function -that when called- triggers a re-render.

<br><br>

## hasForcedUpdate

`boolean`

A boolean that determines whether a re-render has been triggered by a call to `force`.
