'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import styles from './Envelope.module.css';
import siteConfig from '../../config/site.config';
import useEnvelopeMachine from '../../hooks/useEnvelopeMachine';
import useReducedMotion from '../../hooks/useReducedMotion';
import useRevealOnScroll from '../../hooks/useRevealOnScroll';
import LoveLetter from '../letter/LoveLetter';
import LetterReader from './LetterReader';
import { SealCracks, WaxSealArt } from '../art/Ornaments';

const SHARDS = ['a', 'b', 'c', 'd'] as const;

/**
 * Steps 4–10 — the interactive envelope: wax seal breaks, flap opens,
 * the letter emerges from within, expands, and becomes readable.
 */
export function EnvelopeSection() {
  const reduced = useReducedMotion();
  const { ref: sectionRef, visible } = useRevealOnScroll<HTMLElement>(0.12);
  const { state, running, sealIntact, reading, start, closeLetter } = useEnvelopeMachine({
    reducedMotion: reduced,
  });

  const envelopeRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const readerSheetRef = useRef<HTMLDivElement>(null);

  const [closing, setClosing] = useState(false);
  const [instant, setInstant] = useState(false);
  const flipDoneRef = useRef(false);
  const closingRef = useRef(false);

  const showChrome = state === 'CLOSED' || (state === 'FLAP_OPEN' && !running);
  const chromeHidden = !showChrome || reading;

  /* ── size the letter so it nests inside the envelope ── */
  useLayoutEffect(() => {
    const env = envelopeRef.current;
    const sheet = sheetRef.current;
    if (!env || !sheet) return;

    const update = () => {
      const envW = env.getBoundingClientRect().width;
      const sheetW = sheet.offsetWidth;
      if (envW > 0 && sheetW > 0) {
        env.style.setProperty('--letter-scale', ((envW * 0.9) / sheetW).toFixed(4));
      }
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(env);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  /* ── FLIP: the letter expands from the envelope into reading mode ── */
  useLayoutEffect(() => {
    if (!reading || flipDoneRef.current) return;
    const from = sheetRef.current;
    const to = readerSheetRef.current;
    if (!from || !to) return;
    flipDoneRef.current = true;

    const first = from.getBoundingClientRect();
    const last = to.getBoundingClientRect();

    if (reduced || first.width < 4 || last.width < 4) {
      to.style.opacity = '0';
      const raf = requestAnimationFrame(() => {
        const node = readerSheetRef.current;
        if (!node) return;
        node.style.transition = 'opacity 0.35s ease';
        node.style.opacity = '1';
      });
      return () => cancelAnimationFrame(raf);
    }

    const dx = first.left - last.left;
    const dy = first.top - last.top;
    const scale = first.width / last.width;

    to.style.transition = 'none';
    to.style.transformOrigin = 'top left';
    to.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;

    const raf = requestAnimationFrame(() => {
      const node = readerSheetRef.current;
      if (!node) return;
      node.style.transition = 'transform 900ms cubic-bezier(0.22, 1, 0.36, 1)';
      node.style.transform = 'translate(0px, 0px) scale(1)';
    });

    const clear = window.setTimeout(() => {
      const node = readerSheetRef.current;
      if (!node) return;
      node.style.transition = '';
      node.style.transform = '';
      node.style.transformOrigin = '';
      node.style.opacity = '';
    }, 980);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(clear);
    };
  }, [reading, reduced]);

  /* ── close: the letter folds back into the envelope ── */
  const closeReader = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    setClosing(true);
    // envelope copy snaps to its tucked position while the overlay fades
    setInstant(true);
    closeLetter();

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setInstant(false));
    });

    window.setTimeout(
      () => {
        setClosing(false);
        closingRef.current = false;
        flipDoneRef.current = false;
      },
      reduced ? 90 : 640,
    );
  }, [closeLetter, reduced]);

  const readerOpen = reading || closing;

  return (
    <section
      ref={sectionRef}
      className={`${styles.section} ${readerOpen ? styles.sectionOverlay : ''}`}
      aria-labelledby="letter-prompt"
      id="letter"
    >
      <div className={`${styles.inner} ${visible ? styles.innerVisible : ''}`}>
        <p className={styles.eyebrow} aria-hidden="true">
          ✦ sealed with love ✦
        </p>

        <h2
          id="letter-prompt"
          className={`${styles.prompt} ${chromeHidden ? styles.chromeHidden : ''}`}
        >
          {siteConfig.envelope.prompt}
        </h2>

        <div className={styles.stage}>
          <div className={styles.ambientGlow} aria-hidden="true" />

          <div
            className={styles.envelope}
            ref={envelopeRef}
            data-state={state}
            data-instant={instant ? 'true' : undefined}
            onClick={() => {
              if (!running && !reading) start();
            }}
          >
            {/* interior back panel */}
            <div className={styles.back} aria-hidden="true" />

            {/* the letter, resting inside */}
            <div className={styles.interior} aria-hidden="true">
              <div className={styles.sheet} ref={sheetRef}>
                <LoveLetter />
              </div>
            </div>

            {/* front pocket the letter slides out from */}
            <div className={styles.pocket} aria-hidden="true">
              <svg
                className={styles.seams}
                viewBox="0 0 520 154"
                preserveAspectRatio="none"
                focusable="false"
              >
                <path d="M0 4 H520" stroke="rgba(255,214,232,0.4)" strokeWidth="2.4" fill="none" />
                <path d="M0 8 H520" stroke="rgba(0,0,0,0.4)" strokeWidth="3" fill="none" />
                <path d="M6 154 L 132 10" stroke="rgba(0,0,0,0.28)" strokeWidth="2" fill="none" />
                <path d="M514 154 L 388 10" stroke="rgba(0,0,0,0.28)" strokeWidth="2" fill="none" />
                <path d="M9 154 L 135 12" stroke="rgba(255,255,255,0.1)" strokeWidth="1.4" fill="none" />
                <path d="M511 154 L 385 12" stroke="rgba(255,255,255,0.1)" strokeWidth="1.4" fill="none" />
              </svg>
            </div>

            {/* top flap with the wax seal */}
            <div className={styles.flap} aria-hidden="true">
              <div className={styles.flapFace} />
              <div className={styles.flapFaceBack} />

              <div className={styles.seal} data-broken={sealIntact ? 'false' : 'true'}>
                <span className={styles.crackFlash}>
                  <SealCracks className={styles.cracks} />
                </span>
                {SHARDS.map((id) => (
                  <span key={id} className={styles.shard} data-shard={id}>
                    <WaxSealArt className={styles.sealArt} />
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.envShadow} aria-hidden="true" />
        </div>

        <div className={`${styles.ctaWrap} ${chromeHidden ? styles.chromeHidden : ''}`}>
          <button
            type="button"
            className={styles.openBtn}
            onClick={start}
            disabled={running || reading}
            aria-disabled={running || reading}
          >
            {state === 'FLAP_OPEN' && !running ? siteConfig.envelope.reopenCta : siteConfig.envelope.cta}
          </button>
        </div>
      </div>

      {readerOpen && (
        <LetterReader
          sheetRef={readerSheetRef}
          closing={closing}
          reduced={reduced}
          onClose={closeReader}
        />
      )}
    </section>
  );
}

export default EnvelopeSection;
