/**
 * ═══════════════════════════════════════════════════════════════
 *  ONLY YOU — central configuration
 *  Everything personal lives here. Edit this one file to change
 *  photographs, the song, captions, dates and messages.
 * ═══════════════════════════════════════════════════════════════
 */

export interface Photo {
  /** Unique id */
  id: string;
  /** Path inside /public — e.g. "images/photos/us-01.jpg" */
  src: string;
  /** Handwritten caption under the polaroid */
  caption: string;
  /** Accessible description of the photograph */
  alt: string;
  /** Optional: aspect ratio hint for the frame, e.g. "4 / 5" or "3 / 2" */
  aspect?: string;
}

export interface SiteConfig {
  opening: {
    firstLine: string;
    welcomeLine: string;
    subtitle: string;
    cta: string;
  };
  garden: {
    heading: string;
    subheading: string;
  };
  gallery: {
    heading: string;
    subheading: string;
    photos: Photo[];
  };
  envelope: {
    prompt: string;
    cta: string;
    reopenCta: string;
    readingHint: string;
  };
  letter: {
    paragraphs: string[];
    signature: {
      phrase: string;
      closing: string;
      name: string;
      date: string;
      initials: string;
    };
  };
  music: {
    /** File inside /public — drop your song at this path */
    src: string;
    title: string;
    artist: string;
    /** Shown if the audio file is missing */
    unavailableLabel: string;
  };
  secret: {
    leadIn: string;
    cta: string;
    replayLabel: string;
    paragraphs: string[];
  };
  ending: {
    lines: string[];
    signOff: string;
    finalLine: string;
  };
}

export const siteConfig: SiteConfig = {
  opening: {
    firstLine: "Somewhere in this world, there is a little place that belongs only to you.",
    welcomeLine: "Welcome to your little world, Anuska.",
    subtitle: "Made with love, exclusively for you.",
    cta: "Enter my little world",
  },

  garden: {
    heading: "Our secret garden",
    subheading: "Every rose here grew because of you.",
  },

  gallery: {
    heading: "Little pieces of us.",
    subheading: "Some moments deserve to be kept forever.",
    photos: [
      /* ──────────────────────────────────────────────────────────
       *  PHOTOGRAPHS
       *  Order in this array = order in the gallery
       * ────────────────────────────────────────────────────────── */
      {
        id: "photo-1",
        src: "images/photos/photo1.jpg",
        caption: "The beginning of us",
        alt: "The beginning of us",
        aspect: "4 / 5",
      },
      {
        id: "photo-2",
        src: "images/photos/photo2.jpg",
        caption: "Your smile, my favourite view",
        alt: "Your smile, my favourite view",
        aspect: "3 / 2",
      },
      {
        id: "photo-3",
        src: "images/photos/photo3.jpg",
        caption: "That golden hour",
        alt: "That golden hour",
        aspect: "4 / 5",
      },
      {
        id: "photo-4",
        src: "images/photos/photo4.jpg",
        caption: "Just us, being us",
        alt: "Just us, being us",
        aspect: "3 / 2",
      },
    ],
  },

  envelope: {
    prompt: "A little something, written just for you.",
    cta: "Open your letter",
    reopenCta: "Read your letter again",
    readingHint: "Take your time, my love.",
  },

  letter: {
    paragraphs: [
      "To my favourite person,",
      "My dearest Anuska,",
      "I honestly don't know where to begin. Your letter made my birthday so much more special, and I can't tell you how much every single word means to me. Thank you for putting so much love into something so beautiful.",
      "I hope you know that you're equally special to me. I cherish every little moment with you, every conversation, every laugh and even our silliest little arguments. I want to be there for you through every high and low, just as much as you have been there for me.",
      "You don't have to thank me for being myself around you, because being with you feels natural. I hope I can make you feel as loved, valued and appreciated as you make me feel.",
      "Thank you for being you, for choosing me and for making life a little more beautiful. If there's one thing I'm certain about, it's that I'd choose you all over again.",
      "I love you, endlessly.",
      "Yours,\nAnshu.",
    ],
    signature: {
      phrase: "Every piece of me chooses you.",
      closing: "Always yours,",
      name: "Anshu.",
      date: "13 November 2026",
      initials: "A & A",
    },
  },

  music: {
    /* ── Your song at public/audio/edited.acc ── */
    src: "audio/edited.acc",
    title: "Our Song",
    artist: "Just for Anuska",
    unavailableLabel: "Our song is on its way — add it at /public/audio/edited.acc",
  },

  secret: {
    leadIn: "Before you leave, there's one more thing...",
    cta: "One last thing, my love...",
    replayLabel: "Read it again",
    paragraphs: [
      "Anuska, if you've made it this far, I hope you know that every little detail here was created with you in mind.",
      "I cannot promise you a perfect life, but I can promise that I want to keep making beautiful memories with you.",
      "And if life ever gives me a thousand different paths, I hope I always find the one that leads me back to you.",
      "You are my favourite part of this story.",
      "I love you. Always.",
    ],
  },

  ending: {
    lines: ["To my favourite girl,", "in this lifetime and every other."],
    signOff: "With all my love,\nAnshu.",
    finalLine: "Forever yours.",
  },
};

export default siteConfig;
