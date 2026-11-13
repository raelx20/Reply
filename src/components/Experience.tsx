'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Experience.module.css';
import Atmosphere from './atmosphere/Atmosphere';
import FloralBorder from './atmosphere/FloralBorder';
import OpeningScreen from './opening/OpeningScreen';
import RoseGarden from './garden/RoseGarden';
import MemoryGallery from './gallery/MemoryGallery';
import EnvelopeSection from './envelope/EnvelopeSection';
import SecretMessage from './secret/SecretMessage';
import FinalScreen from './ending/FinalScreen';
import MusicPlayer from './music/MusicPlayer';
import { useScrollLock } from '../hooks/useOverlay';

/**
 * The whole private world, in order:
 * welcome → secret garden → photographs → envelope → seal → flap →
 * letter out → letter expands → reading → signature →
 * secret message → cinematic ending.
 */
export function Experience() {
  const [entered, setEntered] = useState(false);
  const [openingAlive, setOpeningAlive] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  // no scroll until she steps inside
  useScrollLock(!entered);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  const handleEnter = useCallback(() => {
    setEntered(true);
    window.setTimeout(() => setOpeningAlive(false), 1700);
    window.setTimeout(() => mainRef.current?.focus({ preventScroll: true }), 250);
  }, []);

  return (
    <div className={styles.experience}>
      <Atmosphere />
      <FloralBorder />

      <main ref={mainRef} className={styles.main} tabIndex={-1} inert={!entered}>
        <RoseGarden />
        <MemoryGallery />
        <EnvelopeSection />
        <SecretMessage />
        <FinalScreen />
      </main>

      {openingAlive && <OpeningScreen leaving={entered} onEnter={handleEnter} />}
      <MusicPlayer />
    </div>
  );
}

export default Experience;
