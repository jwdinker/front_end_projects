import { useEffect, useRef, useCallback, useState } from 'react';
import { createPortal } from 'react-dom';
import useSSR from '@jwdinker/use-ssr';

function usePortal(applyStyle = () => {}, parent = null) {
  // protect prevents functions from executing if the window or document is not present
  const [protect] = useSSR();
  const portal = useRef();
  const host = useRef();
  const [isOpen, setOpen] = useState(false);

  // host is either a custom ref or it is the document body
  useEffect(() => {
    host.current = parent && parent.current ? parent.current : document.body;
  }, [parent]);

  // some helper functions to prevent duplication
  const onOpened = useCallback((fn) => portal.current && fn(), []);
  const onClosed = useCallback((fn) => !portal.current && fn(), []);

  const remove = useCallback(() => {
    return protect(() => {
      host.current.removeChild(portal.current);
      portal.current = null;
    });
  }, [host, protect]);

  const close = useCallback(() => {
    setOpen(false);
    onOpened(remove);
  }, [onOpened, remove]);

  const attach = useCallback(() => {
    protect(() => {
      return host.current.appendChild(portal.current);
    });
  }, [host, protect]);

  // Only basic styles can be applied as the portal is treated as a container so
  // we really don't want to be imperatively setting styles.  If I really want
  // to change up the styles I can nested a styled-components container in there
  // or some other kind of component.
  const create = useCallback(() => {
    protect(() => {
      portal.current = document.createElement('div');
      applyStyle(portal.current);
    });
  }, [applyStyle, protect]);

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
    if (portal.current && isOpen) {
      attach();
    }
  }, [attach, isOpen]);

  // When the component unmounts, the portal element is removed
  useEffect(() => {
    return () => {
      onOpened(remove);
    };
  }, [onOpened, remove]);

  const Portal = useCallback(({ children }) => {
    if (portal.current) {
      return createPortal(children, portal.current);
    }
    return null;
  }, []);

  return [Portal, { open, close, toggle, isOpen, isClosed: !isOpen }];
}

export default usePortal;
