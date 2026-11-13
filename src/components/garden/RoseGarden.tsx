'use client';

import styles from './RoseGarden.module.css';
import siteConfig from '../../config/site.config';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import { RoseCluster, SingleRose, RoseBorderStrip, RoseBud } from '../art/Roses';
import { Petal } from '../art/Petal';

/**
 * Step 2 — the secret rose garden. A living, breathing section of the
 * fixed floral world, with the section heading floating among the roses.
 */
export function RoseGarden() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.25);
  const { heading, subheading } = siteConfig.garden;

  const driftingPetals = [
    { x: 18, size: 26, delay: -4, dur: 22, sway: 60 },
    { x: 52, size: 18, delay: -12, dur: 26, sway: -48 },
    { x: 78, size: 30, delay: -18, dur: 24, sway: 44 },
  ];

  return (
    <section ref={ref} className={styles.section} aria-labelledby="garden-heading">
      <div className={styles.glow} aria-hidden="true" />

      {/* flanking clusters */}
      <div className={`${styles.cluster} ${styles.clusterLeft}`} aria-hidden="true">
        <RoseCluster className={styles.art} />
      </div>
      <div className={`${styles.cluster} ${styles.clusterRight}`} aria-hidden="true">
        <RoseCluster className={styles.art} />
      </div>

      {/* accents */}
      <SingleRose className={`${styles.roseAccent} ${styles.roseAccentA}`} rotate={-18} />
      <SingleRose variant="deep" className={styles.roseAccentB} rotate={16} />
      <div className={styles.budAccent} aria-hidden="true">
        <svg viewBox="0 0 60 90" className={styles.budArt}>
          <g transform="translate(30 80) scale(1.3)">
            <RoseBud variant="deep" />
          </g>
        </svg>
      </div>

      {/* drifting petals inside the garden */}
      <div className={styles.petals} aria-hidden="true">
        {driftingPetals.map((p, i) => (
          <span
            key={i}
            className={styles.petalSlot}
            style={
              {
                left: `${p.x}%`,
                width: `${p.size}px`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.dur}s`,
                '--sway': `${p.sway}px`,
              } as React.CSSProperties
            }
          >
            <Petal />
          </span>
        ))}
      </div>

      <div className={`${styles.content} ${visible ? styles.contentVisible : ''}`}>
        <p className={styles.eyebrow} aria-hidden="true">
          ✦
        </p>
        <h2 id="garden-heading" className="section-heading">
          {heading}
        </h2>
        <p className={styles.sub}>{subheading}</p>
        <div className={styles.divider} aria-hidden="true" />
      </div>

      {/* garden floor */}
      <div className={styles.floor} aria-hidden="true">
        <RoseBorderStrip className={styles.floorArt} />
      </div>
    </section>
  );
}

export default RoseGarden;
