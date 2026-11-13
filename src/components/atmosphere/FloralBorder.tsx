import styles from './FloralBorder.module.css';
import { RoseCluster, RoseBorderStrip } from '../art/Roses';

/**
 * The signature floral border — fixed rose clusters framing every screen.
 * Desktop: four lush corners. Mobile: lighter top corners + a bottom
 * centre cluster so content is never obstructed.
 */
export function FloralBorder() {
  return (
    <div className={styles.layer} aria-hidden="true">
      <div className={`${styles.corner} ${styles.topLeft}`}>
        <RoseCluster className={styles.art} />
      </div>
      <div className={`${styles.corner} ${styles.topRight}`}>
        <RoseCluster className={styles.art} />
      </div>
      <div className={`${styles.corner} ${styles.bottomLeft}`}>
        <RoseCluster className={styles.art} />
      </div>
      <div className={`${styles.corner} ${styles.bottomRight}`}>
        <RoseCluster className={styles.art} />
      </div>
      <div className={styles.bottomStrip}>
        <RoseBorderStrip className={styles.stripArt} />
      </div>
    </div>
  );
}

export default FloralBorder;
