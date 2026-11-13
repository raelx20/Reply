import styles from './Letter.module.css';
import siteConfig from '../../config/site.config';
import { CornerFlourish, FingerprintHeart, TinyHeart } from '../art/Ornaments';
import { PressedPetal } from '../art/Petal';

/**
 * The personal signature area — a real decoration at the bottom of a
 * handwritten letter: fingerprint heart, pressed petal, intertwined
 * initials, a hand-drawn heart, the phrase, the sign-off and the date.
 */
export function PersonalSignature() {
  const { phrase, closing, name, date, initials } = siteConfig.letter.signature;

  return (
    <footer className={styles.signature}>
      <div className={styles.emblems}>
        {/* burgundy fingerprint heart */}
        <FingerprintHeart className={styles.fingerprint} />

        {/* intertwined initials */}
        <span className={styles.initials} aria-label={`Intertwined initials: ${initials}`}>
          <span className={styles.initialA}>A</span>
          <span className={styles.initialHeart} aria-hidden="true">
            <TinyHeart />
          </span>
          <span className={`${styles.initialA} ${styles.initialASecond}`}>A</span>
        </span>

        {/* pressed rose petal */}
        <PressedPetal className={styles.pressedPetal} />
      </div>

      <p className={styles.phrase}>{phrase}</p>

      <div className={styles.signOff}>
        <p className={styles.closing}>
          {closing}
          <br />
          <span className={styles.name}>
            {name}
            <TinyHeart className={styles.nameHeart} />
          </span>
        </p>
      </div>

      <time className={styles.date} dateTime="2026-11-13">
        {date}
      </time>
    </footer>
  );
}

/**
 * The love letter — antique ivory stationery carrying the exact,
 * unaltered message.
 */
export function LoveLetter({ className = '' }: { className?: string }) {
  const paragraphs = siteConfig.letter.paragraphs;

  return (
    <article className={`${styles.letter} ${className}`}>
      {/* paper texture layers */}
      <span className={styles.paperGrain} aria-hidden="true" />
      <span className={styles.paperFolds} aria-hidden="true" />
      <span className={styles.paperVignette} aria-hidden="true" />

      {/* ornamental border */}
      <span className={styles.ornamentRule} aria-hidden="true" />

      {/* pink floral corner decorations */}
      <CornerFlourish className={`${styles.flourish} ${styles.flTL}`} color="#e79ab9" />
      <CornerFlourish className={`${styles.flourish} ${styles.flTR}`} color="#e79ab9" />
      <CornerFlourish className={`${styles.flourish} ${styles.flBL}`} color="#e79ab9" />
      <CornerFlourish className={`${styles.flourish} ${styles.flBR}`} color="#e79ab9" />

      <div className={styles.body}>
        {paragraphs.map((text, i) => (
          <p
            key={i}
            className={`${styles.para} ${i === 0 ? styles.salutation : ''} ${i === 1 ? styles.dear : ''}`}
          >
            {text}
          </p>
        ))}

        <PersonalSignature />
      </div>
    </article>
  );
}

export default LoveLetter;
