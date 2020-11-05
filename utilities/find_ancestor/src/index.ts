export type FindAncestorConditionalCallback = (parent: HTMLElement) => boolean;

/**
 *
 * @param element The starting node where the tree traversal starts prior to ascending through parent nodes.
 * @param callback A callback that returns whether the current node meets a particular condition.
 */
const findAncestor = (element: HTMLElement, callback: FindAncestorConditionalCallback) => {
  if (!callback) {
    throw Error('findAncestor requires a conditional callback');
  }
  let isSearching = true;
  let ancestor = null;
  let parent = element.parentNode;
  while (isSearching) {
    if (parent instanceof HTMLElement) {
      const isMatch = callback(parent);
      if (isMatch) {
        ancestor = parent;
        isSearching = false;
      } else {
        parent = parent.parentNode;
      }
    } else {
      isSearching = false;
    }
  }
  return ancestor;
};

export default findAncestor;
