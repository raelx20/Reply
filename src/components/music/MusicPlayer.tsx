'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './MusicPlayer.module.css';
import siteConfig from '../../config/site.config';

/**
 * Minimal floating music player. One shared Audio instance — playback
 * survives every section. Attempts autoplay on mount; can be paused/tapped.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);

  const { music } = siteConfig;

  /* restore volume preference */
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('only-you-volume');
      if (saved !== null) {
        const v = Math.min(1, Math.max(0, parseFloat(saved)));
        if (!Number.isNaN(v)) setVolume(v);
      }
    } catch {
      /* storage unavailable — keep default */
    }
  }, []);

  /* attempt autoplay on mount — browsers may block it, fall back to manual play */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || unavailable) return;

    // Sync playing state with actual audio state (handles autoplay)
    setPlaying(!audio.paused);

    audio.play().catch(() => {
      /* autoplay blocked by browser — keep paused until user taps */
      setPlaying(false);
      setUnavailable(false);
    });
  }, []);

  /* apply volume + persist */
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = muted ? 0 : volume;
    try {
      window.localStorage.setItem('only-you-volume', String(volume));
    } catch {
      /* ignore */
    }
  }, [volume, muted]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio || unavailable) return;

    if (playing) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setUnavailable(true);
      setPlaying(false);
    }
  };

  const label = unavailable ? music.unavailableLabel : music.artist;

  return (
    <div className={styles.player} role="group" aria-label="Music player">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={music.src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onError={() => setUnavailable(true)}
      />

      <button
        type="button"
        className={styles.playBtn}
        onClick={toggle}
        disabled={unavailable}
        aria-label={playing ? 'Pause our song' : 'Play our song'}
        aria-pressed={playing}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <rect x="6.5" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" />
            <rect x="13.9" y="5" width="3.6" height="14" rx="1.2" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M8 5.5 L18 12 L8 18.5 Z" fill="currentColor" />
          </svg>
        )}
      </button>

      <div className={styles.meta} aria-live="polite">
        <span className={styles.title}>{music.title}</span>
        <span className={`${styles.artist} ${unavailable ? styles.artistFallback : ''}`}>{label}</span>
      </div>

      {/* small animated music indicator */}
      <div className={`${styles.eq} ${playing ? styles.eqOn : ''}`} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.volume}>
        <button
          type="button"
          className={styles.muteBtn}
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? 'Unmute' : 'Mute'}
          aria-pressed={muted}
        >
          {muted || volume === 0 ? (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M4 9.5 H7.5 L12 5.5 V18.5 L7.5 14.5 H4 Z M16 9 L21 15 M21 9 L16 15"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
              <path
                d="M4 9.5 H7.5 L12 5.5 V18.5 L7.5 14.5 H4 Z M15.5 9.5 C 17.2 11, 17.2 13, 15.5 14.5 M18 7.5 C 20.8 10, 20.8 14, 18 16.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          )}
        </button>

        <input
          type="range"
          className={styles.range}
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          style={{ '--vol': `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (muted) setMuted(false);
          }}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}

export default MusicPlayer;
