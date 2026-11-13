'use client';

import { useId } from 'react';

/**
 * Hand-crafted SVG roses — the visual signature of the site.
 * All artwork is drawn in a 0 0 240 240 space and rendered as a <g>
 * so it can be freely composed inside any parent <svg>.
 */

type Variant = 'pink' | 'deep';

interface RoseArtProps {
  variant?: Variant;
  className?: string;
}

/* ── Petal path library ──────────────────────────────────── *
 * Cupped petals drawn base-down with a notched tip — the
 * silhouette that reads unmistakably as a rose.
 * All drawn in the 240×240 space, base near (120, 132).
 */
const PETAL_OUTER =
  'M120 133 C 91 125, 72 104, 71 76 C 70 51, 85 29, 107 28 C 114 27.6, 118 33, 120 41 ' +
  'C 122 33, 126 27.6, 133 28 C 155 29, 170 51, 169 76 C 168 104, 149 125, 120 133 Z';
const PETAL_MID =
  'M120 131 C 96 123, 80 105, 79 81 C 78 58, 91 38, 109 37 C 115 36.6, 118 41, 120 48 ' +
  'C 122 41, 125 36.6, 131 37 C 149 38, 162 58, 161 81 C 160 105, 144 123, 120 131 Z';
const PETAL_IN =
  'M120 129 C 103 122, 91 107, 91 89 C 91 71, 101 56, 114 55 C 118 54.6, 119 58, 120 63 ' +
  'C 121 58, 122 54.6, 126 55 C 139 56, 149 71, 149 89 C 149 107, 137 122, 120 129 Z';

/** Shading laid over each petal's base so the cup reads as depth. */
const PETAL_CUP =
  'M120 133 C 106 128, 97 120, 92 110 C 100 117, 110 122, 120 124 ' +
  'C 130 122, 140 117, 148 110 C 143 120, 134 128, 120 133 Z';

interface Ring {
  path: string;
  scale: number;
  angles: number[];
  /** stroke opacity for this ring */
  edge: number;
}

const RINGS: Ring[] = [
  { path: PETAL_OUTER, scale: 1.0, angles: [4, 63, 124, 183, 244, 303], edge: 0.3 },
  { path: PETAL_MID, scale: 0.75, angles: [34, 105, 177, 248, 320], edge: 0.34 },
  { path: PETAL_IN, scale: 0.53, angles: [14, 103, 193, 283], edge: 0.4 },
  { path: PETAL_IN, scale: 0.35, angles: [58, 176, 296], edge: 0.45 },
];

function palette(variant: Variant) {
  if (variant === 'deep') {
    return {
      outer: ['#d1779a', '#a83b62', '#7c1e40'],
      mid: ['#c05f85', '#922d55', '#671734'],
      inner: ['#a83b62', '#781b3a', '#521128'],
      core: ['#7d1f42', '#3f0d20'],
      cup: 'rgba(38, 4, 20, 0.55)',
      stroke: '#4a0f26',
      rim: 'rgba(255, 195, 218, 0.4)',
      sheen: 'rgba(255,190,214,0.30)',
      shadow: 'rgba(20,2,12,0.55)',
    };
  }
  return {
    outer: ['#ffd7e9', '#ff9ec6', '#ee6ba6'],
    mid: ['#ffc9e0', '#f7619f', '#d14e88'],
    inner: ['#f7619f', '#dd5490', '#b03a68'],
    core: ['#c9467e', '#7d1f42'],
    cup: 'rgba(96, 16, 52, 0.4)',
    stroke: '#a83568',
    rim: 'rgba(255, 255, 255, 0.55)',
    sheen: 'rgba(255,255,255,0.42)',
    shadow: 'rgba(30,4,18,0.5)',
  };
}

function ringFill(ringIdx: number, uid: string) {
  return `url(#ro-${uid}-r${ringIdx})`;
}

/** A single rose bloom rendered as a <g> (240×240 space, centred at 120,120). */
export function RoseBloom({ variant = 'pink', className }: RoseArtProps) {
  const uid = useId().replace(/[:]/g, '');
  const p = palette(variant);
  const gSheen = `ro-${uid}-s`;
  const gShadow = `ro-${uid}-sh`;

  const ringStops = [p.outer, p.mid, p.inner, p.inner];

  return (
    <g className={className}>
      <defs>
        {ringStops.map((colors, i) => (
          <linearGradient
            key={i}
            id={`ro-${uid}-r${i}`}
            x1="0.25"
            y1="1"
            x2="0.6"
            y2="0"
          >
            <stop offset="0" stopColor={colors[2]} />
            <stop offset="0.42" stopColor={colors[1]} />
            <stop offset="1" stopColor={colors[0]} />
          </linearGradient>
        ))}
        <linearGradient id={`ro-${uid}-cup`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={p.cup} />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </linearGradient>
        <radialGradient id={gSheen} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={p.sheen} />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <radialGradient id={gShadow} cx="50%" cy="50%" r="50%">
          <stop offset="0.55" stopColor={p.shadow} />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* soft ambient shadow under the bloom */}
      <ellipse cx="124" cy="138" rx="102" ry="96" fill={`url(#${gShadow})`} />

      {/* concentric rings of cupped, notched petals */}
      {RINGS.map((ring, ri) => (
        <g key={ri}>
          {ring.angles.map((a, i) => (
            <g
              key={i}
              transform={`rotate(${a} 120 120) translate(120 120) scale(${ring.scale}) translate(-120 -120)`}
            >
              {/* petal body */}
              <path
                d={ring.path}
                fill={ringFill(ri, uid)}
                stroke={p.stroke}
                strokeOpacity={ring.edge}
                strokeWidth={1.4 / ring.scale}
                strokeLinejoin="round"
              />
              {/* rim light along the notched tip */}
              <path
                d={ring.path}
                fill="none"
                stroke={p.rim}
                strokeOpacity={0.5}
                strokeWidth={0.9 / ring.scale}
                strokeLinejoin="round"
                strokeDasharray={ring.scale > 0.7 ? '150 340' : '90 220'}
                strokeDashoffset={ring.scale > 0.7 ? -70 : -42}
              />
              {/* cupped shadow at the base */}
              <path d={PETAL_CUP} fill={`url(#ro-${uid}-cup)`} />
            </g>
          ))}
        </g>
      ))}

      {/* tight unfurling core */}
      <g>
        <circle cx="120" cy="118" r="17" fill={p.core[1]} />
        <path
          d="M120 104 C 131 104, 139 112, 138 122 C 137 132, 127 138, 118 135
             C 109 132, 105 122, 109 114 C 113 107, 123 105, 128 111
             C 132 116, 130 124, 124 126 C 119 128, 114 124, 115 119"
          fill="none"
          stroke={p.core[0]}
          strokeWidth="5.5"
          strokeLinecap="round"
        />
        <path
          d="M113 112 C 117 108, 124 108, 127 113"
          fill="none"
          stroke={p.rim}
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* petal sheen */}
      <ellipse
        cx="100"
        cy="76"
        rx="34"
        ry="22"
        fill={`url(#${gSheen})`}
        transform="rotate(-26 100 76)"
        opacity="0.7"
      />
    </g>
  );
}

/** A closed rose bud rendered as a <g>. */
export function RoseBud({ variant = 'deep', className }: RoseArtProps) {
  const uid = useId().replace(/[:]/g, '');
  const p = palette(variant);
  const g = `bud-${uid}`;

  return (
    <g className={className}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor={p.outer[0]} />
          <stop offset="0.6" stopColor={p.outer[1]} />
          <stop offset="1" stopColor={p.outer[2]} />
        </linearGradient>
      </defs>
      <path
        d="M0 0 C -16 -20, -14 -50, 0 -64 C 14 -50, 16 -20, 0 0 Z"
        fill={`url(#${g})`}
        stroke={p.stroke}
        strokeOpacity="0.35"
        strokeWidth="1.4"
      />
      <path d="M0 -6 C -4 -24, -3 -44, 0 -58" fill="none" stroke={p.stroke} strokeOpacity="0.4" strokeWidth="1.4" />
      {/* sepals */}
      <path d="M0 -2 C -14 -14, -26 -16, -34 -8 C -22 -2, -10 2, 0 -2 Z" fill="#4a5344" opacity="0.9" />
      <path d="M0 -2 C 14 -14, 26 -16, 34 -8 C 22 -2, 10 2, 0 -2 Z" fill="#3f4a3a" opacity="0.9" />
      <path d="M0 0 C -4 8, -3 16, 0 22 C 3 16, 4 8, 0 0 Z" fill="#46503f" />
    </g>
  );
}

/** A single leaf drawn from its base at the origin, pointing right. */
export function Leaf({
  className,
  tone = 'default',
  transform,
}: {
  className?: string;
  tone?: 'default' | 'dark';
  transform?: string;
}) {
  const uid = useId().replace(/[:]/g, '');
  const g = `leaf-${uid}`;
  const light = tone === 'dark' ? '#3a4234' : '#5e6a4f';
  const dark = tone === 'dark' ? '#272d21' : '#3f4a3a';

  return (
    <g className={className} transform={transform}>
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="1" stopColor={dark} />
        </linearGradient>
      </defs>
      <path
        d="M0 0 C 22 -28, 64 -36, 98 -10 C 68 22, 26 28, 0 0 Z"
        fill={`url(#${g})`}
        stroke="#232a1e"
        strokeOpacity="0.5"
        strokeWidth="1.2"
      />
      <path d="M6 -3 C 34 -10, 68 -14, 92 -10" fill="none" stroke="#77835f" strokeOpacity="0.7" strokeWidth="1.4" />
      <path d="M30 -9 L 36 -22 M 52 -13 L 60 -25 M 70 -14 L 78 -24" stroke="#77835f" strokeOpacity="0.45" strokeWidth="1" />
    </g>
  );
}

/** Champagne filler blossoms (baby's breath). */
export function FillerBlossoms({ points, className }: { points: Array<[number, number, number]>; className?: string }) {
  return (
    <g className={className}>
      {points.map(([x, y, r], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={r} fill="#d8b98a" opacity="0.85" />
          <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.4} fill="#f5e3c8" opacity="0.9" />
        </g>
      ))}
    </g>
  );
}

/**
 * Signature corner cluster — lush roses anchored to the bottom-left,
 * meant to be mirrored with CSS transforms for the other corners.
 */
export function RoseCluster({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 520 520" className={className} aria-hidden="true" focusable="false">
      {/* vines */}
      <g fill="none" stroke="#4a5344" strokeOpacity="0.55" strokeWidth="2.4" strokeLinecap="round">
        <path d="M8 500 C 110 476, 178 512, 300 482 C 398 458, 460 492, 516 462" />
        <path d="M40 512 C 90 470, 150 466, 196 490" />
        <path d="M330 470 C 370 440, 430 440, 468 466" />
        <path d="M60 470 C 40 430, 54 392, 92 374" strokeOpacity="0.4" />
      </g>
      {/* tendrils */}
      <g fill="none" stroke="#5e6a4f" strokeOpacity="0.5" strokeWidth="1.8" strokeLinecap="round">
        <path d="M470 452 C 486 444, 494 452, 488 462 C 484 469, 474 468, 474 460" />
        <path d="M150 452 C 138 442, 142 432, 152 434 C 159 436, 159 445, 153 447" />
      </g>

      {/* leaves */}
      <Leaf transform="translate(132 372) rotate(-38) scale(1.15)" />
      <Leaf transform="translate(238 438) rotate(12) scale(1.3)" />
      <Leaf transform="translate(318 336) rotate(-18) scale(0.95)" />
      <Leaf transform="translate(66 306) rotate(-74) scale(0.85)" />
      <Leaf transform="translate(392 436) rotate(38) scale(1.05)" />
      <Leaf transform="translate(196 320) rotate(-58) scale(0.75)" tone="dark" />
      <Leaf transform="translate(444 372) rotate(24) scale(0.8)" tone="dark" />
      <Leaf transform="translate(24 418) rotate(-96) scale(0.7)" tone="dark" />

      {/* blooms */}
      <g transform="translate(76 236) scale(1.18)">
        <RoseBloom variant="pink" />
      </g>
      <g transform="translate(252 318) rotate(14) scale(0.92)">
        <RoseBloom variant="deep" />
      </g>
      <g transform="translate(368 404) rotate(-10) scale(0.64)">
        <RoseBloom variant="pink" />
      </g>
      <g transform="translate(176 448) scale(0.52)">
        <RoseBloom variant="deep" />
      </g>
      <g transform="translate(414 292) rotate(20) scale(0.44)">
        <RoseBloom variant="pink" />
      </g>
      <g transform="translate(310 452)">
        <RoseBud variant="deep" />
      </g>
      <g transform="translate(118 402) rotate(-14)">
        <RoseBud variant="pink" />
      </g>

      {/* baby's breath */}
      <FillerBlossoms
        points={[
          [214, 356, 5],
          [238, 342, 4],
          [226, 378, 3.5],
          [430, 428, 5],
          [452, 412, 4],
          [444, 448, 3.5],
          [58, 356, 4.5],
          [40, 340, 3.5],
          [352, 356, 4],
          [336, 340, 3],
          [152, 316, 4],
          [486, 442, 4],
          [96, 470, 4.5],
          [276, 470, 4],
        ]}
      />
    </svg>
  );
}

/**
 * Wide garden strip for page edges — a row of roses with leaves.
 */
export function RoseBorderStrip({ className }: { className?: string }) {
  const blooms: Array<{ x: number; y: number; s: number; v: Variant; r: number }> = [
    { x: 70, y: 150, s: 0.72, v: 'pink', r: -8 },
    { x: 250, y: 178, s: 0.9, v: 'deep', r: 6 },
    { x: 440, y: 148, s: 0.66, v: 'pink', r: -4 },
    { x: 620, y: 182, s: 0.85, v: 'pink', r: 10 },
    { x: 810, y: 150, s: 0.7, v: 'deep', r: -6 },
    { x: 990, y: 176, s: 0.88, v: 'pink', r: 4 },
    { x: 1180, y: 146, s: 0.68, v: 'deep', r: -10 },
    { x: 1340, y: 172, s: 0.78, v: 'pink', r: 6 },
  ];

  return (
    <svg viewBox="0 0 1440 300" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMax meet">
      {/* ground vine */}
      <path
        d="M0 250 C 180 226, 340 262, 540 244 C 760 224, 940 260, 1140 242 C 1300 228, 1380 250, 1440 240"
        fill="none"
        stroke="#4a5344"
        strokeOpacity="0.5"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* leaves between blooms */}
      <Leaf transform="translate(150 236) rotate(-16) scale(0.9)" />
      <Leaf transform="translate(340 246) rotate(14) scale(1)" />
      <Leaf transform="translate(530 232) rotate(-12) scale(0.85)" />
      <Leaf transform="translate(716 250) rotate(16) scale(1.05)" />
      <Leaf transform="translate(900 234) rotate(-14) scale(0.9)" />
      <Leaf transform="translate(1084 248) rotate(12) scale(1)" />
      <Leaf transform="translate(1264 230) rotate(-10) scale(0.8)" />
      <Leaf transform="translate(60 244) rotate(18) scale(0.75)" tone="dark" />
      <Leaf transform="translate(440 256) rotate(-20) scale(0.7)" tone="dark" />
      <Leaf transform="translate(830 254) rotate(18) scale(0.72)" tone="dark" />
      <Leaf transform="translate(1210 252) rotate(-16) scale(0.7)" tone="dark" />

      {/* buds */}
      <g transform="translate(196 240)">
        <RoseBud variant="pink" />
      </g>
      <g transform="translate(576 246) scale(0.85)">
        <RoseBud variant="deep" />
      </g>
      <g transform="translate(948 242) scale(0.9)">
        <RoseBud variant="pink" />
      </g>
      <g transform="translate(1310 246) scale(0.8)">
        <RoseBud variant="deep" />
      </g>

      {/* blooms */}
      {blooms.map((b, i) => (
        <g key={i} transform={`translate(${b.x} ${b.y}) rotate(${b.r}) scale(${b.s})`}>
          <RoseBloom variant={b.v} />
        </g>
      ))}

      {/* baby's breath */}
      <FillerBlossoms
        points={[
          [120, 208, 4],
          [400, 210, 4.5],
          [676, 212, 4],
          [1044, 210, 4.5],
          [1392, 212, 4],
          [300, 216, 3.5],
          [770, 214, 3.5],
          [1150, 216, 3.5],
        ]}
      />
    </svg>
  );
}

/** Standalone single rose (for opening screen & accents). */
export function SingleRose({
  variant = 'pink',
  className,
  rotate = 0,
}: RoseArtProps & { rotate?: number }) {
  return (
    <svg
      viewBox="0 0 240 240"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <RoseBloom variant={variant} />
    </svg>
  );
}
