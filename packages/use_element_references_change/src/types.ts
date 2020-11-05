export type ElementReference = HTMLElement | null | undefined;

export type ReferenceIndex = number;

export type ChangedElementReferences = [ReferenceIndex, ElementReference];

export type ReferencedElement = [ReferenceIndex, HTMLElement];

export type ReferenceCallback = (referencedElements: ReferencedElement[]) => void;

export interface UseElementReferencesOptions {
  onReference?: ReferenceCallback;
  onRemove?: ReferenceCallback;
  onUnmount?(): void;
}
