# Only You

A private, responsive, single-page romantic website — a digital love letter with an
interactive wax-seal envelope as its centrepiece.

**Flow:** welcome screen → secret rose garden → photo memories → sealed envelope →
seal shatters → flap opens → letter emerges → full-screen reading → signature →
secret message (typewriter) → cinematic ending.

---

## Quick start

```bash
npm install
npm run dev      # development at http://localhost:3000
npm run build    # static export into out/
```

The site is a static export (`output: 'export'`), so `out/` can be served by any
static host (GitHub Pages, Netlify, Vercel, or a plain `python3 -m http.server -d out`).

---

## Adding your photographs

1. Drop your image files into `public/images/photos/`
   (jpg / png / webp — any format the browser reads).
2. Open `src/config/site.config.ts` and edit the `gallery.photos` array:

```ts
{
  id: "photo-1",
  src: "/images/photos/our-first-date.jpg",   // path relative to public/
  caption: "The night we lost track of time", // handwritten under the polaroid
  alt: "Anuska and me at the café",           // screen-reader description
  aspect: "4 / 5",                            // crop ratio shown in the frame
},
```

- **Order in the array = order in the gallery.**
- Remove an entry to remove a photo; add entries for as many as you like.
- The six `placeholder-0N.svg` files are clearly-labelled stand-ins — delete or
  replace them once your real photos are in.
- Images are lazy-loaded automatically; keep files under ~1 MB each for a fast load.

## Adding your song

1. Put the audio file at `public/audio/our-song.mp3`
   (mp3 recommended; if you use another format, update `music.src` too).
2. Edit the `music` block in `src/config/site.config.ts`:

```ts
music: {
  src: "/audio/our-song.mp3",
  title: "Our Song",
  artist: "Just for Anuska",
  unavailableLabel: "…",   // shown if the file is missing
},
```

- The player **never autoplays** — she presses play herself.
- If the file is missing the player degrades gracefully: the button explains where
  to drop the file instead of erroring.
- Only use audio you have the right to use (e.g. a file you own or that the artist
  permits).

## Editing the words

Everything personal lives in **`src/config/site.config.ts`**:

| Key | What it holds |
| --- | --- |
| `letter.paragraphs` | The letter text (shown verbatim, one string per paragraph) |
| `letter.signature.*` | Signature phrase, closing, date |
| `secret.*` | Secret-message lead-in, CTA and the typed message |
| `ending.*` | Final screen lines |
| `gallery.photos` | Photographs (see above) |
| `music` | Song file and labels |

The supplied letter and secret message are stored **exactly as written** — edit
only if you want to change them.

---

## Customising the look

- **Palette / typography / spacing:** `src/styles/tokens.css`
  (black-dominant base, `#FF69A6` rose pinks, `#781B3A` burgundy, `#FFF5EB` ivory;
  Cormorant Garamond headings, Parisienne handwriting, Jost body text — fonts load
  via `next/font/google`, no extra requests at runtime).
- **Roses & ornaments:** hand-crafted SVG in `src/components/art/` — no image
  assets needed, scales crisply at any size.
- **Envelope animation:** `src/components/envelope/` — a 6-state machine
  (`CLOSED → SEAL_BREAK → FLAP_OPEN → LETTER_EMERGE → LETTER_EXPAND → LETTER_READABLE`);
  each stage finishes before the next begins, so clicks can never interrupt it.

### Swapping in AI-generated rose imagery (optional)

The roses are currently pure SVG (the AI-image route was unavailable during the
build). If you later generate rose artwork:

1. Save the images into `public/images/roses/`.
2. Replace the `<RoseBloom>` / `<Petal>` usages in `src/components/art/Roses.tsx`
   with `<img>` tags pointing at your files (keep the existing wrappers so the
   parallax/drift animations still apply).

---

## Accessibility & performance

- Semantic landmarks, labelled dialogs, focus trapping, and visible focus rings.
- `prefers-reduced-motion` is respected throughout — the envelope sequence,
  typewriter, parallax and falling petals all fall back to instant/static states.
- All images are lazy-loaded with width/height hints (no layout shift) and have
  meaningful `alt` text.
- Static export, ~123 kB first-load JS, no animation or CSS frameworks.

## Project layout

```
app/                    # Next.js App Router shell + globals.css
src/config/             # site.config.ts — ALL personal content
src/components/         # sections, envelope, gallery, music player, art (SVG)
src/hooks/              # scroll-lock / focus-trap overlays, reduced-motion
src/styles/             # design tokens
public/images/photos/    # ← your photographs go here
public/audio/           # ← your song goes here
```

## Known missing assets

- `public/audio/our-song.mp3` — not included (no licensed audio supplied).
  The music player shows a friendly placeholder until the file is added.
- `public/images/photos/placeholder-0N.svg` — six labelled stand-ins until the
  real photographs are dropped in.
