import findAncestor from '@jwdinker/find-ancestor';
import hasOverrideProperty from './has_override_property';
import establishesFormattingContext from './establishes_formatting_context';

/*
Identifying the containing block The process for identifying the containing
block depends entirely on the value of the element's position property:
*/

/*
1. the position property is static, relative, or sticky, the containing block is
   formed by the edge of the content box of the nearest ancestor element that is
   either a block container (such as an inline-block, block, or list-item
   element) or establishes a formatting context (such as a table container, flex
   container, grid container, or the block container itself).
*/
const isContentEdgeBlock = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  const { display } = style;
  const hasNewFormattingContext =
    display === 'block' || establishesFormattingContext(element, style);
  return hasNewFormattingContext;
};

/*
2. If the position property is absolute, the containing block is formed by the
   edge of the padding box of the nearest ancestor element that has a position
   value other than static (fixed, absolute, relative, or sticky).

3. If the position property is fixed, the containing block is established by the
   viewport (in the case of continuous media) or the page area (in the case of
   paged media).
*/
const isAbsolutesAncestor = (element: HTMLElement) => {
  const style = getComputedStyle(element);
  const { position } = style;
  const isOveridden = hasOverrideProperty(style);
  return position !== 'static' || isOveridden;
};

export const getContentEdgeAncestor = (element: HTMLElement) => {
  return findAncestor(element, isContentEdgeBlock) || document.documentElement;
};

export const getAbsolutesAncestor = (element: HTMLElement) => {
  return findAncestor(element, isAbsolutesAncestor) || document.documentElement;
};

export const getFixedsAncestor = (element: HTMLElement) => {
  return findAncestor(element, hasOverrideProperty) || document.documentElement;
};

export const getContainingBlock = (element: HTMLElement) => {
  const html = document.documentElement;

  const style = getComputedStyle(element);

  const { position } = style;

  const hasContentEdge = position === 'static' || position === 'relative' || position === 'sticky';
  const isFixed = position === 'fixed';
  const isAbsolute = position === 'absolute';

  if (hasContentEdge) {
    return getContentEdgeAncestor(element);
  }
  if (isFixed) {
    return getFixedsAncestor(element);
  }

  if (isAbsolute) {
    return getAbsolutesAncestor(element);
  }

  return html;
};
