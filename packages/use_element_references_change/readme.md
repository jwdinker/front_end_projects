# useElementsReferencesChange

`useElementsReferencesChange` is a React hook that adds callbacks to the lifecycle of a single or multiple referenced element. This hook has some hacky use cases but can come in handy if tracking referenced/dereferenced HTML elements in a list with unrelated side effects.

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-elements-references-change
```

<br><br><br><br><br><br>

# Usage

```jsx
import  from '@jwdinker/use-elements-references-change';

function Component() {
  const _1 = useRef();
  const _2 = useRef();
  const _3 = useRef();
  const _4 = useRef();

  const [numberOfRefs, setNumberOfRefs] = useState(3);

  const refs = [_1, _2, _3, _4];

  useElementsReferencesChange(refs, {
    onReference: (referenced) => {
      // do stuff with recently referenced elements
    },
    onDereference: (dereferenced) => {
		 // do stuff with recently dereferenced elements
    },
  });

  const add = () => {
    setNumberOfRefs((previous) => {
      if (previous < 3) {
        return previous + 1;
      }
      return previous;
    });
  };

  const remove = () => {
    setNumberOfRefs((previous) => {
      if (previous > 0) {
        return previous - 1;
      }
      return previous;
    });
  };

  return (
    <>
      <Button onClick={add}>add</Button>
      <Button onClick={remove}>remove</Button>

      {upTo(0, numberOfRefs, (index) => {
        return (
          <Item key={index} ref={refs[index]}>
            {index}
          </Item>
        );
      })}
    </>
  );
}
```

<br><br><br><br><br><br>

# Arguments

`useElementsReferencesChange` accepts the follow arguments:

<br>

## element(s)

`object | array`

```tsx
type HTMLElementReference = React.RefObject<HTMLElement | undefined | null>;
```

A single React reference or array of react references to an HTML element.

<br><br>

## options

`object`

---

<br>

onReference `function`

```ts
type ReferencedElement = [ReferenceIndex, HTMLElement];

onReference(referencedElements: DereferencedElement[]) => void;
```

- Called when a React referenced value changes from `undefined` to an `HTMLElement`.
- Returns an array of arrays containing the ref index and the HTML Element at that index.

<br>

---

<br>

onDereference `function`

```ts
type DereferencedElement = [ReferenceIndex, HTMLElement];

onDereference(dereferencedElements: DereferencedElement[]) => void;
```

- Called when a React referenced value changes from `HTMLElement` to `null`.
- Returns an array of arrays containing the ref index and the previously referenced HTML Element at that index.

<br>

---

<br>

onUnmount `function`

```tsx
onUnmount() => void;
```

Called during the unmount phase of `useElementsReferencesChange`

<br>

---
