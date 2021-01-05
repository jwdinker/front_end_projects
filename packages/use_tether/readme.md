# useTether

`useTether` is React hook for deriving position of elements based off an anchor element.

Full documentation can be [found here](https://www.notion.so/dinker/useTether-8ca63e23c8274ecca67cfe6b4c756a15).
<br>

<br><br><br><br><br><br>

# Installation

```
npm install @jwdinker/use-tether
```

<br><br><br>

# Usage

```jsx
import useTether, { useTetheredTransform } from '@jwdinker/use-tether';

function Component() {
  const anchor = useRef();

  const item1 = useRef();
  const item2 = useRef();

  const tetherables = [item1, item2];

  const [measurements] = useTether(anchor, tetherables, 'bottom');

  useTetheredTransform(tetherables, measurements);

  return (
    <Page>
      <Item1 ref={item1}>item 1</Item1>
      <Item2 ref={item2}>item 2</Item2>

      <ScrollingContainer>
        <RandomElement />
        <NestedElement>
          <Anchor ref={anchor}>anchor</Anchor>
        </NestedElement>
        <RandomElement />
      </ScrollingContainer>
    </Page>
  );
}
```
