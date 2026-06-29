import { useEffect, useRef } from 'react';

export function useRouteFocus(dependency) {
  const ref = useRef(null);

  useEffect(() => {
    ref.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dependency]);

  return ref;
}
