# useAnimationFrame

## Usage

useAnimationFrame will run on every frame unless the toggable option is set to `true`.

```javascript
import useAnimationFrame from '@jwdinker/use-animation-frame';

function MyComponent() {
  const [start, stop] = useAnimationFrame({
    onStart: () => {},
    onFrame: () => {},
    onCancel: () => {},
    delay: 0,
    toggable: false,
  });

  return <div />;
}
```
