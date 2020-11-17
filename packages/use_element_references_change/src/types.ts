export type ReferenceIndex = number;

export type ReferencedElement = [ReferenceIndex, HTMLElement];

export type ReferenceCallback = (referencedElements: ReferencedElement[]) => void;

export interface UseElementReferencesOptions {
  /**
   * A callback invoked anytime a reference changes from undefined/null to
   * HTMLElement. An array of arrays containing the index and corresponding
   * HTMLElement is passed to the callback.
   */
  onReference?: ReferenceCallback;

  /**
   * A callback invoked anytime a reference changes from HTMLElement to null excluding the unmount. An
   * array of arrays containing the index and previously referenced HTMLElement
   * is passed to the callback.
   */
  onDereference?: ReferenceCallback;

  /**
   * A callback invoked when the hook executes the final cleanup.
   */
  onUnmount?(): void;
}
