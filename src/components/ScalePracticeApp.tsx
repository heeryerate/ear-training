import './ScalePracticeApp.css';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';

import { DifficultyLevel } from '../data/chords';
import { getDiatonicNotes, keyCenters } from '../data/keyCenters';
import {
  getScaleDisplayName,
  getScaleNoteDisplayNames,
  getScaleNotes,
  getScaleNotesForAudio,
  getScaleTypesByDifficulty,
  ScaleType,
} from '../data/scales';
import KeySelectionPanel from './KeySelectionPanel';
import ScalePracticePanel from './ScalePracticePanel';
import ScaleSelectionPanel from './ScaleSelectionPanel';

type ActiveTab = 'practice' | 'progress' | 'settings';
type PracticeModeType = 'regular' | 'pattern';

function ScalePracticeApp() {
  const [piano, setPiano] = useState<Tone.Sampler | null>(null);
  const [isSamplerLoaded, setIsSamplerLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlayingForward, setIsPlayingForward] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');
  const [bpm, setBpm] = useState(120);
  type AutoPlayMode = 'off' | 'random' | 'key-priority' | 'scale-priority';
  const [autoPlayNext, setAutoPlayNext] = useState<AutoPlayMode>('off');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('entry');

  // Default scales for intermediate and professional
  const getDefaultScales = (level: DifficultyLevel): ScaleType[] => {
    if (level === 'entry') {
      return ['major', 'minor'];
    }
    // For intermediate and professional: major, minor, pentatonic-major, pentatonic-minor, dorian
    return ['major', 'minor', 'pentatonic-major', 'pentatonic-minor', 'dorian'];
  };

  // Key and scale selection (multiple selection)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set(['C', 'G'])
  );
  const [selectedScales, setSelectedScales] = useState<Set<ScaleType>>(
    new Set<ScaleType>(getDefaultScales('entry'))
  );

  // Practice state
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [isPatternModeEnabled, setIsPatternModeEnabled] = useState(false);
  const [patternInput, setPatternInput] = useState<string>('1 2 3 5');

  // Derive practice mode from pattern input: if pattern is empty/invalid, use regular mode
  const parsePattern = (patternStr: string): number[] => {
    return patternStr
      .trim()
      .split(/\s+/)
      .map(s => parseInt(s, 10))
      .filter(n => !isNaN(n) && n > 0 && n <= 13);
  };

  const getPracticeModeType = (): PracticeModeType => {
    if (!isPatternModeEnabled) {
      return 'regular';
    }
    const pattern = parsePattern(patternInput);
    return pattern.length > 0 ? 'pattern' : 'regular';
  };

  const practiceModeType = getPracticeModeType();
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [currentScaleType, setCurrentScaleType] = useState<ScaleType | null>(
    null
  );
  const [currentPlayingNoteIndex, setCurrentPlayingNoteIndex] = useState<
    number | null
  >(null);
  const [patternSequences, setPatternSequences] = useState<string[][]>([]);
  const [patternSequencesDisplay, setPatternSequencesDisplay] = useState<
    Array<Array<{ note: string; octave: number }>>
  >([]);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState<number>(0);

  // Progress tracking
  const [practiceSessions, setPracticeSessions] = useState<
    Array<{
      date: string;
      scale: string;
      duration: number;
      selectedKeys: string[];
      selectedScales: ScaleType[];
    }>
  >([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Shuffle-and-cycle randomization refs
  const shuffledCombinationsRef = React.useRef<
    Array<{ key: string; scale: ScaleType }>
  >([]);
  const combinationIndexRef = React.useRef<number>(0);
  const lastSelectionHashRef = React.useRef<string>('');

  // Fisher-Yates shuffle function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Generate and shuffle combinations when selections change
  const updateShuffledCombinations = () => {
    if (selectedKeys.size === 0 || selectedScales.size === 0) {
      shuffledCombinationsRef.current = [];
      combinationIndexRef.current = 0;
      return;
    }

    const keysArray = Array.from(selectedKeys);
    const scalesArray = Array.from(selectedScales);
    const selectionHash = `${keysArray.sort().join(',')}|${scalesArray.sort().join(',')}`;

    // Only regenerate if selections changed
    if (selectionHash !== lastSelectionHashRef.current) {
      const allCombinations: Array<{ key: string; scale: ScaleType }> = [];
      keysArray.forEach(key => {
        scalesArray.forEach(scale => {
          allCombinations.push({ key, scale });
        });
      });

      shuffledCombinationsRef.current = shuffleArray(allCombinations);
      combinationIndexRef.current = 0;
      lastSelectionHashRef.current = selectionHash;
    }
  };

  // Get next combination from shuffled array (with cycle)
  const getNextCombination = (
    excludeCurrent: boolean = false
  ): { key: string; scale: ScaleType } | null => {
    updateShuffledCombinations();

    if (shuffledCombinationsRef.current.length === 0) return null;

    // If we've cycled through all combinations, reshuffle
    if (combinationIndexRef.current >= shuffledCombinationsRef.current.length) {
      shuffledCombinationsRef.current = shuffleArray(
        shuffledCombinationsRef.current
      );
      combinationIndexRef.current = 0;
    }

    // Get available combinations (excluding current if needed)
    let availableCombinations = shuffledCombinationsRef.current;
    if (excludeCurrent && currentKey && currentScaleType) {
      availableCombinations = shuffledCombinationsRef.current.filter(
        combo => !(combo.key === currentKey && combo.scale === currentScaleType)
      );
      // If filtering leaves nothing, use all combinations
      if (availableCombinations.length === 0) {
        availableCombinations = shuffledCombinationsRef.current;
      }
    }

    // Find next combination from current index
    let attempts = 0;
    while (attempts < availableCombinations.length) {
      const combo =
        availableCombinations[
          (combinationIndexRef.current + attempts) %
            availableCombinations.length
        ];
      combinationIndexRef.current++;
      if (
        !excludeCurrent ||
        !(combo.key === currentKey && combo.scale === currentScaleType)
      ) {
        return combo;
      }
      attempts++;
    }

    // Fallback: just get next from shuffled array
    const combo =
      shuffledCombinationsRef.current[
        combinationIndexRef.current % shuffledCombinationsRef.current.length
      ];
    combinationIndexRef.current++;
    return combo;
  };

  // Sync refs with state
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    isPracticeModeRef.current = isPracticeMode;
  }, [isPracticeMode]);
  useEffect(() => {
    currentKeyRef.current = currentKey;
  }, [currentKey]);
  useEffect(() => {
    currentScaleTypeRef.current = currentScaleType;
  }, [currentScaleType]);
  useEffect(() => {
    autoPlayNextRef.current = autoPlayNext;
    // Reset priority tracking when mode changes
    if (autoPlayNext === 'off' || autoPlayNext === 'random') {
      currentKeyPriorityRef.current = null;
      currentScalePriorityRef.current = null;
      playedScalesForKeyRef.current = new Set();
      playedKeysForScaleRef.current = new Set();
    }
  }, [autoPlayNext]);

  // Reset shuffle when selections change
  useEffect(() => {
    updateShuffledCombinations();
  }, [selectedKeys, selectedScales]);

  // Toggle pause/play
  const togglePause = () => {
    if (!currentKey || !currentScaleType) return;

    if (!isPlaying || isPaused) {
      // Start or resume playback
      setIsPaused(false);
      // Start playing based on mode
      if (isPatternModeEnabled) {
        const pattern = parsePattern(patternInput);
        if (pattern.length > 0) {
          // Pattern mode: play pattern sequences
          playPattern(currentKey, currentScaleType, pattern, 0);
        } else {
          // Pattern mode enabled but invalid pattern, fall back to regular
          const forward = isPlayingForward;
          playScale(currentKey, currentScaleType, 0, forward);
        }
      } else {
        // Regular mode: play scale
        const forward = isPlayingForward;
        playScale(currentKey, currentScaleType, 0, forward);
      }
    } else {
      // Pause playback
      setIsPaused(true);
      // Stop all currently playing notes
      if (piano) {
        piano.releaseAll();
      }
      // Clear all pending timeouts
      clearAllTimeouts();
      setIsPlaying(false);
      setCurrentPlayingNoteIndex(null);
      setCurrentSequenceIndex(0);
    }
  };

  // Keyboard shortcuts for practice mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard shortcuts when in practice mode
      if (!isPracticeMode) return;

      // Don't prevent if user is typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Spacebar: toggle play/pause
      if (event.key === ' ') {
        event.preventDefault(); // Prevent page scroll
        if (currentKey && currentScaleType) {
          togglePause();
        }
      }

      // Enter: go to next scale
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        playNextScale();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // Note: togglePause, playNextScale, and stopPractice are intentionally omitted from deps
    // to avoid recreating the listener on every render. The closure will capture
    // the latest function references.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPracticeMode, currentKey, currentScaleType]);

  // Store timeout IDs for cleanup
  const timeoutRefs = React.useRef<number[]>([]);
  // Store playback state for BPM adjustment and looping
  const playbackStateRef = React.useRef<{
    startTime: number;
    toneStartTime: number; // Tone.js time reference for alignment
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
    pattern?: number[]; // For pattern mode
    currentSequenceIndex?: number; // For pattern mode
  } | null>(null);
  // Playback ID counter to invalidate old scheduled notes
  const playbackIdRef = React.useRef<number>(0);
  // Ref to track pause state for looping
  const isPausedRef = React.useRef<boolean>(false);
  // Ref to track practice mode for looping
  const isPracticeModeRef = React.useRef<boolean>(false);
  // Refs to track current key and scale type for looping
  const currentKeyRef = React.useRef<string | null>(null);
  const currentScaleTypeRef = React.useRef<ScaleType | null>(null);
  // Ref to track auto-play next option
  const autoPlayNextRef = React.useRef<AutoPlayMode>('off');
  // Track previous scale to avoid repeating when auto-play next
  const previousKeyRef = React.useRef<string | null>(null);
  const previousScaleTypeRef = React.useRef<ScaleType | null>(null);
  // Priority mode tracking
  const currentKeyPriorityRef = React.useRef<string | null>(null);
  const currentScalePriorityRef = React.useRef<ScaleType | null>(null);
  const playedScalesForKeyRef = React.useRef<Set<ScaleType>>(new Set());
  const playedKeysForScaleRef = React.useRef<Set<string>>(new Set());
  // Track previous selection sizes to detect when new items are added
  const previousSelectedKeysSizeRef = React.useRef<number>(0);
  const previousSelectedScalesSizeRef = React.useRef<number>(0);

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
      // Cleanup: clear all timeouts and dispose piano
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

  // Toggle key selection
  const toggleKey = (key: string) => {
    const newSelectedKeys = new Set(selectedKeys);
    if (newSelectedKeys.has(key)) {
      newSelectedKeys.delete(key);
    } else {
      newSelectedKeys.add(key);
    }
    setSelectedKeys(newSelectedKeys);
  };

  // Toggle scale selection
  const toggleScale = (scaleType: ScaleType) => {
    const newSelectedScales = new Set(selectedScales);
    if (newSelectedScales.has(scaleType)) {
      newSelectedScales.delete(scaleType);
    } else {
      newSelectedScales.add(scaleType);
    }
    setSelectedScales(newSelectedScales);
  };

  // Toggle all scales in a category
  const toggleScaleCategory = (scaleTypes: ScaleType[]) => {
    const newSelectedScales = new Set(selectedScales);
    const allSelected = scaleTypes.every(scaleType =>
      newSelectedScales.has(scaleType)
    );

    if (allSelected) {
      // Deselect all in category
      scaleTypes.forEach(scaleType => newSelectedScales.delete(scaleType));
    } else {
      // Select all in category
      scaleTypes.forEach(scaleType => newSelectedScales.add(scaleType));
    }
    setSelectedScales(newSelectedScales);
  };

  // Handle difficulty change - filter selected scales and set default keys
  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);

    // Filter scales
    const availableScales = getScaleTypesByDifficulty(newDifficulty);
    const filteredScales = new Set(
      Array.from(selectedScales).filter(scale =>
        availableScales.includes(scale)
      )
    );

    // For intermediate and professional, always set default scales
    // For entry, always reset to defaults (Major, Minor)
    if (newDifficulty === 'intermediate' || newDifficulty === 'professional') {
      const defaultScales = getDefaultScales(newDifficulty);
      const validDefaultScales = defaultScales.filter(scale =>
        availableScales.includes(scale)
      );
      setSelectedScales(new Set(validDefaultScales));
    } else {
      // Entry level: always reset to defaults (Major, Minor)
      const defaultScales = getDefaultScales(newDifficulty);
      const validDefaultScales = defaultScales.filter(scale =>
        availableScales.includes(scale)
      );
      setSelectedScales(new Set(validDefaultScales));
    }

    // Set default keys based on difficulty (all keys are always visible)
    let defaultKeys: string[];
    switch (newDifficulty) {
      case 'entry':
        defaultKeys = ['C', 'G'];
        break;
      case 'intermediate':
        defaultKeys = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        break;
      case 'professional':
        defaultKeys = [
          'C',
          'Db',
          'D',
          'Eb',
          'E',
          'F',
          'Gb',
          'G',
          'Ab',
          'A',
          'Bb',
          'B',
        ];
        break;
      default:
        defaultKeys = [
          'C',
          'Db',
          'D',
          'Eb',
          'E',
          'F',
          'Gb',
          'G',
          'Ab',
          'A',
          'Bb',
          'B',
        ];
    }
    setSelectedKeys(new Set(defaultKeys));
  };

  // Generate random combination of key and scale
  const generateRandomScale = () => {
    const randomCombo = getNextCombination(true);
    if (!randomCombo) return;

    // Reset playing state first to ensure useEffect can trigger
    setIsPlaying(false);
    setCurrentPlayingNoteIndex(null);

    // Set new scale - useEffect will auto-play when isPlaying becomes false
    setCurrentKey(randomCombo.key);
    setCurrentScaleType(randomCombo.scale);
  };

  // Parse pattern input (e.g., "1 2 3 5" -> [1, 2, 3, 5])

  // Generate pattern sequences from scale notes
  const generatePatternSequences = (
    key: string,
    scaleType: ScaleType,
    pattern: number[]
  ): string[][] => {
    if (pattern.length === 0) return [];

    const scaleNotes = getScaleNotesForAudio(key, scaleType);
    const sequences: string[][] = [];

    // For each scale degree (1-7, then back to 1 for octave)
    for (let startDegree = 0; startDegree < scaleNotes.length; startDegree++) {
      const sequence: string[] = [];
      for (const patternDegree of pattern) {
        // Convert 1-based pattern degree to 0-based index
        // patternDegree is relative to the starting degree (1 = start, 2 = start+1, etc.)
        const targetDegree = startDegree + patternDegree - 1;
        const noteIndex = targetDegree % scaleNotes.length;
        const octaveOffset = Math.floor(targetDegree / scaleNotes.length);

        // Get the base note
        let note = scaleNotes[noteIndex];

        // Adjust octave if needed
        if (octaveOffset > 0) {
          note = note.replace(/(\d+)$/, match => {
            return String(parseInt(match) + octaveOffset);
          });
        }
        sequence.push(note);
      }
      sequences.push(sequence);
    }

    return sequences;
  };

  // Play pattern sequences
  const playPattern = async (
    key: string,
    scaleType: ScaleType,
    pattern: number[],
    startFromSequenceIndex: number = 0,
    startFromNoteInSequence: number = 0
  ): Promise<void> => {
    if (!piano || pattern.length === 0) return Promise.resolve();

    // Clear any existing timeouts
    clearAllTimeouts();

    setIsPlaying(true);
    setCurrentPlayingNoteIndex(null);
    await initializeAudio();

    // Generate all pattern sequences (audio notes)
    const sequences = generatePatternSequences(key, scaleType, pattern);
    setPatternSequences(sequences);

    // Generate display names for pattern sequences with octave indicators
    const scaleNoteDisplayNames = getScaleNoteDisplayNames(key, scaleType);
    const displaySequences: Array<Array<{ note: string; octave: number }>> = [];
    for (
      let startDegree = 0;
      startDegree < scaleNoteDisplayNames.length;
      startDegree++
    ) {
      const sequence: Array<{ note: string; octave: number }> = [];
      for (const patternDegree of pattern) {
        const targetDegree = startDegree + patternDegree - 1;
        const noteIndex = targetDegree % scaleNoteDisplayNames.length;
        const octaveOffset = Math.floor(
          targetDegree / scaleNoteDisplayNames.length
        );

        // Get the base note name (without octave)
        const noteName = scaleNoteDisplayNames[noteIndex];

        // Add octave indicator if beyond first octave
        sequence.push({ note: noteName, octave: octaveOffset });
      }
      displaySequences.push(sequence);
    }
    setPatternSequencesDisplay(displaySequences);

    if (sequences.length === 0) {
      setIsPlaying(false);
      return Promise.resolve();
    }

    // Calculate note duration based on BPM
    const noteDuration = 60 / bpm;

    // Store playback state
    const playbackStartTime = Date.now();
    const toneStartTime = Tone.now(); // Get Tone.js time reference
    const playbackId = ++playbackIdRef.current;
    playbackStateRef.current = {
      startTime: playbackStartTime,
      toneStartTime: toneStartTime,
      scaleNotes: sequences.flat(), // Flatten for compatibility
      currentKey: key,
      currentScaleType: scaleType,
      startBpm: bpm,
      playbackId,
      forward: true,
      originalScaleNotesLength: sequences[0]?.length || 0,
      loopKey: key,
      loopScaleType: scaleType,
      practiceModeType: 'pattern',
      pattern: pattern,
      currentSequenceIndex: startFromSequenceIndex,
    };

    // Play all sequences
    // Calculate how many notes to skip before starting
    let notesToSkip = 0;
    for (let i = 0; i < startFromSequenceIndex; i++) {
      notesToSkip += sequences[i].length;
    }
    notesToSkip += startFromNoteInSequence;

    let globalNoteIndex = 0;
    sequences.forEach((sequence, seqIndex) => {
      if (seqIndex < startFromSequenceIndex) {
        globalNoteIndex += sequence.length;
        return;
      }

      sequence.forEach((note, noteIndexInSequence) => {
        // Skip notes before startFromNoteInSequence in the starting sequence
        if (
          seqIndex === startFromSequenceIndex &&
          noteIndexInSequence < startFromNoteInSequence
        ) {
          return;
        }

        const relativeIndex = globalNoteIndex - notesToSkip;
        const currentPlaybackId = playbackId;

        // Schedule note to play
        const noteTimeout = window.setTimeout(
          () => {
            if (
              playbackStateRef.current &&
              playbackStateRef.current.playbackId === currentPlaybackId &&
              piano &&
              isSamplerLoaded
            ) {
              piano.triggerAttackRelease(note, noteDuration * 0.9);
            }
          },
          relativeIndex * noteDuration * 1000
        );
        timeoutRefs.current.push(noteTimeout);

        // Update current sequence index for highlighting
        const highlightTimeout = window.setTimeout(
          () => {
            if (
              playbackStateRef.current &&
              playbackStateRef.current.playbackId === currentPlaybackId
            ) {
              setCurrentSequenceIndex(seqIndex);
            }
          },
          relativeIndex * noteDuration * 1000
        );
        timeoutRefs.current.push(highlightTimeout);

        globalNoteIndex++;
      });
    });

    // Return promise that resolves when all sequences finish
    // Calculate total notes remaining (accounting for skipped notes in starting sequence)
    let totalNotes = 0;
    for (let i = startFromSequenceIndex; i < sequences.length; i++) {
      if (i === startFromSequenceIndex) {
        totalNotes += sequences[i].length - startFromNoteInSequence;
      } else {
        totalNotes += sequences[i].length;
      }
    }
    const currentPlaybackId = playbackId;

    return new Promise<void>(resolve => {
      const finishTimeout = window.setTimeout(
        () => {
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId
          ) {
            setIsPlaying(false);
            setCurrentSequenceIndex(0);

            const loopKey = key;
            const loopScaleType = scaleType;

            clearAllTimeouts();
            playbackStateRef.current = null;

            // Loop if not paused and practice mode is active
            setTimeout(() => {
              if (
                !isPausedRef.current &&
                isPracticeModeRef.current &&
                currentKeyRef.current === loopKey &&
                currentScaleTypeRef.current === loopScaleType &&
                isPatternModeEnabled &&
                pattern.length > 0 // Pattern mode if pattern is valid
              ) {
                // If auto-play next is enabled, play next scale
                if (autoPlayNextRef.current !== 'off') {
                  // Update previous scale refs to the scale that just finished
                  previousKeyRef.current = loopKey;
                  previousScaleTypeRef.current = loopScaleType;
                  playNextScale();
                } else {
                  playPattern(loopKey, loopScaleType, pattern, 0);
                }
              }
            }, 10);
            resolve();
          }
        },
        totalNotes * noteDuration * 1000
      );
      timeoutRefs.current.push(finishTimeout);
    });
  };

  // Play scale
  const playScale = async (
    key: string,
    scaleType: ScaleType,
    startFromIndex: number = 0,
    forward: boolean = true
  ): Promise<void> => {
    if (!piano) return Promise.resolve();

    // Clear any existing timeouts
    clearAllTimeouts();

    setIsPlaying(true);
    setCurrentPlayingNoteIndex(null);
    await initializeAudio();

    // Use notes that match the display spelling
    const originalScaleNotes = getScaleNotesForAudio(key, scaleType);
    // Add octave note (root +1 octave) to complete the one-octave range
    const rootNote = originalScaleNotes[0];
    const octaveNote = rootNote.replace(/(\d+)$/, match => {
      return String(parseInt(match) + 1);
    });
    const scaleWithOctave = [...originalScaleNotes, octaveNote];
    // Reverse notes if playing backward
    const scaleNotes = forward
      ? scaleWithOctave
      : [...scaleWithOctave].reverse();
    // Calculate note duration based on BPM (quarter note = 60/BPM seconds)
    const noteDuration = 60 / bpm; // Duration in seconds
    // Scale notes already include octave note, so just use length
    const totalDuration = scaleNotes.length * noteDuration;

    // Store playback state for BPM adjustment
    const playbackStartTime = Date.now();
    const toneStartTime = Tone.now(); // Get Tone.js time reference
    const playbackId = ++playbackIdRef.current; // Increment and get new playback ID
    playbackStateRef.current = {
      startTime: playbackStartTime,
      toneStartTime: toneStartTime,
      scaleNotes,
      currentKey: key,
      currentScaleType: scaleType,
      startBpm: bpm,
      playbackId,
      forward,
      originalScaleNotesLength: originalScaleNotes.length,
      loopKey: key,
      loopScaleType: scaleType,
      practiceModeType: 'regular',
    };

    // Play each note in sequence (starting from startFromIndex)
    scaleNotes.forEach((note, index) => {
      if (index < startFromIndex) return; // Skip already played notes

      const relativeIndex = index - startFromIndex;
      const currentPlaybackId = playbackId; // Capture current playback ID

      // Schedule note to play with a timeout that checks playback ID
      const noteTimeout = window.setTimeout(
        () => {
          // Only play note if this is still the current playback
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId &&
            piano &&
            isSamplerLoaded
          ) {
            piano.triggerAttackRelease(note, noteDuration * 0.9);
          }
        },
        relativeIndex * noteDuration * 1000
      );
      timeoutRefs.current.push(noteTimeout);

      // Highlight note when it starts playing
      // Map the index in the playing array to the display index
      // Display only shows originalScaleNotes (without octave)
      const getDisplayIndex = (playIndex: number): number => {
        if (forward) {
          // Forward: [C, D, E, G, A, C5]
          // Display: [C, D, E, G, A]
          // If playIndex is the last (octave), highlight root (index 0)
          if (playIndex === scaleNotes.length - 1) {
            return 0; // Octave note -> highlight root
          }
          return playIndex; // Otherwise, same index
        } else {
          // Backward: [C5, A, G, E, D, C] (reversed)
          // Display: [C, D, E, G, A]
          // If playIndex is 0 (octave C5), highlight root (index 0)
          if (playIndex === 0) {
            return 0; // Octave note -> highlight root
          }
          // Map reversed index to display index
          // playIndex 1 (A) -> display index 4 (A)
          // playIndex 2 (G) -> display index 3 (G)
          // playIndex 3 (E) -> display index 2 (E)
          // playIndex 4 (D) -> display index 1 (D)
          // playIndex 5 (C) -> display index 0 (C)
          return originalScaleNotes.length - playIndex;
        }
      };

      const displayIndex = getDisplayIndex(index);
      const highlightTimeout = window.setTimeout(
        () => {
          // Only update if this is still the current playback
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId
          ) {
            setCurrentPlayingNoteIndex(displayIndex);
          }
        },
        relativeIndex * noteDuration * 1000
      );
      timeoutRefs.current.push(highlightTimeout);

      // Remove highlight when note ends
      const unhighlightTimeout = window.setTimeout(
        () => {
          // Only update if this is still the current playback
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId
          ) {
            setCurrentPlayingNoteIndex(null);
          }
        },
        (relativeIndex + 1) * noteDuration * 1000
      );
      timeoutRefs.current.push(unhighlightTimeout);
    });

    // Note: Octave note is already included in scaleNotes array, so we don't need separate octave note logic

    // Return a promise that resolves when playback completes
    // Scale notes already include octave note
    const remainingNotes = scaleNotes.length - startFromIndex;
    const currentPlaybackId = playbackId; // Capture current playback ID
    return new Promise<void>(resolve => {
      const finishTimeout = window.setTimeout(
        () => {
          // Only resolve if this is still the current playback
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId
          ) {
            setIsPlaying(false);
            setCurrentPlayingNoteIndex(null);

            // Store values from parameters (already captured in closure)
            const loopKey = key;
            const loopScaleType = scaleType;
            const loopForward = forward;

            clearAllTimeouts();
            playbackStateRef.current = null;

            // Loop if not paused and practice mode is active
            // Use a small delay to allow React to update refs
            setTimeout(() => {
              // Check if we should continue looping
              // Verify that practice mode is active, not paused, and key/scale match
              if (
                !isPausedRef.current &&
                isPracticeModeRef.current &&
                currentKeyRef.current === loopKey &&
                currentScaleTypeRef.current === loopScaleType
              ) {
                // If auto-play next is enabled, play next scale
                if (autoPlayNextRef.current !== 'off') {
                  // Update previous scale refs to the scale that just finished
                  previousKeyRef.current = loopKey;
                  previousScaleTypeRef.current = loopScaleType;
                  playNextScale();
                } else {
                  // Alternate direction: play backward next time
                  const nextForward = !loopForward;
                  setIsPlayingForward(nextForward);
                  // Continue looping the same scale in opposite direction
                  playScale(loopKey, loopScaleType, 0, nextForward);
                }
              }
            }, 10);
            resolve();
          }
        },
        remainingNotes * noteDuration * 1000
      );
      timeoutRefs.current.push(finishTimeout);
    });
  };

  // Handle BPM changes during playback
  useEffect(() => {
    if (
      isPlaying &&
      playbackStateRef.current &&
      piano &&
      bpm !== playbackStateRef.current.startBpm
    ) {
      const state = playbackStateRef.current;
      const currentPlaybackId = state.playbackId;
      const elapsedTime = (Date.now() - state.startTime) / 1000; // elapsed in seconds
      const oldNoteDuration = 60 / state.startBpm; // Duration based on BPM when playback started

      // Update playback state with new BPM first
      playbackStateRef.current.startBpm = bpm;

      // Handle based on practice mode type
      if (state.practiceModeType === 'pattern' && state.pattern) {
        // Pattern mode: treat all notes as a flat sequence (like regular mode)
        const sequences = generatePatternSequences(
          state.currentKey,
          state.currentScaleType,
          state.pattern
        );
        const flatNotes = sequences.flat();

        // Use currentPlayingNoteIndex if available, otherwise calculate from elapsed time
        let currentPlayingIndex = 0;
        if (currentSequenceIndex !== null) {
          // Calculate from current sequence index
          let notesCount = 0;
          for (
            let i = 0;
            i <= currentSequenceIndex && i < sequences.length;
            i++
          ) {
            if (i < currentSequenceIndex) {
              notesCount += sequences[i].length;
            } else {
              // Estimate based on sequence index (we don't have exact note index in sequence)
              currentPlayingIndex = notesCount;
              break;
            }
          }
        } else {
          currentPlayingIndex = Math.floor(elapsedTime / oldNoteDuration);
        }

        const timeIntoCurrentNote = elapsedTime % oldNoteDuration;
        const remainingTimeInCurrentNote =
          oldNoteDuration - timeIntoCurrentNote;

        // Clear all pending timeouts (future notes only)
        clearAllTimeouts();

        // Calculate the next note index to play in the flat sequence
        const nextNoteIndex = (currentPlayingIndex + 1) % flatNotes.length;

        // Convert flat index back to sequence index and note index for display
        let notesCount = 0;
        let targetSeqIndex = 0;
        let targetNoteInSeq = 0;

        for (let i = 0; i < sequences.length; i++) {
          if (notesCount + sequences[i].length > nextNoteIndex) {
            targetSeqIndex = i;
            targetNoteInSeq = nextNoteIndex - notesCount;
            break;
          }
          notesCount += sequences[i].length;
        }

        // Wait for current note to finish, then reschedule from next note with new BPM
        const resumeTimeout = window.setTimeout(() => {
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId &&
            state.pattern
          ) {
            // Update start time to now (fresh start with new BPM)
            playbackStateRef.current.startTime = Date.now();
            playbackStateRef.current.playbackId = ++playbackIdRef.current;

            // Resume from the calculated position
            playPattern(
              state.currentKey,
              state.currentScaleType,
              state.pattern,
              targetSeqIndex,
              targetNoteInSeq
            );
          }
        }, remainingTimeInCurrentNote * 1000);

        timeoutRefs.current.push(resumeTimeout);
      } else {
        // Regular mode: calculate which note is currently playing
        let currentPlayingIndex = 0;
        if (currentPlayingNoteIndex !== null) {
          // Use the actual playing note index
          currentPlayingIndex = currentPlayingNoteIndex;
        } else {
          // Calculate based on elapsed time
          currentPlayingIndex = Math.floor(elapsedTime / oldNoteDuration);
        }

        // Calculate remaining time in current note
        const timeIntoCurrentNote = elapsedTime % oldNoteDuration;
        const remainingTimeInCurrentNote =
          oldNoteDuration - timeIntoCurrentNote;

        // Clear all pending timeouts (future notes only)
        clearAllTimeouts();

        // Calculate the next note index to play
        const nextNoteIndex = currentPlayingIndex + 1;

        // Make sure we don't go beyond the scale length
        if (nextNoteIndex <= state.scaleNotes.length) {
          // Wait for current note to finish, then reschedule from next note with new BPM
          const resumeTimeout = window.setTimeout(() => {
            if (
              playbackStateRef.current &&
              playbackStateRef.current.playbackId === currentPlaybackId
            ) {
              // Update start time to now (fresh start with new BPM)
              playbackStateRef.current.startTime = Date.now();
              playbackStateRef.current.toneStartTime = Tone.now(); // Update tone start time for alignment
              playbackStateRef.current.playbackId = ++playbackIdRef.current;

              playScale(
                state.currentKey,
                state.currentScaleType,
                nextNoteIndex,
                state.forward
              );
            }
          }, remainingTimeInCurrentNote * 1000);

          timeoutRefs.current.push(resumeTimeout);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, isPlaying]);

  // Start practice session
  const startPractice = async () => {
    if (selectedKeys.size === 0 || selectedScales.size === 0) return;

    setIsPracticeMode(true);

    // Reset previous scale refs when starting a new practice session
    previousKeyRef.current = null;
    previousScaleTypeRef.current = null;
    // Reset priority mode tracking
    currentKeyPriorityRef.current = null;
    currentScalePriorityRef.current = null;
    playedScalesForKeyRef.current = new Set();
    playedKeysForScaleRef.current = new Set();

    // Reset shuffle when starting practice
    updateShuffledCombinations();
    combinationIndexRef.current = 0;

    const randomCombo = getNextCombination(false);
    if (!randomCombo) return;

    // Initialize priority mode tracking
    if (autoPlayNext === 'key-priority') {
      currentKeyPriorityRef.current = randomCombo.key;
      playedScalesForKeyRef.current.clear();
      playedScalesForKeyRef.current.add(randomCombo.scale);
    } else if (autoPlayNext === 'scale-priority') {
      currentScalePriorityRef.current = randomCombo.scale;
      playedKeysForScaleRef.current.clear();
      playedKeysForScaleRef.current.add(randomCombo.key);
    } else if (autoPlayNext === 'random') {
      // Initialize previous for random mode
      previousKeyRef.current = randomCombo.key;
      previousScaleTypeRef.current = randomCombo.scale;
    }

    // Set new scale (don't auto-play, wait for user to click Play)
    setCurrentKey(randomCombo.key);
    setCurrentScaleType(randomCombo.scale);
    setIsPlayingForward(true); // Always start forward
    setIsPaused(false); // Reset pause state

    // Start session timer after first play finishes
    setSessionStartTime(Date.now());
  };

  // Reset practice session - uses current selections as pool
  const resetPractice = () => {
    if (selectedKeys.size === 0 || selectedScales.size === 0) return;

    // Stop any current playback
    if (isPlaying) {
      clearAllTimeouts();
      if (piano) {
        piano.releaseAll();
      }
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentPlayingNoteIndex(null);
      setCurrentSequenceIndex(0);
    }

    // Reset all tracking refs
    previousKeyRef.current = null;
    previousScaleTypeRef.current = null;
    currentKeyPriorityRef.current = null;
    currentScalePriorityRef.current = null;
    playedScalesForKeyRef.current = new Set();
    playedKeysForScaleRef.current = new Set();

    // Reset shuffle using current selections
    updateShuffledCombinations();
    combinationIndexRef.current = 0;

    // Pick a new random combination
    const randomCombo = getNextCombination(false);
    if (!randomCombo) return;

    // Initialize priority mode tracking
    if (autoPlayNext === 'key-priority') {
      currentKeyPriorityRef.current = randomCombo.key;
      playedScalesForKeyRef.current.clear();
      playedScalesForKeyRef.current.add(randomCombo.scale);
    } else if (autoPlayNext === 'scale-priority') {
      currentScalePriorityRef.current = randomCombo.scale;
      playedKeysForScaleRef.current.clear();
      playedKeysForScaleRef.current.add(randomCombo.key);
    } else if (autoPlayNext === 'random') {
      previousKeyRef.current = randomCombo.key;
      previousScaleTypeRef.current = randomCombo.scale;
    }

    // Set new scale
    setCurrentKey(randomCombo.key);
    setCurrentScaleType(randomCombo.scale);
    setIsPlayingForward(true);
    setIsPaused(false);
  };

  // Play next random scale
  const playNextScale = async () => {
    if (selectedKeys.size === 0 || selectedScales.size === 0) return;

    // If practice hasn't started yet, start it now
    if (!isPracticeMode) {
      await startPractice();
      return;
    }

    // Stop current playback if playing
    if (isPlaying) {
      // Clear all pending timeouts
      clearAllTimeouts();
      // Stop all currently playing notes
      if (piano) {
        piano.releaseAll();
      }
      // Clear playback state
      playbackStateRef.current = null;
      setIsPlaying(false);
      setCurrentPlayingNoteIndex(null);
      setCurrentSequenceIndex(0);
    }

    let nextCombo: { key: string; scale: ScaleType } | null = null;

    // Handle different auto-play modes
    if (autoPlayNextRef.current === 'key-priority') {
      // Key priority: keep same key, randomize scale type
      // Change key only after all selected scales for that key have been played at least once
      let currentKey = currentKeyPriorityRef.current || currentKeyRef.current;

      // Validate current key is still in selections
      if (currentKey && !selectedKeys.has(currentKey)) {
        currentKey = null;
        currentKeyPriorityRef.current = null;
        playedScalesForKeyRef.current.clear();
      }

      // Always filter played sets to only include items currently in selections
      // This ensures new items are immediately available
      const playedScalesToKeep = new Set<ScaleType>();
      playedScalesForKeyRef.current.forEach(scale => {
        if (selectedScales.has(scale)) {
          playedScalesToKeep.add(scale);
        }
      });
      playedScalesForKeyRef.current = playedScalesToKeep;

      if (!currentKey || selectedKeys.size === 0 || selectedScales.size === 0) {
        // Initialize: pick first key and first scale
        if (selectedKeys.size > 0 && selectedScales.size > 0) {
          const firstKey = Array.from(selectedKeys)[0];
          const firstScale = Array.from(selectedScales)[0];
          currentKeyPriorityRef.current = firstKey;
          playedScalesForKeyRef.current.clear();
          playedScalesForKeyRef.current.add(firstScale);
          nextCombo = { key: firstKey, scale: firstScale };
        }
      } else {
        // Get all currently selected scales and filter out only those that were played
        // New scales are automatically available since they're not in the played set
        const availableScales = Array.from(selectedScales).filter(
          scale => !playedScalesForKeyRef.current.has(scale)
        );

        // Check if there are other keys available (including newly added keys)
        const otherKeys = Array.from(selectedKeys).filter(
          key => key !== currentKey
        );

        // If there are other keys available and we've played at least one scale,
        // consider switching to a new key (this ensures newly added keys are picked up)
        // But prioritize finishing scales for current key first
        if (availableScales.length > 0) {
          // Pick random from unplayed scales for this key
          const randomScale =
            availableScales[Math.floor(Math.random() * availableScales.length)];
          playedScalesForKeyRef.current.add(randomScale);
          nextCombo = { key: currentKey, scale: randomScale };
        } else if (otherKeys.length > 0) {
          // All scales played for this key, move to next key
          // Available keys includes newly added keys
          playedScalesForKeyRef.current.clear();
          const nextKey =
            otherKeys[Math.floor(Math.random() * otherKeys.length)];
          currentKeyPriorityRef.current = nextKey;
          // Pick random scale for the new key from all available scales
          const randomScale =
            Array.from(selectedScales)[
              Math.floor(Math.random() * selectedScales.size)
            ];
          playedScalesForKeyRef.current.add(randomScale);
          nextCombo = { key: nextKey, scale: randomScale };
        } else {
          // Only one key (current key), reset and start over with all scales available
          // This includes newly added scales
          playedScalesForKeyRef.current.clear();
          const randomScale =
            Array.from(selectedScales)[
              Math.floor(Math.random() * selectedScales.size)
            ];
          playedScalesForKeyRef.current.add(randomScale);
          nextCombo = { key: currentKey, scale: randomScale };
        }
      }
    } else if (autoPlayNextRef.current === 'scale-priority') {
      // Scale priority: keep same scale type, randomize key
      // Change scale only after all selected keys for that scale have been played at least once
      let currentScale =
        currentScalePriorityRef.current || currentScaleTypeRef.current;

      // Validate current scale is still in selections
      if (currentScale && !selectedScales.has(currentScale)) {
        currentScale = null;
        currentScalePriorityRef.current = null;
        playedKeysForScaleRef.current.clear();
      }

      // Always filter played sets to only include items currently in selections
      // This ensures new items are immediately available
      const playedKeysToKeep = new Set<string>();
      playedKeysForScaleRef.current.forEach(key => {
        if (selectedKeys.has(key)) {
          playedKeysToKeep.add(key);
        }
      });
      playedKeysForScaleRef.current = playedKeysToKeep;

      if (
        !currentScale ||
        selectedKeys.size === 0 ||
        selectedScales.size === 0
      ) {
        // Initialize: pick first scale and first key
        if (selectedKeys.size > 0 && selectedScales.size > 0) {
          const firstScale = Array.from(selectedScales)[0];
          const firstKey = Array.from(selectedKeys)[0];
          currentScalePriorityRef.current = firstScale;
          playedKeysForScaleRef.current.clear();
          playedKeysForScaleRef.current.add(firstKey);
          nextCombo = { key: firstKey, scale: firstScale };
        }
      } else {
        // Get all currently selected keys and filter out only those that were played
        // New keys are automatically available since they're not in the played set
        const availableKeys = Array.from(selectedKeys).filter(
          key => !playedKeysForScaleRef.current.has(key)
        );

        if (availableKeys.length > 0) {
          // Pick random from unplayed keys for this scale
          const randomKey =
            availableKeys[Math.floor(Math.random() * availableKeys.length)];
          playedKeysForScaleRef.current.add(randomKey);
          nextCombo = { key: randomKey, scale: currentScale };
        } else {
          // All keys played for this scale, move to next scale
          // Check for available scales (including newly added ones)
          playedKeysForScaleRef.current.clear();
          const availableScales = Array.from(selectedScales).filter(
            scale => scale !== currentScale
          );
          if (availableScales.length > 0) {
            // Pick random scale from available scales (includes newly added scales)
            const nextScale =
              availableScales[
                Math.floor(Math.random() * availableScales.length)
              ];
            currentScalePriorityRef.current = nextScale;
            // Pick random key for the new scale from all available keys
            // This includes newly added keys
            const randomKey =
              Array.from(selectedKeys)[
                Math.floor(Math.random() * selectedKeys.size)
              ];
            playedKeysForScaleRef.current.add(randomKey);
            nextCombo = { key: randomKey, scale: nextScale };
          } else {
            // Only one scale (current scale), reset and start over with all keys available
            // This includes newly added keys
            playedKeysForScaleRef.current.clear();
            const randomKey =
              Array.from(selectedKeys)[
                Math.floor(Math.random() * selectedKeys.size)
              ];
            playedKeysForScaleRef.current.add(randomKey);
            nextCombo = { key: randomKey, scale: currentScale };
          }
        }
      }
    } else if (autoPlayNextRef.current === 'random') {
      // Random mode: randomize both key and scale, but don't repeat previous combination
      // Always build from current selections to include newly added keys/scales
      const allCombinations: Array<{ key: string; scale: ScaleType }> = [];
      selectedKeys.forEach(key => {
        selectedScales.forEach(scale => {
          allCombinations.push({ key, scale });
        });
      });

      // Validate previous combination is still in current selections
      // If not, clear it so new items can be selected
      if (
        previousKeyRef.current &&
        previousScaleTypeRef.current &&
        (!selectedKeys.has(previousKeyRef.current) ||
          !selectedScales.has(previousScaleTypeRef.current))
      ) {
        previousKeyRef.current = null;
        previousScaleTypeRef.current = null;
      }

      // Filter out the previous combination (same key and scale) if it's still valid
      let availableCombinations = allCombinations;
      if (
        previousKeyRef.current &&
        previousScaleTypeRef.current &&
        selectedKeys.has(previousKeyRef.current) &&
        selectedScales.has(previousScaleTypeRef.current)
      ) {
        availableCombinations = allCombinations.filter(
          combo =>
            !(
              combo.key === previousKeyRef.current &&
              combo.scale === previousScaleTypeRef.current
            )
        );
      }

      // If filtering leaves nothing (only one combination), use all
      if (availableCombinations.length === 0) {
        availableCombinations = allCombinations;
      }

      // Pick random from available (includes newly added keys/scales)
      nextCombo =
        availableCombinations[
          Math.floor(Math.random() * availableCombinations.length)
        ];
    } else {
      // Off mode: should not be called, but fallback - use current selections
      // Build combinations from current selections
      const allCombinations: Array<{ key: string; scale: ScaleType }> = [];
      selectedKeys.forEach(key => {
        selectedScales.forEach(scale => {
          allCombinations.push({ key, scale });
        });
      });

      if (allCombinations.length > 0) {
        // Filter out current combination if it exists
        const available = allCombinations.filter(
          combo =>
            !(combo.key === currentKey && combo.scale === currentScaleType)
        );
        nextCombo =
          available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : allCombinations[
                Math.floor(Math.random() * allCombinations.length)
              ];
      }
    }

    if (!nextCombo) return;

    // Validate that the combination is from current selections
    if (
      !selectedKeys.has(nextCombo.key) ||
      !selectedScales.has(nextCombo.scale)
    ) {
      // If invalid, pick a random valid combination
      const validKeys = Array.from(selectedKeys);
      const validScales = Array.from(selectedScales);
      if (validKeys.length > 0 && validScales.length > 0) {
        nextCombo = {
          key: validKeys[Math.floor(Math.random() * validKeys.length)],
          scale: validScales[Math.floor(Math.random() * validScales.length)],
        };
      } else {
        return; // No valid selections
      }
    }

    // Update priority tracking
    if (autoPlayNextRef.current === 'key-priority') {
      currentKeyPriorityRef.current = nextCombo.key;
    } else if (autoPlayNextRef.current === 'scale-priority') {
      currentScalePriorityRef.current = nextCombo.scale;
    }

    // Update previous combination for random mode
    if (autoPlayNextRef.current === 'random') {
      previousKeyRef.current = nextCombo.key;
      previousScaleTypeRef.current = nextCombo.scale;
    }

    // Set new scale and play it directly
    setCurrentKey(nextCombo.key);
    setCurrentScaleType(nextCombo.scale);
    setIsPlayingForward(true);

    // Play based on practice mode type
    if (isPatternModeEnabled) {
      const pattern = parsePattern(patternInput);
      if (pattern.length > 0) {
        // Pattern mode: play pattern sequences
        await playPattern(nextCombo.key, nextCombo.scale, pattern, 0);
      } else {
        // Pattern mode enabled but invalid pattern, fall back to regular
        await playScale(nextCombo.key, nextCombo.scale, 0, true);
      }
    } else {
      // Regular mode: play scale (will auto-loop forward/backward)
      await playScale(nextCombo.key, nextCombo.scale, 0, true);
    }
  };

  // Stop practice
  const stopPractice = () => {
    // Clear all pending timeouts
    clearAllTimeouts();
    playbackStateRef.current = null;
    setIsPaused(false);

    // Stop all currently playing notes
    if (piano) {
      piano.releaseAll();
    }

    setIsPracticeMode(false);
    setCurrentKey(null);
    setCurrentScaleType(null);
    setIsPlaying(false);
    setCurrentPlayingNoteIndex(null);
    setPatternSequences([]);
    setPatternSequencesDisplay([]);
    setCurrentSequenceIndex(0);

    // End session and record
    if (sessionStartTime) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      if (duration > 0) {
        const lastScale =
          currentKey && currentScaleType
            ? `${currentKey} ${currentScaleType}`
            : 'Practice Session';
        setPracticeSessions(prev => [
          {
            date: new Date().toISOString(),
            scale: lastScale,
            duration,
            selectedKeys: Array.from(selectedKeys),
            selectedScales: Array.from(selectedScales),
          },
          ...prev,
        ]);
      }
      setSessionStartTime(null);
    }
  };

  // Keyboard shortcuts for practice mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard shortcuts when in practice mode
      if (!isPracticeMode) return;

      // Don't prevent if user is typing in an input field
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Spacebar: toggle play/pause
      if (event.key === ' ') {
        event.preventDefault(); // Prevent page scroll
        if (currentKey && currentScaleType) {
          togglePause();
        }
      }

      // Enter: go to next scale
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        playNextScale();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isPracticeMode,
    currentKey,
    currentScaleType,
    togglePause,
    playNextScale,
  ]);

  // Handle selection changes - update tracking refs so next scale uses latest selections
  // Don't interrupt current playback, changes will apply to the next scale
  useEffect(() => {
    // Detect if selections changed (added or removed)
    const keysChanged =
      selectedKeys.size !== previousSelectedKeysSizeRef.current;
    const scalesChanged =
      selectedScales.size !== previousSelectedScalesSizeRef.current;

    // Update previous sizes
    previousSelectedKeysSizeRef.current = selectedKeys.size;
    previousSelectedScalesSizeRef.current = selectedScales.size;

    // If selections changed, update tracking refs to ensure next scale uses latest selections
    if (keysChanged || scalesChanged) {
      // Clear played sets so new items are immediately available for next selection
      if (autoPlayNext === 'key-priority') {
        if (scalesChanged) {
          // Scales changed - clear played scales so new ones are available
          playedScalesForKeyRef.current.clear();
        }
        if (keysChanged) {
          // Keys changed - clear played scales to allow switching to new keys
          playedScalesForKeyRef.current.clear();
        }
      } else if (autoPlayNext === 'scale-priority') {
        if (keysChanged) {
          // Keys changed - clear played keys so new ones are available
          playedKeysForScaleRef.current.clear();
        }
        if (scalesChanged) {
          // Scales changed - clear played keys to allow switching to new scales
          playedKeysForScaleRef.current.clear();
        }
      } else if (autoPlayNext === 'random') {
        // In random mode, clear previous refs if they're no longer in selections
        if (previousKeyRef.current && previousScaleTypeRef.current) {
          if (
            !selectedKeys.has(previousKeyRef.current) ||
            !selectedScales.has(previousScaleTypeRef.current)
          ) {
            previousKeyRef.current = null;
            previousScaleTypeRef.current = null;
          }
        }
      }

      // If practice hasn't started and we have valid selections, start it
      if (!isPracticeMode && selectedKeys.size > 0 && selectedScales.size > 0) {
        startPractice();
        return;
      }
    }

    // If current combination is invalid (removed from selections), switch to valid one
    // But only if not currently playing (to avoid interrupting playback)
    if (
      isPracticeMode &&
      currentKey &&
      currentScaleType &&
      (selectedKeys.size > 0 || selectedScales.size > 0) &&
      !isPlaying
    ) {
      // Check if current combination is still valid
      const isCurrentKeyValid = selectedKeys.has(currentKey);
      const isCurrentScaleValid = selectedScales.has(currentScaleType);

      // If current combination is invalid, switch to a valid one
      if (!isCurrentKeyValid || !isCurrentScaleValid) {
        // Find a valid combination
        let newKey = currentKey;
        let newScale = currentScaleType;

        if (!isCurrentKeyValid) {
          // Current key is not in selection, pick first available
          newKey = Array.from(selectedKeys)[0];
        }

        if (!isCurrentScaleValid) {
          // Current scale is not in selection, pick first available
          newScale = Array.from(selectedScales)[0];
        }

        // Update to new combination (only when not playing)
        setCurrentKey(newKey);
        setCurrentScaleType(newScale);
        setIsPlayingForward(true);

        // Reset priority tracking if needed
        if (autoPlayNext === 'key-priority') {
          currentKeyPriorityRef.current = newKey;
          playedScalesForKeyRef.current.clear();
          playedScalesForKeyRef.current.add(newScale);
        } else if (autoPlayNext === 'scale-priority') {
          currentScalePriorityRef.current = newScale;
          playedKeysForScaleRef.current.clear();
          playedKeysForScaleRef.current.add(newKey);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys, selectedScales, isPracticeMode, isPlaying]);

  // Don't auto-play when scale changes - user must click Play button
  // This useEffect is removed to prevent auto-play

  // Calculate total practice time
  const totalPracticeTime = practiceSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  // Calculate stats for keys and scales
  const keyStats: Record<string, number> = {};
  const scaleStats: Record<string, number> = {};

  practiceSessions.forEach(session => {
    // Count time for each key in this session
    session.selectedKeys.forEach(key => {
      keyStats[key] = (keyStats[key] || 0) + session.duration;
    });
    // Count time for each scale in this session
    session.selectedScales.forEach(scale => {
      scaleStats[scale] = (scaleStats[scale] || 0) + session.duration;
    });
  });

  // Calculate percentages
  const keyPercentages: Array<{ key: string; percentage: number }> =
    Object.entries(keyStats)
      .map(([key, time]) => ({
        key,
        percentage:
          totalPracticeTime > 0 ? (time / totalPracticeTime) * 100 : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

  const scalePercentages: Array<{ scale: string; percentage: number }> =
    Object.entries(scaleStats)
      .map(([scale, time]) => ({
        scale: getScaleDisplayName(scale as ScaleType),
        percentage:
          totalPracticeTime > 0 ? (time / totalPracticeTime) * 100 : 0,
      }))
      .sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="App">
      <header className="App-header">
        {/* Navigation Bar */}
        <div className="nav-bar">
          <div className="nav-spacer"></div>
          <Link to="/" className="return-button">
            ← Back to Home
          </Link>
        </div>

        <div className="hero-section">
          <div className="hero-header">
            <h1>🎼 Scale Practice Center</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button mobile-only ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
          <button
            className={`tab-button ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            🎯 Practice
          </button>
          <button
            className={`tab-button ${activeTab === 'progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('progress')}
          >
            📊 Progress
          </button>
        </div>

        {activeTab === 'practice' ? (
          <div className="panels-container">
            {/* Desktop: Side-by-side layout */}
            <div className="left-panel desktop-only">
              {/* Compact Difficulty Selector */}
              <div className="compact-difficulty-selector">
                <span className="difficulty-label">Options:</span>
                <div className="difficulty-buttons">
                  <button
                    className={`difficulty-button ${difficulty === 'entry' ? 'active' : ''}`}
                    onClick={() => handleDifficultyChange('entry')}
                  >
                    Basic
                  </button>
                  <button
                    className={`difficulty-button ${difficulty === 'intermediate' ? 'active' : ''}`}
                    onClick={() => handleDifficultyChange('intermediate')}
                  >
                    Standard
                  </button>
                  <button
                    className={`difficulty-button ${difficulty === 'professional' ? 'active' : ''}`}
                    onClick={() => handleDifficultyChange('professional')}
                  >
                    Full
                  </button>
                </div>
              </div>

              <KeySelectionPanel
                selectedKeys={selectedKeys}
                onToggleKey={toggleKey}
                disabled={isPlaying}
                difficulty={difficulty}
              />

              <ScaleSelectionPanel
                selectedScales={selectedScales}
                onToggleScale={toggleScale}
                onToggleCategory={toggleScaleCategory}
                disabled={isPlaying}
                difficulty={difficulty}
              />
            </div>

            {/* Practice Interface - Full width on mobile */}
            <div className="right-panel">
              <ScalePracticePanel
                currentKey={currentKey}
                currentScaleType={currentScaleType}
                isPracticeMode={isPracticeMode}
                isPlaying={isPlaying}
                currentPlayingNoteIndex={currentPlayingNoteIndex}
                onStartPractice={startPractice}
                onTogglePause={togglePause}
                isPaused={isPaused}
                onNextScale={playNextScale}
                onReset={resetPractice}
                selectedKeys={selectedKeys}
                selectedScales={selectedScales}
                bpm={bpm}
                onBpmChange={setBpm}
                autoPlayNext={autoPlayNext}
                onAutoPlayNextChange={setAutoPlayNext}
                practiceModeType={practiceModeType}
                onPracticeModeTypeChange={() => {}} // No longer needed, mode is derived from pattern
                isPatternModeEnabled={isPatternModeEnabled}
                onPatternModeEnabledChange={setIsPatternModeEnabled}
                patternInput={patternInput}
                onPatternInputChange={setPatternInput}
                patternSequences={patternSequences}
                patternSequencesDisplay={patternSequencesDisplay}
                currentSequenceIndex={currentSequenceIndex}
              />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="settings-container">
            <div className="settings-panel">
              <h2>⚙️ Practice Settings</h2>
              <p>Configure your key and scale selection preferences.</p>

              {/* Mobile: Show difficulty selector, key selection, and scale selection */}
              <div className="mobile-only">
                {/* Compact Difficulty Selector */}
                <div className="compact-difficulty-selector">
                  <span className="difficulty-label">Options:</span>
                  <div className="difficulty-buttons">
                    <button
                      className={`difficulty-button ${difficulty === 'entry' ? 'active' : ''}`}
                      onClick={() => handleDifficultyChange('entry')}
                    >
                      Basic
                    </button>
                    <button
                      className={`difficulty-button ${difficulty === 'intermediate' ? 'active' : ''}`}
                      onClick={() => handleDifficultyChange('intermediate')}
                    >
                      Standard
                    </button>
                    <button
                      className={`difficulty-button ${difficulty === 'professional' ? 'active' : ''}`}
                      onClick={() => handleDifficultyChange('professional')}
                    >
                      Full
                    </button>
                  </div>
                </div>

                <KeySelectionPanel
                  selectedKeys={selectedKeys}
                  onToggleKey={toggleKey}
                  disabled={isPlaying}
                  difficulty={difficulty}
                />

                <ScaleSelectionPanel
                  selectedScales={selectedScales}
                  onToggleScale={toggleScale}
                  onToggleCategory={toggleScaleCategory}
                  disabled={isPlaying}
                  difficulty={difficulty}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="scale-practice-container">
            <div className="scale-practice-panel">
              <h2>📊 Practice Progress</h2>

              {/* Statistics Summary */}
              <div className="progress-summary">
                <div className="stat-card">
                  <div className="stat-label">Total Sessions</div>
                  <div className="stat-value">{practiceSessions.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Practice Time</div>
                  <div className="stat-value">
                    {Math.floor(totalPracticeTime / 60)}m{' '}
                    {totalPracticeTime % 60}s
                  </div>
                </div>
              </div>

              {/* Stats Panels */}
              <div className="stats-panels">
                <div className="stats-panel">
                  <h3>Practice Time by Key</h3>
                  {keyPercentages.length > 0 ? (
                    <div className="stats-list">
                      {keyPercentages.map(({ key, percentage }) => (
                        <div key={key} className="stat-item">
                          <div className="stat-label">{key}</div>
                          <div className="stat-bar-container">
                            <div
                              className="stat-bar"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="stat-value">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-stats">No practice data yet.</p>
                  )}
                </div>

                <div className="stats-panel">
                  <h3>Practice Time by Scale</h3>
                  {scalePercentages.length > 0 ? (
                    <div className="stats-list">
                      {scalePercentages.map(({ scale, percentage }) => (
                        <div key={scale} className="stat-item">
                          <div className="stat-label">{scale}</div>
                          <div className="stat-bar-container">
                            <div
                              className="stat-bar"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="stat-value">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-stats">No practice data yet.</p>
                  )}
                </div>
              </div>

              {/* Practice History */}
              <div className="practice-history">
                <h3>Recent Practice Sessions</h3>
                {practiceSessions.length > 0 ? (
                  <div className="history-list">
                    {practiceSessions.slice(0, 10).map((session, index) => (
                      <div key={index} className="history-item">
                        <div className="history-keys">
                          <span className="history-label">Keys: </span>
                          {session.selectedKeys.join(', ')}
                        </div>
                        <div className="history-scales">
                          <span className="history-label">Scales: </span>
                          {session.selectedScales.join(', ')}
                        </div>
                        <div className="history-meta">
                          <div className="history-duration">
                            {Math.floor(session.duration / 60)}m{' '}
                            {session.duration % 60}s
                          </div>
                          <div className="history-date">
                            {new Date(session.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-history">
                    No practice sessions yet. Start practicing!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default ScalePracticeApp;
