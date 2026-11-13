'use client';

import { useCallback, useRef, useState } from 'react';

/**
 * ═══════════════════════════════════════════════════════════
 *  Envelope animation state machine
 *
 *  CLOSED → SEAL_BREAK → FLAP_OPEN → LETTER_EMERGE
 *         → LETTER_EXPAND → LETTER_READABLE
 *
 *  Each stage runs to completion before the next begins.
 *  Clicks while a sequence is running are ignored.
 * ═══════════════════════════════════════════════════════════
 */

export type EnvelopeState =
  | 'CLOSED'
  | 'SEAL_BREAK'
  | 'FLAP_OPEN'
  | 'LETTER_EMERGE'
  | 'LETTER_EXPAND'
  | 'LETTER_READABLE';

/** Stage durations in ms (target: ~4s total). */
const DURATIONS = {
  SEAL_BREAK: 780,
  FLAP_OPEN: 980,
  LETTER_EMERGE: 1150,
  LETTER_EXPAND: 720,
  SETTLE: 60,
};

/** Short, near-instant stages for prefers-reduced-motion. */
const REDUCED_DURATIONS = {
  SEAL_BREAK: 140,
  FLAP_OPEN: 180,
  LETTER_EMERGE: 220,
  LETTER_EXPAND: 140,
  SETTLE: 40,
};

interface Options {
  reducedMotion: boolean;
}

export function useEnvelopeMachine({ reducedMotion }: Options) {
  const [state, setStateRaw] = useState<EnvelopeState>('CLOSED');
  const [running, setRunning] = useState(false);

  const stateRef = useRef<EnvelopeState>('CLOSED');
  const runningRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  const setState = useCallback((next: EnvelopeState) => {
    stateRef.current = next;
    setStateRaw(next);
  }, []);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** Queue the next stage — strictly sequential, one pending timer. */
  const step = useCallback(
    (fn: () => void, ms: number) => {
      clearTimer();
      timerRef.current = window.setTimeout(fn, ms);
    },
    [clearTimer],
  );

  /** Runs every stage following the given entry point. */
  const runSequence = useCallback(
    (entry: 'CLOSED' | 'FLAP_OPEN') => {
      const D = reducedRef.current ? REDUCED_DURATIONS : DURATIONS;
      runningRef.current = true;
      setRunning(true);

      const toEmerge = () => {
        step(() => {
          setState('LETTER_EMERGE');
          step(() => {
            setState('LETTER_EXPAND');
            step(() => {
              setState('LETTER_READABLE');
              runningRef.current = false;
              setRunning(false);
            }, D.LETTER_EXPAND);
          }, D.LETTER_EMERGE);
        }, D.SETTLE);
      };

      if (entry === 'CLOSED') {
        step(() => {
          setState('SEAL_BREAK');
          step(() => {
            setState('FLAP_OPEN');
            toEmerge();
          }, D.SEAL_BREAK);
        }, D.SETTLE);
      } else {
        toEmerge();
      }
    },
    [step, setState],
  );

  /** Begin (or resume) the opening sequence. Ignored while running. */
  const start = useCallback(() => {
    if (runningRef.current) return;
    const current = stateRef.current;
    if (current === 'LETTER_READABLE') return;
    runSequence(current === 'CLOSED' ? 'CLOSED' : 'FLAP_OPEN');
  }, [runSequence]);

  /** Fold the letter back into the envelope (closes reading mode). */
  const closeLetter = useCallback(() => {
    if (runningRef.current) return;
    clearTimer();
    if (stateRef.current === 'LETTER_READABLE') setState('CLOSED');
  }, [clearTimer, setState]);

  const sealIntact = state === 'CLOSED';
  const reading = state === 'LETTER_READABLE';

  return { state, running, sealIntact, reading, start, closeLetter };
}

export default useEnvelopeMachine;
