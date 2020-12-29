# useToggle

`useToggle` is a simple react hook for toggling between active and inactive states.

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
- [Return Value](#Return-Value)

  - [`State`](#State)

    - [`isActive`](#isActive)

  - [`Handlers`](#Handlers)

    - [`activate`](#activate)
    - [`deactivate`](#deactivate)
    - [`toggle`](#toggle)

<br>
<br>
<br>
<br>
<br>
<br>

# Installation

```
npm install @jwdinker/use-toggle
```

<br>
<br>
<br>
<br>
<br>
<br>

# Usage

```jsx
import useToggle from '@jwdinker/use-toggle';

function Component() {
  const [isActive, { activate, deactivate, toggle }] = useToggle(false);

  return <button ref={ref}>{active ? 'deactivate' : 'activate'}</button>;
}
```

<br>
<br>
<br>
<br>
<br>
<br>

# Arguments

`useToggle` accepts a single argument that sets the initial state value:

<br>

```ts
initialValue: boolean = false;
```

<br>

```jsx
const [isActive, { toggle }] = useToggle(true);
```

<br>
<br>
<br>
<br>
<br>
<br>

# Return Value

The return value is a tuple containing:

- a boolean representing the active / inactive state
- an object containing 3 handler functions.

<br>

```jsx
const [isActive, handlers] = useToggle();

const { activate, deactivate, toggle } = handlers;
```

<br>
<br>
<br>

## State

### `isActive`

```ts
isActive: boolean = false;
```

<br>
<br>
<br>

## Handlers

The handlers object containers 3 functions:

- [`activate`](#activate)
- [`deactivate`](#deactivate)
- [`toggle`](#togle)

<br>
<br>
<br>

## `activate`

```ts
activate = () => void;
```

A handler function that changes the active state to `true`.

<br>
<br>
<br>

## `deactivate`

```ts
deactivate = () => void;
```

A handler function that changes the active state to `false`.

<br>
<br>
<br>

## `toggle`

```ts
toggle = () => void;
```

A handler function that changes the active state to

- `false` if current active state is `true`.
- `true` if current active state is `false`.
