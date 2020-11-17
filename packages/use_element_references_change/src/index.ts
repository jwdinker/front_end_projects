import * as React from 'react';
import getElement, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import { ReferencedElement, UseElementReferencesOptions } from './types';

const { useRef, useEffect } = React;

export { ElementOrReference } from '@jwdinker/get-element-or-reference';
export { default as getElementOrReference } from '@jwdinker/get-element-or-reference';
export * from './types';

/**
 *
 * @param references a single instance or array of HTML element / ref objects
 * referencing an html element
 *
 * @param options An object containing callbacks tied to changes values of the reference.
 *
 * @param options.onReference  A callback invoked anytime a reference changes
 * from undefined/null to HTMLElement.  An array of arrays containing the index
 * and corresponding HTMLElement is passed to the callback.
 *
 * @param options.onDereference A callback invoked anytime a reference changes
 * from HTMLElement to null. An array of arrays containing the index and
 * previously referenced HTMLElement is passed to the callback.
 *
 * @param options.onUnmount A callback invoked when the hook executes the final cleanup.
 */
function useElementReferencesChange(
  references: ElementOrReference | ElementOrReference[],
  options: UseElementReferencesOptions
) {
  const { onReference = () => {}, onDereference = () => {}, onUnmount = () => {} } = options;

  const hasMounted = useRef(false);
  const previousReferences = useRef<Array<HTMLElement | null | undefined>>([]);
  const lastSingleReference = useRef<HTMLElement | null>();
  const handleUnmount = useRef(onUnmount);

  const onMultiReferenced = (referencedElements: ElementOrReference[]) => {
    const nextReferences = [];

    const referenced: ReferencedElement[] = [];
    const removed: ReferencedElement[] = [];

    for (let index = 0; index < referencedElements.length; index += 1) {
      const lastReference = previousReferences.current[index];

      const reference = referencedElements[index];
      const element = getElement(reference);

      if (element instanceof HTMLElement) {
        /*
        ! Important  
          hasMounted.current prevents stale values when using fast refresh.
          useRef values are not cleared with fast refresh so previous referenced
          values will match current values if the element references do not
          change.  Review the link for more info: 
          - https://reactnative.dev/docs/fast-refresh#fast-refresh-and-hooks.
         */

        if (element !== lastReference || !hasMounted.current) {
          referenced.push([index, element]);
        }
      }

      if (lastReference instanceof HTMLElement && element === null) {
        removed.push([index, lastReference]);
      }
      nextReferences.push(element);
    }

    const hasReferenced = referenced.length > 0;
    const hasRemoved = removed.length > 0;

    if (hasRemoved) {
      onDereference(removed);
    }

    if (hasReferenced) {
      onReference(referenced);
    }

    previousReferences.current = nextReferences;
  };

  const onSingleReference = (singleReference: ElementOrReference) => {
    const element = getElement(singleReference);

    const hasChanged = lastSingleReference.current !== element;
    if (hasChanged) {
      if (element instanceof HTMLElement) {
        const referenced: ReferencedElement[] = [];
        referenced.push([0, element]);
        onReference(referenced);
      }
      if (lastSingleReference.current instanceof HTMLElement && element === null) {
        onDereference([[0, lastSingleReference.current]]);
      }
    }

    lastSingleReference.current = element;
  };

  useEffect(() => {
    // handleUnmount is saved on each render to prevent onUnmou from being triggered if
    handleUnmount.current = onUnmount;

    if (Array.isArray(references)) {
      if (references.length > 0) {
        onMultiReferenced(references);
      }
    } else {
      onSingleReference(references);
    }
  });

  /*
  hasMounted.current is set to true on 1st useEffect call and then reset when
  the hook runs the final cleanup effect.  This is done to account for fast
  refresh.
  */
  useEffect(() => {
    hasMounted.current = true;
    return () => {
      hasMounted.current = false;
      handleUnmount.current();
    };
  }, []);
}

export default useElementReferencesChange;
