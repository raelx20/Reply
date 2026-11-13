import styles from './Atmosphere.module.css';
import { Petal } from '../art/Petal';

/**
 * Fixed atmospheric layer: ambient pink glows, drifting glow-motes
 * and gently falling rose petals. Always behind the content.
 * Deterministic layout so SSR and client renders match exactly.
 */

/* ── tiny seeded PRNG (isomorphic) ── */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Mote {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

interface FallingPetal {
  x: number;
  size: number;
  delay: number;
  duration: number;
  sway: number;
  opacity: number;
  spin: number;
}

function buildMotes(): Mote[] {
  const rnd = mulberry32(20261113);
  return Array.from({ length: 26 }, () => ({
    x: rnd() * 100,
    y: rnd() * 100,
    size: 2 + rnd() * 4,
    delay: rnd() * 14,
    duration: 9 + rnd() * 12,
  }));
}

function buildPetals(): FallingPetal[] {
  const rnd = mulberry32(7713);
  return Array.from({ length: 13 }, () => ({
    x: rnd() * 96,
    size: 16 + rnd() * 26,
    delay: -rnd() * 26,
    duration: 17 + rnd() * 16,
    sway: -70 + rnd() * 140,
    opacity: 0.35 + rnd() * 0.5,
    spin: rnd() > 0.5 ? 1 : -1,
  }));
}

const MOTES = buildMotes();
const PETALS = buildPetals();

export function Atmosphere() {
  return (
    <div className={styles.layer} aria-hidden="true">
      {/* ambient glows */}
      <div className={`${styles.glow} ${styles.glowA}`} />
      <div className={`${styles.glow} ${styles.glowB}`} />
      <div className={`${styles.glow} ${styles.glowC}`} />

      {/* glow motes */}
      <div className={styles.motes}>
        {MOTES.map((m, i) => (
          <span
            key={i}
            className={styles.mote}
            style={
              {
                left: `${m.x}%`,
                top: `${m.y}%`,
                width: `${m.size}px`,
                height: `${m.size}px`,
                animationDelay: `${m.delay}s`,
                animationDuration: `${m.duration}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* falling petals */}
      <div className={styles.petals}>
        {PETALS.map((p, i) => (
          <span
            key={i}
            className={styles.petalSlot}
            style={
              {
                left: `${p.x}%`,
                width: `${p.size}px`,
                '--petal-op': `${p.opacity}`,
                '--sway': `${p.sway}px`,
                '--spin': `${p.spin * 480}deg`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              } as React.CSSProperties
            }
          >
            <Petal className={styles.petalArt} />
          </span>
        ))}
      </div>
    </div>
  );
}

export default Atmosphere;
