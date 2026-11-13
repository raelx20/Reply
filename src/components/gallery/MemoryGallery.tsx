'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './MemoryGallery.module.css';
import siteConfig, { type Photo } from '../../config/site.config';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import { Lightbox } from './Lightbox';

/** Frame rotation pattern — deterministic, never identical neighbours. */
const ROTATIONS = [-2.4, 1.7, -1.1, 2.3, -1.8, 1.2, -2.1, 1.5];

function PhotoFrame({
  photo,
  index,
  visible,
  onOpen,
}: {
  photo: Photo;
  index: number;
  visible: boolean;
  onOpen: (index: number) => void;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rotation = ROTATIONS[index % ROTATIONS.length];

  // Catch load/error events that fired before React attached its
  // handler (server-rendered images can finish during initial parse).
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (img.complete) {
      if (img.naturalWidth === 0) setFailed(true);
      else setLoaded(true);
    }
  }, []);

  return (
    <button
      type="button"
      className={`${styles.frame} ${visible ? styles.frameVisible : ''}`}
      style={
        {
          '--rot': `${rotation}deg`,
          '--delay': `${(index % 3) * 0.12 + Math.floor(index / 3) * 0.08}s`,
        } as React.CSSProperties
      }
      onClick={() => onOpen(index)}
      aria-label={`Open photograph: ${photo.caption}`}
    >
      <span className={styles.tape} aria-hidden="true" />
      <span className={styles.photoBox} style={{ aspectRatio: photo.aspect ?? '4 / 5' }}>
        {failed ? (
          <span className={styles.missing}>
            <span className={styles.missingIcon} aria-hidden="true">
              ❦
            </span>
            <span className={styles.missingTitle}>Photograph not found</span>
            <span className={styles.missingHint}>
              add it at
              <br />
              <code>{photo.src}</code>
            </span>
          </span>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={imgRef}
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
            className={`${styles.photo} ${loaded ? styles.photoLoaded : ''}`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
          />
        )}
      </span>
      <span className={styles.caption}>{photo.caption}</span>
      <span className={styles.frameSheen} aria-hidden="true" />
    </button>
  );
}

/**
 * Step 3 — "Little pieces of us." A premium romantic scrapbook.
 */
export function MemoryGallery() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.12);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photos = siteConfig.gallery.photos;

  const close = useCallback(() => setLightboxIndex(null), []);
  const navigate = useCallback(
    (dir: 1 | -1) => {
      setLightboxIndex((i) => (i === null ? i : (i + dir + photos.length) % photos.length));
    },
    [photos.length],
  );

  return (
    <section
      ref={ref}
      className={`${styles.section} ${lightboxIndex !== null ? styles.sectionOverlay : ''}`}
      aria-labelledby="gallery-heading"
      id="memories"
    >
      <header className={`${styles.header} ${visible ? styles.headerVisible : ''}`}>
        <p className={styles.eyebrow} aria-hidden="true">
          ✦ our memories ✦
        </p>
        <h2 id="gallery-heading" className="section-heading">
          {siteConfig.gallery.heading}
        </h2>
        <p className="section-subheading">{siteConfig.gallery.subheading}</p>
        <div className={styles.divider} aria-hidden="true" />
      </header>

      <ul className={styles.grid}>
        {photos.map((photo, i) => (
          <li key={photo.id} className={styles.item}>
            <PhotoFrame photo={photo} index={i} visible={visible} onOpen={setLightboxIndex} />
          </li>
        ))}
      </ul>

      <p className={styles.hint}>tap a photograph to hold it closer</p>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={close}
          onNavigate={navigate}
        />
      )}
    </section>
  );
}

export default MemoryGallery;
