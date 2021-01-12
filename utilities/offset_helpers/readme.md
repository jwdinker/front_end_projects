# Offset Helpers

Utility functions for computing and comparing offsets.

<br><br>

# Installation

```
npm install @jwdinker/offset-helpers
```

<br><br>

# Types

```ts
interface Offsets {
  top: number;
  left: number;
  right: number;
  bottom: number;
  height: number;
  width: number;
}

type PositionType = 'relative' | 'absolute';
```

<br><br><br>

# Functions

<br>

## getAbsoluteOffsets

Traverses the DOM tree and recursively accumulates the offsets of the element and all the element's parent nodes.

```ts
getAbsoluteOffsets(element: HTMLElement) => Offsets;
```

<br><br>

## getRelativeOffsets

Computes the distance of the outer border of the current element relative to the inner border of the offsetParent node.

```ts
getRelativeOffsets(element: HTMLElement) => Offsets;
```

<br><br>

## getOffsetDimensions

Returns the offset height and offset width of an element.

```ts
getOffsetDimensions(element: HTMLElement) => Offsets;
```

<br><br>

## getOffsetsOfElements

Computes the offsets of the supplied array of HTML elements at either a relative or absolute position.

```ts
getOffsetOfElements(elements: HTMLElement[], positionType: PositionType = 'relative') => Offsets[];
```

<br><br>

## haveOffsetsChanged

Compares offsets or array of offsets against each other to see if any of the properties' values have changed.

```tsx
getOffsetOfElements(previous: Offsets | Offsets[], current: Offsets | Offsets[]) => boolean;
```
