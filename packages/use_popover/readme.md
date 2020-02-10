# Watchtower

A collection of react components and hooks for monitoring the size and positions of an element within a container.

<br/>
<br/>

## Installation

### yarn

`yarn add @jwdinker/watchtower`

### npm

`npm install @jwdinker/watchtower`

<br/>
<br/>

## Usage

For the best performance, combine `WatchTower` and `useBeacon`. 

`WatchTower` plays the role of provider.
1. It monitors changes of scroll width and height in order to notify elements they need to resize, avoiding onload callbacks
in order to remeasure elements.
2. It functions as a single source of truth, providing the scroll top and left values in order to update cached offsets so elements
don't need to use an interval to remeasure.

`useBeacon` consumes the scroll values from the `WatchTower` provider and updates the cached offets.

Don't have a lot of elements to track? The useWatchTower hook combines the roles of `WatchTower` and `useBeacon`
into a a single hook but has a higher performance cost as a relies on interval calls to getBoundingClientRect.

<br/>
<br/>

```javascript
import React, { useRef, useMemo } from "react";
import { WatchTower, useBeacon } from "@jwdinker/use-watch-tower";

const Item = ({ index }) => {
  const ref = useRef();
  // 2. Pass any nested ref to useOffsets.
  const measurements = useBeacon(ref);

  const {element, container, scroll} = measurements

  // 3.  Do stuff with measurements.

  // 4. Make sure to wrap element in useMemo to prevent unnecessary rerenders.
  return useMemo(() => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div
          ref={ref}
          style={{
            minHeight: "300px",
            minWidth: "300px",
            boxShadow:
              "0px 5px 15px rgba(0, 0, 0, 0.05), 0px 1px 3px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px"
          }}
        ></div>
      </div>
    );
  }, []);
};

// 1. Pass the scrollable container's ref to WatchTower or if scrolling the window pass in window.
function Example() {
  const scrollableElementRef = useRef();
  return (
    <WatchTower ref={scrollableElementRef} interval={500}>
      <div
        ref={scrollableElementRef}
        style={{
          height: "100%",
          width: "100%",
          overflow: "scroll"
        }}
      >
        <Item />
        <Item />
        <Item />
      </div>
    </WatchTower>
  );
}

export default Example;
```

<br/>
<br/>

## WatchTower

### Props

1. interval - the span of time in milliseconds before rechecking the scroll height and width of the container.
2. ref - the scrollable container. Can be either a react ref or window.

<br/>
<br/>

## useBeacon / useWatchTower

### Props

useBeacon and useWatchTower hook take a single argument of a react ref.
<br/>
<br/>

### Return Value

The return value is an object containing measurements of the element, the element's scroll container, and the scroll values.

```javascript
const measurements = useBeacon(ref); //or useWatchTower(ref)

const { element, container, scroll } = measurements;
```

**element** - the offsets of the element ref passed into useBeacon or useWatchTower.

- top
- bottom
- left
- right
- height
- width

**container** - the scrollable ancestor's offsets.

- top
- bottom
- left
- right
- height
- width

**scroll** - the scrollable ancestor's current scroll values and scroll dimensions.

- top
- left
- height
- width
- delta 
  - top
  - left

