'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Locks/unlocks background scrolling while an overlay is open.
 * Uses a counter so nested overlays compose safely.
 *
 * Implemented by fixing <body> at the current scroll offset (the
 * standard technique): the viewport never jumps, and the scroll
 * position is restored exactly on unlock.
 */
let lockCount = 0;
let savedScrollY = 0;

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    if (lockCount === 0) {
      savedScrollY = window.scrollY;
      const body = document.body;
      body.dataset.scrollLocked = 'true';
      body.style.position = 'fixed';
      body.style.top = `-${savedScrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount <= 0) {
        lockCount = 0;
        const body = document.body;
        delete body.dataset.scrollLocked;
        body.style.position = '';
        body.style.top = '';
        body.style.left = '';
        body.style.right = '';
        body.style.width = '';
        // 'instant' bypasses html's scroll-behavior: smooth, which
        // would otherwise animate (and get interrupted mid-flight).
        window.scrollTo({ top: savedScrollY, left: 0, behavior: 'instant' });
      }
    };
  }, [active]);
}

/**
 * Traps focus inside a container while `active`, moves initial focus to
 * `initialFocusRef` (or the container), and restores focus on deactivate.
 */
export function useFocusTrap<T extends HTMLElement>(
  active: boolean,
  initialFocusRef?: React.RefObject<HTMLElement | null>,
) {
  const containerRef = useRef<T | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const container = containerRef.current;

    const target = (initialFocusRef?.current ?? container) as HTMLElement | null;
    // Defer so entrance transitions have begun
    const raf = requestAnimationFrame(() => target?.focus({ preventScroll: true }));

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !container) return;

      const focusables = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      returnFocusRef.current?.focus({ preventScroll: true });
    };
  }, [active, initialFocusRef]);

  return containerRef;
}

/** Calls `handler` when Escape is pressed while `active`. */
export function useEscapeKey(active: boolean, handler: () => void) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!active) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handlerRef.current();
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active]);
}

/** Stable "run once" timeout that cleans up on unmount. */
export function useTimeout() {
  const ref = useRef<number | null>(null);

  const clear = useCallback(() => {
    if (ref.current !== null) {
      window.clearTimeout(ref.current);
      ref.current = null;
    }
  }, []);

  const set = useCallback(
    (fn: () => void, ms: number) => {
      clear();
      ref.current = window.setTimeout(fn, ms);
    },
    [clear],
  );

  useEffect(() => clear, [clear]);

  return { set, clear };
}
