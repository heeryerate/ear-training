import { useEffect, useRef, useState } from 'react';
import * as Tone from 'tone';

import { ScaleType } from '../data/scales';
import { PracticeModeType } from '../utils/scalePracticeUtils';

interface PlaybackState {
  startTime: number;
  toneStartTime: number;
  scaleNotes: string[];
  currentKey: string;
  currentScaleType: ScaleType;
  startBpm: number;
  playbackId: number;
  forward: boolean;
  originalScaleNotesLength: number;
  loopKey: string;
  loopScaleType: ScaleType;
  practiceModeType: PracticeModeType;
  pattern?: number[];
  currentSequenceIndex?: number;
}

interface UseScalePracticeAudioReturn {
  piano: Tone.Sampler | null;
  isSamplerLoaded: boolean;
  timeoutRefs: React.MutableRefObject<number[]>;
  playbackStateRef: React.MutableRefObject<PlaybackState | null>;
  playbackIdRef: React.MutableRefObject<number>;
  clearAllTimeouts: () => void;
  initializeAudio: () => Promise<void>;
}

export const useScalePracticeAudio = (): UseScalePracticeAudioReturn => {
  const [piano, setPiano] = useState<Tone.Sampler | null>(null);
  const [isSamplerLoaded, setIsSamplerLoaded] = useState(false);
  const timeoutRefs = useRef<number[]>([]);
  const playbackStateRef = useRef<PlaybackState | null>(null);
  const playbackIdRef = useRef<number>(0);

  // Clear all pending timeouts
  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutRefs.current = [];
  };

  // Initialize piano sampler
  useEffect(() => {
    const newPiano = new Tone.Sampler({
      urls: {
        A0: 'A0.mp3',
        C1: 'C1.mp3',
        'D#1': 'Ds1.mp3',
        'F#1': 'Fs1.mp3',
        A1: 'A1.mp3',
        C2: 'C2.mp3',
        'D#2': 'Ds2.mp3',
        'F#2': 'Fs2.mp3',
        A2: 'A2.mp3',
        C3: 'C3.mp3',
        'D#3': 'Ds3.mp3',
        'F#3': 'Fs3.mp3',
        A3: 'A3.mp3',
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
        A4: 'A4.mp3',
        C5: 'C5.mp3',
        'D#5': 'Ds5.mp3',
        'F#5': 'Fs5.mp3',
        A5: 'A5.mp3',
        C6: 'C6.mp3',
        'D#6': 'Ds6.mp3',
        'F#6': 'Fs6.mp3',
        A6: 'A6.mp3',
        C7: 'C7.mp3',
        'D#7': 'Ds7.mp3',
        'F#7': 'Fs7.mp3',
        A7: 'A7.mp3',
        C8: 'C8.mp3',
      },
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      onload: () => {
        console.log('Piano samples loaded successfully');
        setIsSamplerLoaded(true);
      },
    }).toDestination();

    setPiano(newPiano);

    return () => {
      clearAllTimeouts();
      newPiano.dispose();
    };
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // Mobile-friendly audio initialization
  const initializeAudio = async () => {
    try {
      await Tone.start();
      console.log(`Audio context initialized: ${Tone.context.state}`);
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  };

  return {
    piano,
    isSamplerLoaded,
    timeoutRefs,
    playbackStateRef,
    playbackIdRef,
    clearAllTimeouts,
    initializeAudio,
  };
};
