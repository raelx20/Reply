'use client';

import { useId } from 'react';

/* ════════════════════════════════════════════════════════
   Delicate SVG ornaments — stationery, seals, signature
   ════════════════════════════════════════════════════════ */

/** Thin champagne corner flourish for the letter (120×120). */
export function CornerFlourish({ className, color = '#d8b98a' }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
    >
      <path d="M4 4 C 4 34, 14 60, 44 78" opacity="0.9" />
      <path d="M4 4 C 34 4, 60 14, 78 44" opacity="0.9" />
      <path d="M44 78 C 58 88, 74 84, 78 70 C 81 59, 70 52, 62 58 C 56 63, 58 72, 65 72" opacity="0.85" />
      <path d="M78 44 C 88 58, 84 74, 70 78" opacity="0.55" />
      <path d="M18 18 C 28 10, 42 12, 46 24 C 34 32, 22 28, 18 18 Z" fill={color} fillOpacity="0.22" stroke="none" />
      <path d="M60 8 C 70 6, 78 14, 76 24 C 66 26, 58 18, 60 8 Z" fill={color} fillOpacity="0.16" stroke="none" />
      <circle cx="4" cy="4" r="2.4" fill={color} stroke="none" />
      <circle cx="92" cy="30" r="1.8" fill={color} opacity="0.8" stroke="none" />
      <circle cx="30" cy="92" r="1.8" fill={color} opacity="0.8" stroke="none" />
    </svg>
  );
}

/** The heart-shaped wax seal artwork (120×120) — used whole or in fragments. */
export function WaxSealArt({ className, letter = true }: { className?: string; letter?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const g = `ws-${uid}`;
  const hi = `wsh-${uid}`;

  const heart =
    'M60 106 C 34 88, 14 68, 14 44 C 14 24, 30 12, 46 14 C 54 15, 58 21, 60 28 C 62 21, 66 15, 74 14 C 90 12, 106 24, 106 44 C 106 68, 86 88, 60 106 Z';
  const heartInner =
    'M60 96 C 39 81, 23 64, 23 45 C 23 29, 36 20, 48 21 C 55 22, 58 27, 60 33 C 62 27, 65 22, 72 21 C 84 20, 97 29, 97 45 C 97 64, 81 81, 60 96 Z';

  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={g} cx="36%" cy="28%" r="78%">
          <stop offset="0" stopColor="#ff9dc4" />
          <stop offset="0.45" stopColor="#ff69a6" />
          <stop offset="0.82" stopColor="#e8518f" />
          <stop offset="1" stopColor="#c73a75" />
        </radialGradient>
        <radialGradient id={hi} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="rgba(255,255,255,0.65)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* wax body */}
      <path d={heart} fill={`url(#${g})`} stroke="#a82f63" strokeWidth="1.6" />
      {/* pressed inner rim */}
      <path d={heartInner} fill="none" stroke="#ffd3e4" strokeOpacity="0.5" strokeWidth="2" />
      <path d={heartInner} fill="none" stroke="#9d2a58" strokeOpacity="0.55" strokeWidth="1.6" transform="translate(1.5 2)" />
      {/* glossy highlight */}
      <ellipse cx="44" cy="34" rx="20" ry="13" fill={`url(#${hi})`} transform="rotate(-28 44 34)" />
      {/* embossed initial */}
      {letter && (
        <>
          <text
            x="60"
            y="74"
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontWeight="600"
            fontSize="34"
            fill="#ffd3e4"
            fillOpacity="0.45"
          >
            A
          </text>
          <text
            x="60"
            y="72.5"
            textAnchor="middle"
            fontFamily="var(--font-serif)"
            fontWeight="600"
            fontSize="34"
            fill="#9d2a58"
            fillOpacity="0.8"
          >
            A
          </text>
        </>
      )}
    </svg>
  );
}

/**
 * Crack lines drawn across the seal during SEAL_BREAK (shown briefly
 * before the fragments drift apart).
 */
export function SealCracks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <g stroke="#5e0f31" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.75">
        <path d="M60 14 L 55 34 L 64 48 L 56 66 L 63 84 L 58 102" />
        <path d="M16 46 L 36 52 L 56 48" />
        <path d="M104 50 L 82 56 L 64 50" />
        <path d="M36 52 L 44 74 L 56 66" />
        <path d="M82 56 L 74 76 L 63 84" />
      </g>
      <g stroke="#ffd3e4" strokeWidth="1" fill="none" strokeLinecap="round" opacity="0.55">
        <path d="M61 16 L 56 34 L 65 48 L 57 66 L 64 84" />
        <path d="M17 47 L 37 53 L 56 49" />
      </g>
    </svg>
  );
}

/** Fingerprint pressed into a heart — burgundy ridges. */
export function FingerprintHeart({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const heartId = `fh-${uid}`;

  const heart =
    'M80 140 C 32 108, 8 84, 8 52 C 8 26, 28 10, 50 10 C 66 10, 76 20, 80 32 C 84 20, 94 10, 110 10 C 132 10, 152 26, 152 52 C 152 84, 128 108, 80 140 Z';

  const ridges: Array<{ s: number; dash: string; op: number }> = [
    { s: 0.94, dash: '150 8 210 10', op: 0.9 },
    { s: 0.83, dash: '120 9 60 7 180 11', op: 0.85 },
    { s: 0.72, dash: '160 8 140 9', op: 0.8 },
    { s: 0.61, dash: '90 7 130 8 80 7', op: 0.75 },
    { s: 0.5, dash: '140 8 90 7', op: 0.7 },
    { s: 0.39, dash: '70 6 110 8', op: 0.65 },
    { s: 0.28, dash: '60 6 80 6', op: 0.6 },
  ];

  return (
    <svg viewBox="0 0 160 150" className={className} aria-hidden="true" focusable="false">
      <defs>
        <path id={heartId} d={heart} />
        <clipPath id={`${heartId}-clip`}>
          <use href={`#${heartId}`} />
        </clipPath>
      </defs>

      <g clipPath={`url(#${heartId}-clip)`}>
        {/* faint fill */}
        <use href={`#${heartId}`} fill="#781b3a" fillOpacity="0.08" stroke="none" />
        {/* concentric ridges */}
        {ridges.map((r, i) => (
          <use
            key={i}
            href={`#${heartId}`}
            fill="none"
            stroke="#781b3a"
            strokeWidth="2.4"
            strokeDasharray={r.dash}
            strokeOpacity={r.op}
            transform={`translate(80 74) scale(${r.s}) translate(-80 -74)`}
          />
        ))}
        {/* central whorl */}
        <ellipse cx="80" cy="66" rx="12" ry="9" fill="none" stroke="#781b3a" strokeWidth="2.4" strokeOpacity="0.8" />
        <ellipse
          cx="80"
          cy="66"
          rx="6"
          ry="4.5"
          fill="none"
          stroke="#781b3a"
          strokeWidth="2.2"
          strokeOpacity="0.75"
          strokeDasharray="16 5"
        />
        <circle cx="80" cy="66" r="1.8" fill="#781b3a" opacity="0.8" />
      </g>

      {/* outer heart outline */}
      <use href={`#${heartId}`} fill="none" stroke="#781b3a" strokeWidth="2.6" strokeOpacity="0.9" />
    </svg>
  );
}

/** Softly glowing heart background element. */
export function HeartGlow({ className, deep = false }: { className?: string; deep?: boolean }) {
  const uid = useId().replace(/:/g, '');
  const g = `hg-${uid}`;

  const heart =
    'M100 170 C 40 130, 10 96, 10 60 C 10 28, 34 10, 60 10 C 80 10, 94 22, 100 36 C 106 22, 120 10, 140 10 C 166 10, 190 28, 190 60 C 190 96, 160 130, 100 170 Z';

  return (
    <svg viewBox="0 0 200 180" className={className} aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={g} cx="50%" cy="42%" r="60%">
          <stop offset="0" stopColor={deep ? 'rgba(255,105,166,0.95)' : 'rgba(255,150,190,0.9)'} />
          <stop offset="0.55" stopColor="rgba(255,105,166,0.45)" />
          <stop offset="1" stopColor="rgba(255,105,166,0.06)" />
        </radialGradient>
      </defs>
      <path d={heart} fill={`url(#${g})`} />
      <path d={heart} fill="none" stroke="rgba(255,190,215,0.5)" strokeWidth="1.5" />
    </svg>
  );
}

/** A small hand-drawn heart stroke. */
export function TinyHeart({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 30"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 27 C 6 19, 2 14, 2 9 C 2 4, 7 1, 11 2 C 14 2.7, 15.6 5, 16 7 C 16.4 5, 18 2.7, 21 2 C 25 1, 30 4, 30 9 C 30 14, 26 19, 16 27 Z" />
    </svg>
  );
}
