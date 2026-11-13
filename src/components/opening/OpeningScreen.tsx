'use client';

import styles from './OpeningScreen.module.css';
import siteConfig from '../../config/site.config';
import { RoseCluster, SingleRose } from '../art/Roses';
import { Petal } from '../art/Petal';

interface Props {
  leaving: boolean;
  onEnter: () => void;
}

const HERO_PETALS = [
  { x: 8, size: 34, delay: -3, dur: 16, sway: 46 },
  { x: 24, size: 22, delay: -9, dur: 19, sway: -38 },
  { x: 47, size: 28, delay: -14, dur: 17, sway: 30 },
  { x: 66, size: 20, delay: -6, dur: 21, sway: -50 },
  { x: 83, size: 36, delay: -17, dur: 18, sway: 40 },
  { x: 93, size: 24, delay: -11, dur: 20, sway: -30 },
];

/**
 * Cinematic opening screen — the doorway into her little world.
 */
export function OpeningScreen({ leaving, onEnter }: Props) {
  const { firstLine, welcomeLine, subtitle, cta } = siteConfig.opening;

  return (
    <header
      className={`${styles.opening} ${leaving ? styles.leaving : ''}`}
      aria-hidden={leaving ? 'true' : undefined}
    >
      <div className={styles.centerGlow} aria-hidden="true" />

      {/* edge roses */}
      <div className={styles.roses} aria-hidden="true">
        <div className={`${styles.roseBox} ${styles.roseBL}`}>
          <RoseCluster className={styles.clusterArt} />
        </div>
        <div className={`${styles.roseBox} ${styles.roseTR}`}>
          <RoseCluster className={styles.clusterArt} />
        </div>
        <SingleRose className={`${styles.single} ${styles.singleBR}`} rotate={-14} />
        <SingleRose variant="deep" className={`${styles.single} ${styles.singleTL}`} rotate={22} />
        <div className={`${styles.roseBox} ${styles.roseBR}`}>
          <RoseCluster className={`${styles.clusterArt} ${styles.clusterDeep}`} />
        </div>
      </div>

      {/* drifting hero petals */}
      <div className={styles.petals} aria-hidden="true">
        {HERO_PETALS.map((p, i) => (
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

      <div className={styles.content}>
        <p className={styles.first}>{firstLine}</p>
        <h1 className={styles.welcome}>{welcomeLine}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <button
          type="button"
          className={styles.enterBtn}
          onClick={onEnter}
          disabled={leaving}
          autoFocus
        >
          <span className={styles.enterBtnInner}>{cta}</span>
        </button>
      </div>
    </header>
  );
}

export default OpeningScreen;
