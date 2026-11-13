'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './SecretMessage.module.css';
import siteConfig from '../../config/site.config';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import useReducedMotion from '../../hooks/useReducedMotion';
import { HeartGlow, TinyHeart } from '../art/Ornaments';
import { SingleRose } from '../art/Roses';

type Stage = 'idle' | 'opening' | 'typing' | 'done';

const OPEN_DURATION = 1100;
const MS_PER_CHAR = 17;
const LINE_PAUSE = 340;

/**
 * Chunked typewriter — reveals text at a steady cadence with gentle
 * pauses at line breaks. Returns the visible slice and completion state.
 */
function useTypewriter(text: string, runId: number, active: boolean, reduced: boolean) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!active) {
      setOut('');
      setDone(false);
      return;
    }

    if (reduced) {
      setOut(text);
      setDone(true);
      return;
    }

    let index = 0;
    let acc = 0;
    let pauseUntil = 0;
    let last = performance.now();
    let frame = 0;
    setOut('');
    setDone(false);

    const tick = (now: number) => {
      const dt = now - last;
      last = now;

      if (now >= pauseUntil) {
        acc += dt;
        while (acc >= MS_PER_CHAR && index < text.length) {
          acc -= MS_PER_CHAR;
          const ch = text[index];
          index += 1;
          if (ch === '\n') {
            // swallow additional newlines, then pause between paragraphs
            let newlines = 1;
            while (index < text.length && text[index] === '\n') {
              newlines += 1;
              index += 1;
            }
            pauseUntil = now + LINE_PAUSE * newlines;
            break;
          }
        }
        setOut(text.slice(0, index));
      }

      if (index < text.length) {
        frame = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, runId, active, reduced]);

  return { shown: out, done };
}

/**
 * Steps 11–12 — the secret message: a miniature envelope that opens
 * to reveal the final page of this private love story.
 */
export function SecretMessage() {
  const { ref, visible } = useRevealOnScroll<HTMLElement>(0.3);
  const reduced = useReducedMotion();
  const { leadIn, cta, replayLabel, paragraphs } = siteConfig.secret;

  const [stage, setStage] = useState<Stage>('idle');
  const [runId, setRunId] = useState(0);
  const timerRef = useRef<number | null>(null);

  const fullText = paragraphs.join('\n\n');
  const typing = stage === 'typing' || stage === 'done';
  const { shown, done } = useTypewriter(fullText, runId, typing, reduced);

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const open = useCallback(() => {
    if (stage !== 'idle') return;
    setStage('opening');
    timerRef.current = window.setTimeout(
      () => {
        setStage('typing');
        setRunId((r) => r + 1);
      },
      reduced ? 120 : OPEN_DURATION,
    );
  }, [stage, reduced]);

  const replay = useCallback(() => {
    setRunId((r) => r + 1);
    setStage('typing');
  }, []);

  return (
    <section
      ref={ref}
      className={styles.section}
      aria-labelledby="secret-lead"
      id="secret"
    >
      {/* softly glowing heart behind everything */}
      <HeartGlow className={`${styles.heartGlow} ${typing ? styles.heartGlowOn : ''}`} />

      <div className={`${styles.inner} ${visible ? styles.innerVisible : ''}`}>
        <p className={styles.eyebrow} aria-hidden="true">
          ✦ one last secret ✦
        </p>
        <h2 id="secret-lead" className={styles.leadIn}>
          {leadIn}
        </h2>

        <div className={styles.miniStage} aria-hidden="true">
          <SingleRose className={styles.miniRoseLeft} rotate={-20} />
          <SingleRose variant="deep" className={styles.miniRoseRight} rotate={16} />

          <div className={`${styles.miniEnvelope} ${stage !== 'idle' ? styles.miniOpen : ''}`}>
            <div className={styles.miniBack} />
            <div className={styles.miniSheet} />
            <div className={styles.miniPocket} />
            <div className={styles.miniFlap}>
              <span className={styles.miniSeal}>
                <TinyHeart />
              </span>
            </div>
          </div>
        </div>

        {stage === 'idle' && (
          <button type="button" className={styles.openBtn} onClick={open}>
            {cta}
          </button>
        )}

        {stage !== 'idle' && (
          <div className={styles.messageCard}>
            {/* full text for assistive tech; the typewriter is decorative */}
            <p className="sr-only">{fullText}</p>
            <p className={styles.messageText} aria-hidden="true">
              {shown}
              {typing && !done && <span className={styles.caret} />}
            </p>

            <div className={styles.cardFooter}>
              <TinyHeart className={styles.footerHeart} />
              {done && (
                <button type="button" className={styles.replayBtn} onClick={replay}>
                  {replayLabel}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SecretMessage;
