'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Lightbox.module.css';
import type { Photo } from '../../config/site.config';
import { useEscapeKey, useFocusTrap, useScrollLock } from '../../hooks/useOverlay';
import { SingleRose } from '../art/Roses';

interface Props {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (dir: 1 | -1) => void;
}

/** Full-screen photograph viewer with keyboard, swipe and focus support. */
export function Lightbox({ photos, index, onClose, onNavigate }: Props) {
  const photo = photos[index];
  const [failed, setFailed] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const touchX = useRef<number | null>(null);

  useScrollLock(true);
  const containerRef = useFocusTrap<HTMLDivElement>(true, closeBtnRef);
  useEscapeKey(true, onClose);

  // Reset failure state when switching photographs, and catch
  // load/error events that fired before React attached its handler.
  useEffect(() => {
    setFailed(false);
    const img = imgRef.current;
    if (!img) return;
    if (img.complete && img.naturalWidth === 0) setFailed(true);
  }, [index]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.changedTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(delta) > 56) onNavigate(delta < 0 ? 1 : -1);
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph: ${photo.caption}`}
      ref={containerRef}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <SingleRose className={styles.roseLeft} rotate={-24} />
      <SingleRose variant="deep" className={styles.roseRight} rotate={18} />

      <button
        type="button"
        ref={closeBtnRef}
        className={styles.close}
        onClick={onClose}
        aria-label="Close photograph"
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path
            d="M6 6 L18 18 M18 6 L6 18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </button>

      <button
        type="button"
        className={`${styles.nav} ${styles.navPrev}`}
        onClick={() => onNavigate(-1)}
        aria-label="Previous photograph"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M15 5 L8 12 L15 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>

      <figure
        className={styles.figure}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className={styles.imageFrame}>
          {failed ? (
            <div className={styles.missing}>
              <span aria-hidden="true">❦</span>
              <p>Photograph not found</p>
              <code>{photo.src}</code>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              ref={imgRef}
              src={photo.src}
              alt={photo.alt}
              decoding="async"
              className={styles.image}
              onError={() => setFailed(true)}
            />
          )}
        </div>
        <figcaption className={styles.captionRow}>
          <span className={styles.caption}>{photo.caption}</span>
          <span className={styles.counter} aria-live="polite">
            {index + 1} / {photos.length}
          </span>
        </figcaption>
      </figure>

      <button
        type="button"
        className={`${styles.nav} ${styles.navNext}`}
        onClick={() => onNavigate(1)}
        aria-label="Next photograph"
      >
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
          <path d="M9 5 L16 12 L9 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </button>
    </div>
  );
}

export default Lightbox;
