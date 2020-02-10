# useElementVisibility

useElementVisibility is a utility hook that generates detailed information about
the position of an element relative to its container, including:

- whether the element is visible or not.
- sides of the container the element is touching.
- the sides in which the element is entering, exiting, or overflowing.
- the % of the element that is visible within the container.
- the amount of pixels visible on both the x and y axis.

</br>
</br>

## Install

**yarn**

`yarn add @jwdinker/use-element-visibility`

**npm**

`npm install @jwdinker/use-element-visibility`

</br>
</br>

## Usage

```javascript
// Pass in the element and container's top, left, height, width offsets.
const { visible, at, entering, exiting, overflowing, pct, px } = useElementVisibility(
  elementOffsets,
  containerOffsets
);
```

</br>
</br>

## Example

```javascript
import React, { useEffect, useState, useRef } from 'react';
import useElementVisibility from '@jwdinker/use-element-visibility';
import exampleStyles from './examples.css';

const INITIAL_MEASUREMENTS = {
  top: 0,
  left: 0,
  right: 0,
  height: 0,
  width: 0,
};

const Example = () => {
  const element = useRef();
  const container = useRef();
  const [measurements, setMeasurements] = useState({
    element: INITIAL_MEASUREMENTS,
    container: INITIAL_MEASUREMENTS,
  });

  useEffect(() => {
    const scroller = container.current;
    const handler = () => {
      setMeasurements({
        element: element.current.getBoundingClientRect(),
        container: container.current.getBoundingClientRect(),
      });
    };

    scroller.addEventListener('scroll', handler);

    return () => {
      scroller.removeEventListener('scroll', handler);
    };
  }, []);

  const state = useElementVisibility(measurements.element, measurements.container);

  const { visible, at, entering, exiting, overflowing, pct, px } = state;

  return (
    <div className="full-screen">
      <div ref={container} className="full-screen scroller">
        <div className={'overflowing-container'}>
          <div ref={element} className="item"></div>
        </div>
      </div>
    </div>
  );
};

export default Example;
```
