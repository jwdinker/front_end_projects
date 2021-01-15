# getScrollableAncestor

Utility functions for traversing the DOM tree to find scrollable ancestors.

<br><br>

# Installation

```
npm install @jwdinker/get-scrollable-ancestor
```

<br><br>

# Types

```ts
type ScrollableAncestor = Window | Element;

type ScrollableAncestors = Array<Window | Element>;
```

<br><br>

# Functions

<br>

## `getScrollableAncestor`

Given an element, the first scrollable ancestor of the `element` will be found. If no scrollable ancestors are are found, the window is assumed to be the scrollable ancestor.

```ts
getScrollableAncestor(element: Element) => ScrollableAncestor;
```

<br><br>

## `getAllScrollableAncestors`

Given an element, all the scrollable ancestor of the `element` will be found. If no scrollable ancestors are are found, the window will be assumed as the only scrollable ancestor.

```ts
getAllScrollableAncestors(element: Element) => ScrollableAncestor[];
```
