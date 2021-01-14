# useInstance

`useInstance` is a React hook lazy initialization of expensive objects in a reference.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-instance
```

<br><br><br><br><br><br>

# Usage

```jsx
import  from '@jwdinker/use-instance';

function Component() {
	const expensiveObject = useInstance(() => new ExpensiveObject());

  return <App/>
}
```

<br><br><br><br><br><br>

# Arguments

`useInstance` accepts an `initialize` function as the only argument.

<br>

## initialize

`function`

```ts
type Instance<T> = () => T;
```

<br><br><br><br><br><br>

# Return Value

The result of the initialize function is the return value.
