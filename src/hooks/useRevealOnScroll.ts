'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element when it scrolls into view.
 * Adds `is-visible` to the element's class list (works with `.reveal`).
 * Falls back to visible immediately when IntersectionObserver is missing.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export default useRevealOnScroll;
