# getSupportedEventOptions

`getSupportedEventOptions` is a helper function that checks/normalizes what event listener options are supported given an eventOptions object.

<br>

```javascript
const options = getSupportedEventOptions({ passive: true, capture: false, once: false });

element.addEventListener('event_name', handler, options);
```
