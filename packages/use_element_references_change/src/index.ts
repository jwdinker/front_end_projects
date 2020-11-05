import * as React from 'react';
import getElement, { ElementOrReference } from '@jwdinker/get-element-or-reference';
import { ReferencedElement, UseElementReferencesOptions } from './types';

const { useRef, useEffect } = React;

export { ElementOrReference } from '@jwdinker/get-element-or-reference';
export { default as getElementOrReference } from '@jwdinker/get-element-or-reference';
export * from './types';

function useElementReferencesChange(
  references: ElementOrReference | ElementOrReference[],
  options: UseElementReferencesOptions
) {
  const { onReference = () => {}, onRemove = () => {}, onUnmount = () => {} } = options;

  const previousReferences = useRef<Array<HTMLElement | null | undefined>>([]);
  const lastSingleReference = useRef<HTMLElement | null>();
  const _onUnmount = useRef(onUnmount);

  useEffect(() => {
    _onUnmount.current = onUnmount;

    if (Array.isArray(references)) {
      const hasReferences = references.length > 0;
      if (hasReferences) {
        const nextReferences = [];

        const referenced: ReferencedElement[] = [];
        const removed: ReferencedElement[] = [];

        for (let index = 0; index < references.length; index += 1) {
          const lastReference = previousReferences.current[index];

          const reference = references[index];
          const element = getElement(reference);

          if (element !== lastReference && element instanceof HTMLElement) {
            referenced.push([index, element]);
          }
          if (lastReference instanceof HTMLElement && element === null) {
            removed.push([index, lastReference]);
          }
          nextReferences.push(element);
        }

        const hasReferenced = referenced.length > 0;
        const hasRemoved = removed.length > 0;

        if (hasRemoved) {
          onRemove(removed);
        }

        if (hasReferenced) {
          onReference(referenced);
        }
        previousReferences.current = nextReferences;
      }
    } else {
      const element = references && 'current' in references ? references.current : references;

      const hasChanged = lastSingleReference.current !== element;
      if (hasChanged) {
        if (element instanceof HTMLElement) {
          const referenced: ReferencedElement[] = [];
          referenced.push([0, element]);
          onReference(referenced);
        }
        if (lastSingleReference.current instanceof HTMLElement && element === null) {
          onRemove([[0, lastSingleReference.current]]);
        }
      }
      lastSingleReference.current = element;
    }
  });

  useEffect(() => {
    return () => {
      _onUnmount.current();
    };
  }, []);
}

export default useElementReferencesChange;
