import { useRef, useCallback, useEffect } from 'react';

type OnSetElement = (currentElementReference: HTMLElement) => void;
type OnElementChange = (previousElementReference: HTMLElement) => void;

interface UseElementChangeSavedCallbacks {
  onSet: OnSetElement;
  onChange: OnElementChange;
}

type SetElement = (reference: HTMLElement | null) => void;

function useElementReferenceChange(onSet: OnSetElement, onChange: OnElementChange): SetElement {
  const element = useRef<HTMLElement>();
  const callbacks = useRef<UseElementChangeSavedCallbacks>({ onSet, onChange });

  useEffect(() => {
    callbacks.current = {
      onSet,
      onChange,
    };
  }, [onChange, onSet]);

  const set = useCallback((reference: HTMLElement | null) => {
    if (reference && reference instanceof HTMLElement) {
      if (element.current instanceof HTMLElement) {
        if (element.current !== reference) {
          callbacks.current.onChange(element.current);
        }
      }
      element.current = reference;
      callbacks.current.onSet(element.current);
    }
  }, []);

  return set;
}

export default useElementReferenceChange;
