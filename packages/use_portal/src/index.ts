import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';

export interface UsePortalProps {
  applyStyle?(element?: HTMLDivElement): void;
  parent?: React.RefObject<HTMLElement> | null;
}

export interface UsePortalHelpers {
  /** Function that opens the portal */
  open(): void;
  close(): void;
  toggle(): void;
  isOpen: boolean;
  isClosed: boolean;
  reference: HTMLDivElement | null;
}

function usePortal({ applyStyle = () => {}, parent = null }: UsePortalProps = {}) {
  const portal = useRef<HTMLDivElement | null>(null);
  const host = useRef<HTMLElement>();
  const [isOpen, setOpen] = useState(false);
  const _applyStyle = useRef(applyStyle);

  useEffect(() => {
    _applyStyle.current = applyStyle;
  }, [applyStyle]);

  // host is either a custom ref or it is the document body
  useEffect(() => {
    host.current = parent && parent.current ? parent.current : document.body;
  }, [parent]);

  // some helper functions to prevent duplication
  const onOpened = useCallback((fn) => portal.current && fn(), []);
  const onClosed = useCallback((fn) => !portal.current && fn(), []);

  const remove = useCallback(() => {
    /* eslint-disable no-unused-expressions */

    host.current?.removeChild(portal.current as HTMLDivElement);

    /* eslint-enable  no-unused-expressions */
    portal.current = null;
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    onOpened(remove);
  }, [onOpened, remove]);

  const attach = useCallback(() => {
    return host.current?.appendChild(portal.current as HTMLDivElement);
  }, [host]);

  // Only basic styles can be applied as the portal is treated as a container so
  // we really don't want to be imperatively setting styles.  If I really want
  // to change up the styles I can nested a styled-components container in there
  // or some other kind of component.
  const create = useCallback(() => {
    portal.current = document.createElement('div');
    _applyStyle.current(portal.current);
  }, []);

  const open = useCallback(() => {
    onClosed(() => {
      create();
      setOpen(true);
    });
  }, [create, onClosed]);

  const toggle = useCallback(() => {
    if (portal.current) {
      return close();
    }
    return open();
  }, [close, open]);

  useEffect(() => {
    if (portal.current instanceof HTMLDivElement && isOpen) {
      attach();
    }
  }, [attach, isOpen]);

  // When the component unmounts, the portal element is removed
  useEffect(() => {
    return remove;
  }, [onOpened, remove]);

  const Portal = useCallback(({ children }: { children: React.ReactNode }) => {
    if (portal.current) {
      return createPortal(children, portal.current);
    }
    return null;
  }, []);

  return [
    Portal,
    {
      open,
      close,
      toggle,
      isOpen,
      isClosed: !isOpen,
      reference: portal.current,
    },
  ];
}

export default usePortal;
