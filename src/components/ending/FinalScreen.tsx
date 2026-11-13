'use client';

import styles from './FinalScreen.module.css';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import { HeartGlow, TinyHeart } from '../art/Ornaments';
import { Petal } from '../art/Petal';
import { RoseBorderStrip, SingleRose } from '../art/Roses';
import siteConfig from '../../config/site.config';

const FALLING = [
  { x: 6, size: 30, delay: -2, dur: 24, sway: 66 },
  { x: 19, size: 20, delay: -14, dur: 28, sway: -52 },
  { x: 34, size: 26, delay: -7, dur: 22, sway: 44 },
  { x: 49, size: 34, delay: -19, dur: 26, sway: -60 },
  { x: 63, size: 21, delay: -11, dur: 30, sway: 48 },
  { x: 77, size: 28, delay: -4, dur: 23, sway: -46 },
  { x: 91, size: 23, delay: -17, dur: 27, sway: 56 },
];

/**
 * Step 13 — the cinematic ending.
 */
export function FinalScreen() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.3);
  const { lines, signOff, finalLine } = siteConfig.ending;

  return (
    <section ref={ref} className={styles.section} aria-labelledby="ending-heading">
      <HeartGlow className={styles.heart} />

      {/* falling petals */}
      <div className={styles.petals} aria-hidden="true">
        {FALLING.map((p, i) => (
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

      {/* delicate roses */}
      <SingleRose className={`${styles.rose} ${styles.roseLeft}`} rotate={-16} />
      <SingleRose variant="deep" className={`${styles.rose} ${styles.roseRight}`} rotate={14} />

      <div className={`${styles.content} ${visible ? styles.contentVisible : ''}`}>
        <h2 id="ending-heading" className={styles.srTitle}>
          The ending
        </h2>

        <p className={`${styles.line} ${styles.line1}`}>{lines[0]}</p>
        <p className={`${styles.line} ${styles.line2}`}>{lines[1]}</p>

        <p className={`${styles.line} ${styles.signOff}`}>
          {signOff.split('\n').map((part, i) => (
            <span key={i}>
              {part}
              {i === 0 && <br />}
            </span>
          ))}
        </p>

        <div className={styles.divider} aria-hidden="true">
          <TinyHeart />
        </div>

        <p className={`${styles.line} ${styles.finalLine}`}>{finalLine}</p>
      </div>

      {/* final garden edge */}
      <div className={styles.floor} aria-hidden="true">
        <RoseBorderStrip className={styles.floorArt} />
      </div>
    </section>
  );
}

export default FinalScreen;
