# useMeasurementsIndexer

`useMeasurementsIndexer` is a React hook that abstracts caching measurements of items given a dynamically changing offset, providing helper functions that make the items easily searchable for use in a view. It also allows for 'infinitely' cacheable indexes & items to account for both +/- dynamic offsets. For web based documentation, [click here](https://www.notion.so/dinker/useMeasurementsIndexer-fb7a42415b544b7591756c702909c6fc).

<br>
<br>
<br>
<br>
<br>
<br>

# Installation

```
npm install @jwdinker/use-measurements-indexer
```

<br>
<br>
<br>
<br>
<br>
<br>

# Options

`useMeasurementsIndexer` accepts an options object with the following properties:

- [`itemSize`](#itemSize)
- [`estimatedItemSize`](#estimatedItemSize)
- [`boundaries`](#boundaries)
- [`infinite`](#infinite)
- [`onMeasure`](#onMeasure)
- [`onReset`](#onReset)
- [`onClear`](#onClear)

<br>
<br>
<br>

### `itemSize`

**required**

```ts
itemSize:number | (index:number) => number
```

Used to set the size of each item in the list.

- For a fixed item size use a number.
- For an item size that varies, pass a callback that returns a number for the specified index.

<br>
<br>
<br>

### `estimatedItemSize`

```ts
estimatedItemSize: number = 0;
```

An estimated size of each item. While not required, the number is used to compute the values of unmeasured items and makes for a more accurate scroll bar.

<br>
<br>
<br>

### `boundaries`

```ts
boundaries:[start:number, end:number] = [0,0];
```

The range at which the measurable items will be contained. Required if not using infinite.

<br>
<br>
<br>

### `infinite`

```ts
infinite: boolean = false;
```

A boolean that determines whether measurements will be taken infinitely based on an positive and negative offsets. This will generate both negative and positive indexes.

<br>
<br>
<br>

### `onMeasure`

```ts
onMeasure(index:number,{offset:number,size:number}):void
```

A callback invoked when an item is measured.

<br>
<br>
<br>

### `onReset`

```ts
onReset(index:number):[resetFrom:number, resetTo:number]
```

A callback invoked when an items are reset from an index.

<br>
<br>
<br>

### `onClear`

```ts
onClear():void
```

A callback invoked when the entire measurements cache is cleared.

<br>
<br>
<br>
<br>
<br>
<br>

# Return Value

The return value is an object containing the following helper functions:

- [`getMeasurements`](#getMeasurements)
- [`getTotalSizeOfItems`](#getTotalSizeofItems)
- [`getIndexByOffset`](#getIndexByOffset)
- [`getEnclosingIndex`](#getEnclosingIndex)
- [`resetFromIndex`](#resetFromIndex)
- [`clear`](#clear)

<br>
<br>
<br>

### `getMeasurements`

```ts
getMeasurements(index:number):{offset:number, size:number};
```

A helper function that returns an object containing the offset and size of the provided index. If using boundaries and the index is out of range, the closest boundary measurements will be returned.

<br>
<br>
<br>

### `getTotalSizeOfItems`

```ts
getTotalSizeOfItems():number;
```

A helper function that returns the total size of the _measured_ items. If an `estimatedItemSize` is provided, the total size will reflect the total size of the measured items plus the accumulated size of the unmeasured items multiplied by estimatedItemSize.

<br>
<br>
<br>

### `getIndexRangeFromOffsets`

```ts
getIndexRangeFromOffsets(startOffset:number, endOffset:number):[startIndex:number, endIndex:number];
```

A helper function that returns the start index and end index from the provided offset range.

<br>
<br>
<br>

### `getIndexByOffset`

```ts
getIndexByOffset(offset:number):number;
```

A helper function that returns the index closest to the given offset.

<br>
<br>
<br>

### `getEnclosingIndex`

```ts
getEnclosingIndex(index:number, threshold:number):number;
```

A helper function that returns the index closest to the provided index with the addition of a threshold. This function is useful for finding the end index of a range.

<br>
<br>
<br>

### `resetFromIndex`

```ts
resetFromIndex(index:number, canForceUpdate = true):[start:number, end:number]
```

A helper function that clears the cached offsets and sizes from the provided index through the max measured index.

<br>
<br>
<br>

### `clear`

```ts
clear():void
```

A helper function that clears the cache of all indexed offsets and sizes.

<br>
<br>
<br>
