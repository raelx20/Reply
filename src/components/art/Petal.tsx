'use client';

import { useId } from 'react';

/** A single realistic-style rose petal (64×64). */
export function Petal({ className, style }: { className?: string; style?: React.CSSProperties }) {
  const uid = useId().replace(/:/g, '');
  const g = `pt-${uid}`;

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={g} x1="0.15" y1="0.1" x2="0.85" y2="0.9">
          <stop offset="0" stopColor="#ffc7dc" />
          <stop offset="0.45" stopColor="#ff8fbe" />
          <stop offset="1" stopColor="#e1568f" />
        </linearGradient>
      </defs>
      <path
        d="M32 9 C 41 4, 53 7, 57 17 C 61 29, 51 48, 35 61 C 33.6 62.2, 30.4 62.2, 29 61 C 13 48, 3 29, 7 17 C 11 7, 23 4, 32 9 Z"
        fill={`url(#${g})`}
      />
      {/* fold highlight */}
      <path
        d="M31 12 C 36 26, 35 44, 31 57"
        fill="none"
        stroke="#fff"
        strokeOpacity="0.4"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* fold shadow */}
      <path
        d="M34 11 C 37 27, 36 45, 33 58"
        fill="none"
        stroke="#c7447c"
        strokeOpacity="0.4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <ellipse cx="22" cy="24" rx="8" ry="6" fill="#fff" opacity="0.26" transform="rotate(-30 22 24)" />
    </svg>
  );
}

/**
 * Pressed, dried petal for the letter signature — drawn on a white field
 * so it composites onto ivory paper with mix-blend-mode: multiply.
 */
export function PressedPetal({ className }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const g = `pp-${uid}`;

  return (
    <svg viewBox="0 0 150 118" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={g} x1="0.1" y1="0.1" x2="0.9" y2="0.9">
          <stop offset="0" stopColor="#f6cddc" />
          <stop offset="0.5" stopColor="#eeadc4" />
          <stop offset="1" stopColor="#dca97f" />
        </linearGradient>
      </defs>
      {/* flattened petal with gently irregular edge */}
      <path
        d="M14 66 C 6 40, 28 12, 64 7 C 102 2, 138 18, 143 46 C 148 76, 120 106, 82 111 C 46 116, 20 96, 14 66 Z"
        fill={`url(#${g})`}
        stroke="#c9948f"
        strokeOpacity="0.55"
        strokeWidth="1.2"
      />
      {/* veins fanning from the base */}
      <g fill="none" stroke="#c98da6" strokeOpacity="0.55" strokeWidth="1.1" strokeLinecap="round">
        <path d="M20 68 C 52 54, 96 40, 140 44" />
        <path d="M18 72 C 48 72, 96 66, 141 58" />
        <path d="M20 76 C 46 88, 92 92, 134 82" />
        <path d="M24 62 C 50 40, 88 22, 124 18" />
        <path d="M26 82 C 50 102, 88 110, 118 104" />
      </g>
      {/* age spots & translucency */}
      <ellipse cx="104" cy="40" rx="16" ry="10" fill="#fff" opacity="0.3" transform="rotate(-18 104 40)" />
      <ellipse cx="58" cy="88" rx="12" ry="7" fill="#c9948f" opacity="0.35" transform="rotate(14 58 88)" />
      <ellipse cx="86" cy="62" rx="26" ry="18" fill="#fff" opacity="0.18" transform="rotate(-8 86 62)" />
    </svg>
  );
}
