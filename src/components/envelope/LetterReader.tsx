'use client';

import { useRef, useState } from 'react';
import styles from './Envelope.module.css';
import siteConfig from '../../config/site.config';
import LoveLetter from '../letter/LoveLetter';
import { useEscapeKey, useFocusTrap, useScrollLock } from '../../hooks/useOverlay';

interface Props {
  /** Forwarded so the section can FLIP the letter from envelope to reader. */
  sheetRef: React.RefObject<HTMLDivElement | null>;
  closing: boolean;
  reduced: boolean;
  onClose: () => void;
}

/**
 * LETTER_READABLE — the full-screen reading experience.
 * The letter is scrollable, the envelope waits underneath.
 */
export function LetterReader({ sheetRef, closing, reduced, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useScrollLock(true);
  const containerRef = useFocusTrap<HTMLDivElement>(true, closeBtnRef);
  useEscapeKey(true, onClose);

  return (
    <div
      className={`${styles.reader} ${closing ? styles.readerClosing : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Your letter"
      ref={containerRef}
    >
      <div
        className={styles.readerBackdrop}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className={styles.readerViewport}
        onScroll={(e) => {
          if (!scrolled && e.currentTarget.scrollTop > 30) setScrolled(true);
        }}
      >
        <div className={styles.readerSheet} ref={sheetRef}>
          <LoveLetter />
        </div>
      </div>

      <div className={styles.readerBar}>
        <p className={styles.readingHint}>{siteConfig.envelope.readingHint}</p>
        <button type="button" ref={closeBtnRef} className={styles.foldBtn} onClick={onClose}>
          Fold it back
        </button>
      </div>

      {!reduced && !closing && (
        <div className={`${styles.scrollCue} ${scrolled ? styles.scrollCueHidden : ''}`} aria-hidden="true">
          <svg viewBox="0 0 24 24" width="26" height="26">
            <path
              d="M6 9 L12 15 L18 9"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

export default LetterReader;
