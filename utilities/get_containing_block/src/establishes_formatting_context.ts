const isParentResponsive = (element: HTMLElement) => {
  const parent = element.parentNode;
  if (parent instanceof HTMLElement) {
    const { display } = getComputedStyle(parent);
    return display === 'flex' || display === 'grid';
  }
  return false;
};

const DISPLAY_PROPS_CHANGING_CONTEXT = ['table', 'inline-block', 'grid', 'flex', 'flow-root'];
const doesDisplayChangeContext = (display: string, element: HTMLElement) => {
  return (
    DISPLAY_PROPS_CHANGING_CONTEXT.some((prop) => display.includes(prop)) ||
    (display !== 'flex' && display !== 'grid' && display !== 'table' && isParentResponsive(element))
  );
};

const POSITION_PROPS_CHANGING_CONTEXT = ['absolute', 'fixed', 'sticky'];
const doesPositionChangeContext = (position: string) =>
  POSITION_PROPS_CHANGING_CONTEXT.some((prop) => prop === position);

const doesOverflowChangesContext = (overflow: string) =>
  overflow !== 'visible' && overflow !== 'clip';

const doesContainChangeContext = (contain: string) => {
  return contain === 'layout' || contain === 'content' || contain === 'strict';
};
/*
The <html> element is not the only element capable of creating a block formatting context. Any block-level element can be made to create a BFC by the application of certain CSS properties.

A new BFC is created in the following situations:

- elements made to float using float
- absolutely positioned elements (including position: fixed or position: sticky)
- elements with display: inline-block
- table cells or elements with display: table-cell, including anonymous table cells created when using the display: table-* properties
- table captions or elements with display: table-caption
- block elements where overflow has a value other than visible
- elements with display: flow-root or display: flow-root list-item
- elements with contain: layout, content, or strict
- flex items
- grid items
- multicol containers
- elements with column-span set to all
*/

const establishesFormattingContext = (element: HTMLElement, style: CSSStyleDeclaration) => {
  const {
    float,
    position,
    display,
    overflow,
    columnCount,
    columnSpan,
    flex,
    // @ts-ignore
    contain,
  } = style;

  return (
    doesPositionChangeContext(position) ||
    doesDisplayChangeContext(display, element) ||
    doesOverflowChangesContext(overflow) ||
    columnCount !== 'auto' ||
    columnSpan === 'all' ||
    float !== 'none' ||
    doesContainChangeContext(contain) // unsupported by safari
  );
};

export default establishesFormattingContext;
