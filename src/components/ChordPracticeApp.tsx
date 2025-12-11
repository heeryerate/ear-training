import './ChordPracticeApp.css';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';

import {
  ChordType,
  DifficultyLevel,
  getChordNotesForAudio,
  getChordTypesByDifficulty,
} from '../data/chords';
import ChordPracticePanel from './ChordPracticePanel';
import ChordSelectionPanel from './ChordSelectionPanel';
import KeySelectionPanel from './KeySelectionPanel';

type ActiveTab = 'practice' | 'progress' | 'settings';

function ChordPracticeApp() {
  const [piano, setPiano] = useState<Tone.Sampler | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isPlayingForward, setIsPlayingForward] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');
  const [bpm, setBpm] = useState(120);
  type AutoPlayMode = 'off' | 'random' | 'key-priority' | 'chord-priority';
  const [autoPlayNext, setAutoPlayNext] = useState<AutoPlayMode>('off');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('entry');

  // Default chords for intermediate and professional
  const getDefaultChords = (level: DifficultyLevel): ChordType[] => {
    if (level === 'entry') {
      return ['major', 'minor'];
    }
    // For intermediate and professional: major, major-7th, minor, minor-7th, dominant-7th
    return ['major', 'major-7th', 'minor', 'minor-7th', 'dominant-7th'];
  };

  // Key and chord selection (multiple selection)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['C']));
  const [selectedChords, setSelectedChords] = useState<Set<ChordType>>(
    new Set<ChordType>(getDefaultChords('entry'))
  );

  // Practice state
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [currentChordType, setCurrentChordType] = useState<ChordType | null>(
    null
  );
  const [currentPlayingNoteIndex, setCurrentPlayingNoteIndex] = useState<
    number | null
  >(null);

  // Progress tracking
  const [practiceSessions, setPracticeSessions] = useState<
    Array<{
      date: string;
      chord: string;
      duration: number;
      selectedKeys: string[];
      selectedChords: ChordType[];
    }>
  >([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Store timeout IDs for cleanup
  const timeoutRefs = React.useRef<number[]>([]);
  // Store playback state for BPM adjustment
  const playbackStateRef = React.useRef<{
    startTime: number;
    chordNotes: string[];
    currentKey: string;
    currentChordType: ChordType;
    startBpm: number;
    playbackId: number;
  } | null>(null);
  // Playback ID counter to invalidate old scheduled notes
  const playbackIdRef = React.useRef<number>(0);
  // Ref to track pause state for looping
  const isPausedRef = React.useRef<boolean>(false);
  // Ref to track playing state
  const isPlayingRef = React.useRef<boolean>(false);
  // Ref to track practice mode state for looping
  const isPracticeModeRef = React.useRef<boolean>(false);
  // Ref to track auto-play next option
  const autoPlayNextRef = React.useRef<AutoPlayMode>('off');
  // Refs to track current key and chord type for looping
  const currentKeyRef = React.useRef<string | null>(null);
  const currentChordTypeRef = React.useRef<ChordType | null>(null);
  // Track previous chord to avoid repeating when auto-play next
  const previousKeyRef = React.useRef<string | null>(null);
  const previousChordTypeRef = React.useRef<ChordType | null>(null);
  // Priority mode tracking
  const currentKeyPriorityRef = React.useRef<string | null>(null);
  const currentChordPriorityRef = React.useRef<ChordType | null>(null);
  const playedChordsForKeyRef = React.useRef<Set<ChordType>>(new Set());
  const playedKeysForChordRef = React.useRef<Set<string>>(new Set());

  // Shuffle-and-cycle randomization refs
  const shuffledCombinationsRef = React.useRef<
    Array<{ key: string; chord: ChordType }>
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
    if (selectedKeys.size === 0 || selectedChords.size === 0) {
      shuffledCombinationsRef.current = [];
      combinationIndexRef.current = 0;
      return;
    }

    const keysArray = Array.from(selectedKeys);
    const chordsArray = Array.from(selectedChords);
    const selectionHash = `${keysArray.sort().join(',')}|${chordsArray.sort().join(',')}`;

    // Only regenerate if selections changed
    if (selectionHash !== lastSelectionHashRef.current) {
      const allCombinations: Array<{ key: string; chord: ChordType }> = [];
      keysArray.forEach(key => {
        chordsArray.forEach(chord => {
          allCombinations.push({ key, chord });
        });
      });

      shuffledCombinationsRef.current = shuffleArray(allCombinations);
      combinationIndexRef.current = 0;
      lastSelectionHashRef.current = selectionHash;
    }
  };

  // Get next combination from shuffled array (with cycle)
  const getNextCombination = (
    excludePrevious: boolean = false
  ): { key: string; chord: ChordType } | null => {
    updateShuffledCombinations();

    if (shuffledCombinationsRef.current.length === 0) return null;

    // If we've cycled through all combinations, reshuffle
    if (combinationIndexRef.current >= shuffledCombinationsRef.current.length) {
      shuffledCombinationsRef.current = shuffleArray(
        shuffledCombinationsRef.current
      );
      combinationIndexRef.current = 0;
    }

    // Get available combinations (excluding previous if needed)
    let availableCombinations = shuffledCombinationsRef.current;
    if (
      excludePrevious &&
      previousKeyRef.current &&
      previousChordTypeRef.current
    ) {
      availableCombinations = shuffledCombinationsRef.current.filter(
        combo =>
          !(
            combo.key === previousKeyRef.current &&
            combo.chord === previousChordTypeRef.current
          )
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
        !excludePrevious ||
        !(
          combo.key === previousKeyRef.current &&
          combo.chord === previousChordTypeRef.current
        )
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
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);
  useEffect(() => {
    isPracticeModeRef.current = isPracticeMode;
  }, [isPracticeMode]);
  useEffect(() => {
    autoPlayNextRef.current = autoPlayNext;
    // Reset priority tracking when mode changes
    if (autoPlayNext === 'off' || autoPlayNext === 'random') {
      currentKeyPriorityRef.current = null;
      currentChordPriorityRef.current = null;
      playedChordsForKeyRef.current = new Set();
      playedKeysForChordRef.current = new Set();
    }
  }, [autoPlayNext]);
  useEffect(() => {
    currentKeyRef.current = currentKey;
  }, [currentKey]);
  useEffect(() => {
    currentChordTypeRef.current = currentChordType;
  }, [currentChordType]);

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

  // Toggle chord selection
  const toggleChord = (chordType: ChordType) => {
    const newSelectedChords = new Set(selectedChords);
    if (newSelectedChords.has(chordType)) {
      newSelectedChords.delete(chordType);
    } else {
      newSelectedChords.add(chordType);
    }
    setSelectedChords(newSelectedChords);
  };

  // Toggle all chords in a category
  const toggleChordCategory = (chordTypes: ChordType[]) => {
    const newSelectedChords = new Set(selectedChords);
    const allSelected = chordTypes.every(chordType =>
      newSelectedChords.has(chordType)
    );

    if (allSelected) {
      // Deselect all in category
      chordTypes.forEach(chordType => newSelectedChords.delete(chordType));
    } else {
      // Select all in category
      chordTypes.forEach(chordType => newSelectedChords.add(chordType));
    }
    setSelectedChords(newSelectedChords);
  };

  // Handle difficulty change - filter selected chords and set default keys
  const handleDifficultyChange = (newDifficulty: DifficultyLevel) => {
    setDifficulty(newDifficulty);

    // Filter chords
    const availableChords = getChordTypesByDifficulty(newDifficulty);
    const filteredChords = new Set(
      Array.from(selectedChords).filter(chord =>
        availableChords.includes(chord)
      )
    );

    // For intermediate and professional, always set default chords
    // For entry, only set defaults if no chords remain after filtering
    if (newDifficulty === 'intermediate' || newDifficulty === 'professional') {
      const defaultChords = getDefaultChords(newDifficulty);
      const validDefaultChords = defaultChords.filter(chord =>
        availableChords.includes(chord)
      );
      setSelectedChords(new Set(validDefaultChords));
    } else if (filteredChords.size === 0) {
      // Entry level: set defaults only if nothing remains
      const defaultChords = getDefaultChords(newDifficulty);
      const validDefaultChords = defaultChords.filter(chord =>
        availableChords.includes(chord)
      );
      setSelectedChords(new Set(validDefaultChords));
    } else {
      setSelectedChords(filteredChords);
    }

    // Set default keys based on difficulty (all keys are always visible)
    let defaultKeys: string[];
    switch (newDifficulty) {
      case 'entry':
        defaultKeys = ['C', 'G', 'D'];
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

  // Play chord
  const playChord = async (
    key: string,
    chordType: ChordType,
    forward: boolean = true
  ): Promise<void> => {
    if (!piano) return Promise.resolve();

    // Clear any existing timeouts
    clearAllTimeouts();

    setIsPlaying(true);
    setCurrentPlayingNoteIndex(null);
    await initializeAudio();

    // Use notes that match the display spelling
    const originalChordNotes = getChordNotesForAudio(key, chordType);
    // Reverse notes if playing backward
    const chordNotes = forward
      ? originalChordNotes
      : [...originalChordNotes].reverse();
    // Calculate durations based on BPM (quarter note = 60/BPM seconds)
    const quarterNoteDuration = 60 / bpm;
    const chordDuration = quarterNoteDuration * 2; // 2 quarter notes for full chord
    const noteGap = quarterNoteDuration * 0.8; // Time between when each note starts (overlapping)
    const noteDuration = noteGap * 1.5; // Each note plays longer to overlap smoothly
    const totalDuration =
      chordDuration + (chordNotes.length - 1) * noteGap + noteDuration;

    // Store playback state for BPM adjustment
    const playbackStartTime = Date.now();
    const playbackId = ++playbackIdRef.current; // Increment and get new playback ID
    playbackStateRef.current = {
      startTime: playbackStartTime,
      chordNotes,
      currentKey: key,
      currentChordType: chordType,
      startBpm: bpm,
      playbackId,
    };

    const startTime = Tone.now();
    const currentPlaybackId = playbackId; // Capture current playback ID

    // Step 1: Play all notes simultaneously (chord)
    // Schedule chord to play with a timeout that checks playback ID
    const chordTimeout = window.setTimeout(() => {
      // Only play if this is still the current playback
      if (
        playbackStateRef.current &&
        playbackStateRef.current.playbackId === currentPlaybackId &&
        piano
      ) {
        // Highlight all notes when chord starts playing
        setCurrentPlayingNoteIndex(-1); // -1 indicates all notes are playing

        // Play the full chord
        chordNotes.forEach(note => {
          // Play chord for the full duration (until all individual notes finish)
          piano.triggerAttackRelease(note, totalDuration * 0.95);
        });
      }
    }, 0);
    timeoutRefs.current.push(chordTimeout);

    // Step 2: After chord duration, play each note individually with highlighting
    chordNotes.forEach((note, index) => {
      const noteStartTime = chordDuration * 1000 + index * noteGap * 1000;

      // Map the index from the playing array (which may be reversed) to the display index
      // Display always shows originalChordNotes in forward order
      const getDisplayIndex = (playIndex: number): number => {
        if (forward) {
          // Forward: playIndex matches display index
          return playIndex;
        } else {
          // Backward: chordNotes is reversed, so map back to original position
          // playIndex 0 in reversed array = last note in original = originalChordNotes.length - 1
          // playIndex 1 in reversed array = second-to-last note = originalChordNotes.length - 2
          // etc.
          return originalChordNotes.length - 1 - playIndex;
        }
      };

      const displayIndex = getDisplayIndex(index);

      // Schedule note highlight
      const noteHighlightTimeout = window.setTimeout(() => {
        // Only update if this is still the current playback
        if (
          playbackStateRef.current &&
          playbackStateRef.current.playbackId === currentPlaybackId
        ) {
          setCurrentPlayingNoteIndex(displayIndex);
        }
      }, noteStartTime);
      timeoutRefs.current.push(noteHighlightTimeout);

      // Remove highlight when this note ends (or when next note starts, whichever is later)
      const noteEndTime = noteStartTime + noteDuration * 1000;
      const noteUnhighlightTimeout = window.setTimeout(() => {
        // Only update if this is still the current playback
        if (
          playbackStateRef.current &&
          playbackStateRef.current.playbackId === currentPlaybackId
        ) {
          // Only clear if this is the last note
          if (index === chordNotes.length - 1) {
            setCurrentPlayingNoteIndex(null);
          }
        }
      }, noteEndTime);
      timeoutRefs.current.push(noteUnhighlightTimeout);

      // Schedule individual note to play with a timeout that checks playback ID
      const noteTimeout = window.setTimeout(() => {
        // Only play if this is still the current playback
        if (
          playbackStateRef.current &&
          playbackStateRef.current.playbackId === currentPlaybackId &&
          piano
        ) {
          // Play individual note - each note overlaps with the next
          piano.triggerAttackRelease(note, noteDuration * 0.95);
        }
      }, noteStartTime);
      timeoutRefs.current.push(noteTimeout);
    });

    // Return a promise that resolves when playback completes
    const finishPlaybackId = playbackId; // Capture playback ID for finish callback
    return new Promise<void>(resolve => {
      const finishTimeout = window.setTimeout(() => {
        // Only resolve if this is still the current playback
        if (
          playbackStateRef.current &&
          playbackStateRef.current.playbackId === finishPlaybackId
        ) {
          setIsPlaying(false);
          setCurrentPlayingNoteIndex(null);
          clearAllTimeouts();
          playbackStateRef.current = null;

          // Store values from parameters (already captured in closure)
          const loopKey = key;
          const loopChordType = chordType;
          const loopForward = forward;

          // Loop if not paused and practice mode is active
          // Use a small delay to allow React to update refs
          setTimeout(() => {
            // Check if we should continue looping
            // Verify that practice mode is active, not paused, and key/chord match
            if (
              !isPausedRef.current &&
              isPracticeModeRef.current &&
              currentKeyRef.current === loopKey &&
              currentChordTypeRef.current === loopChordType
            ) {
              // If auto-play next is enabled, update previous chord refs and play next chord
              if (autoPlayNextRef.current !== 'off') {
                // Update previous chord refs to the chord that just finished
                previousKeyRef.current = loopKey;
                previousChordTypeRef.current = loopChordType;
                playNextChord();
              } else {
                // Alternate direction: play backward next time
                const nextForward = !loopForward;
                setIsPlayingForward(nextForward);
                // Continue looping the same chord in opposite direction
                playChord(loopKey, loopChordType, nextForward);
              }
            }
          }, 10);

          resolve();
        }
      }, totalDuration * 1000);
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
      const elapsedTime = (Date.now() - state.startTime) / 1000; // elapsed in seconds
      const oldQuarterNoteDuration = 60 / state.startBpm;
      const oldChordDuration = oldQuarterNoteDuration * 2;
      const oldNoteGap = oldQuarterNoteDuration * 0.8;

      // Determine which phase we're in (chord or individual notes)
      let currentNoteIndex = -1; // -1 means chord is playing
      if (elapsedTime > oldChordDuration) {
        // We're in the individual notes phase
        const timeInNotesPhase = elapsedTime - oldChordDuration;
        currentNoteIndex = Math.floor(timeInNotesPhase / oldNoteGap);
        currentNoteIndex = Math.min(
          currentNoteIndex,
          state.chordNotes.length - 1
        );
      }

      // Calculate the next note index to play
      const nextNoteIndex = currentNoteIndex + 1;

      // Only reschedule if there are remaining notes to play
      if (nextNoteIndex <= state.chordNotes.length) {
        // Stop all currently playing notes to prevent overlaps
        piano.releaseAll();

        // Stop all currently playing notes to prevent overlaps
        piano.releaseAll();

        // Clear all pending timeouts and scheduled notes
        clearAllTimeouts();

        // Update playback state with new BPM and new playback ID
        const newPlaybackId = ++playbackIdRef.current;
        playbackStateRef.current = {
          ...state,
          startBpm: bpm,
          startTime: Date.now(), // Reset start time for rescheduling
          playbackId: newPlaybackId,
        };

        // Reschedule immediately from the next note with new BPM
        // This will make the next note play at the new speed
        playChord(state.currentKey, state.currentChordType, isPlayingForward);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, isPlaying]);

  // Start practice session
  const startPractice = async () => {
    if (selectedKeys.size === 0 || selectedChords.size === 0) return;

    setIsPracticeMode(true);

    // Reset previous chord refs when starting a new practice session
    previousKeyRef.current = null;
    previousChordTypeRef.current = null;
    // Reset priority mode tracking
    currentKeyPriorityRef.current = null;
    currentChordPriorityRef.current = null;
    playedChordsForKeyRef.current = new Set();
    playedKeysForChordRef.current = new Set();

    // Reset shuffle when starting practice
    updateShuffledCombinations();
    combinationIndexRef.current = 0;

    const randomCombo = getNextCombination(false);
    if (!randomCombo) return;

    // Initialize priority mode tracking
    if (autoPlayNext === 'key-priority') {
      currentKeyPriorityRef.current = randomCombo.key;
      playedChordsForKeyRef.current.add(randomCombo.chord);
    } else if (autoPlayNext === 'chord-priority') {
      currentChordPriorityRef.current = randomCombo.chord;
      playedKeysForChordRef.current.add(randomCombo.key);
    }

    // Set new chord and play it directly
    setCurrentKey(randomCombo.key);
    setCurrentChordType(randomCombo.chord);
    // Wait for chord to finish playing before starting timer
    await playChord(randomCombo.key, randomCombo.chord, true);

    // Start session timer after first chord finishes
    setSessionStartTime(Date.now());
  };

  // Play next random chord
  const playNextChord = async () => {
    if (selectedKeys.size === 0 || selectedChords.size === 0) return;

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
    }

    let nextCombo: { key: string; chord: ChordType } | null = null;

    // Handle different auto-play modes
    if (autoPlayNextRef.current === 'key-priority') {
      // Key priority: keep same key, cycle through chords
      const currentKey = currentKeyPriorityRef.current || currentKeyRef.current;
      if (!currentKey) {
        // Fallback to random if no current key
        nextCombo = getNextCombination(true);
      } else {
        const availableChords = Array.from(selectedChords).filter(
          chord => !playedChordsForKeyRef.current.has(chord)
        );

        if (availableChords.length > 0) {
          // Pick random from unplayed chords for this key
          const randomChord =
            availableChords[Math.floor(Math.random() * availableChords.length)];
          playedChordsForKeyRef.current.add(randomChord);
          nextCombo = { key: currentKey, chord: randomChord };
        } else {
          // All chords played for this key, move to next key
          playedChordsForKeyRef.current.clear();
          const availableKeys = Array.from(selectedKeys).filter(
            key => key !== currentKey
          );
          if (availableKeys.length > 0) {
            const nextKey =
              availableKeys[Math.floor(Math.random() * availableKeys.length)];
            currentKeyPriorityRef.current = nextKey;
            const randomChord =
              Array.from(selectedChords)[
                Math.floor(Math.random() * selectedChords.size)
              ];
            playedChordsForKeyRef.current.add(randomChord);
            nextCombo = { key: nextKey, chord: randomChord };
          } else {
            // Only one key, reset and start over
            playedChordsForKeyRef.current.clear();
            const randomChord =
              Array.from(selectedChords)[
                Math.floor(Math.random() * selectedChords.size)
              ];
            playedChordsForKeyRef.current.add(randomChord);
            nextCombo = { key: currentKey, chord: randomChord };
          }
        }
      }
    } else if (autoPlayNextRef.current === 'chord-priority') {
      // Chord priority: keep same chord, cycle through keys
      const currentChord =
        currentChordPriorityRef.current || currentChordTypeRef.current;
      if (!currentChord) {
        // Fallback to random if no current chord
        nextCombo = getNextCombination(true);
      } else {
        const availableKeys = Array.from(selectedKeys).filter(
          key => !playedKeysForChordRef.current.has(key)
        );

        if (availableKeys.length > 0) {
          // Pick random from unplayed keys for this chord
          const randomKey =
            availableKeys[Math.floor(Math.random() * availableKeys.length)];
          playedKeysForChordRef.current.add(randomKey);
          nextCombo = { key: randomKey, chord: currentChord };
        } else {
          // All keys played for this chord, move to next chord
          playedKeysForChordRef.current.clear();
          const availableChords = Array.from(selectedChords).filter(
            chord => chord !== currentChord
          );
          if (availableChords.length > 0) {
            const nextChord =
              availableChords[
                Math.floor(Math.random() * availableChords.length)
              ];
            currentChordPriorityRef.current = nextChord;
            const randomKey =
              Array.from(selectedKeys)[
                Math.floor(Math.random() * selectedKeys.size)
              ];
            playedKeysForChordRef.current.add(randomKey);
            nextCombo = { key: randomKey, chord: nextChord };
          } else {
            // Only one chord, reset and start over
            playedKeysForChordRef.current.clear();
            const randomKey =
              Array.from(selectedKeys)[
                Math.floor(Math.random() * selectedKeys.size)
              ];
            playedKeysForChordRef.current.add(randomKey);
            nextCombo = { key: randomKey, chord: currentChord };
          }
        }
      }
    } else {
      // Random mode: use existing shuffle-and-cycle method
      nextCombo = getNextCombination(true);
    }

    if (!nextCombo) return;

    // Update priority tracking
    if (autoPlayNextRef.current === 'key-priority') {
      currentKeyPriorityRef.current = nextCombo.key;
    } else if (autoPlayNextRef.current === 'chord-priority') {
      currentChordPriorityRef.current = nextCombo.chord;
    }

    // Set new chord and play it directly (always start forward)
    setCurrentKey(nextCombo.key);
    setCurrentChordType(nextCombo.chord);
    setIsPlayingForward(true);
    await playChord(nextCombo.key, nextCombo.chord, true);
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
    setCurrentChordType(null);
    setIsPlaying(false);
    setCurrentPlayingNoteIndex(null);

    // End session and record
    if (sessionStartTime) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      if (duration > 0) {
        const lastChord =
          currentKey && currentChordType
            ? `${currentKey} ${currentChordType}`
            : 'Practice Session';
        setPracticeSessions(prev => [
          {
            date: new Date().toISOString(),
            chord: lastChord,
            duration,
            selectedKeys: Array.from(selectedKeys),
            selectedChords: Array.from(selectedChords),
          },
          ...prev,
        ]);
      }
      setSessionStartTime(null);
    }
  };

  // Toggle pause/play
  const togglePause = () => {
    if (!currentKey || !currentChordType) return;

    // Use refs to get the latest state values
    const wasPaused = isPausedRef.current;
    const currentlyPlaying = isPlayingRef.current;

    if (wasPaused) {
      // Resume: start playing
      setIsPaused(false);
      // Continue playing from where we left off
      if (!currentlyPlaying) {
        playChord(currentKey, currentChordType, isPlayingForward);
      }
    } else {
      // Pause: stop current playback
      setIsPaused(true);
      if (piano) {
        piano.releaseAll();
      }
      clearAllTimeouts();
      setIsPlaying(false);
      setCurrentPlayingNoteIndex(null);
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
        if (currentKey && currentChordType) {
          togglePause();
        }
      }

      // Enter: go to next chord
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission
        playNextChord();
      }

      // Escape: stop practice
      if (event.key === 'Escape') {
        event.preventDefault();
        stopPractice();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // Note: togglePause, playNextChord, and stopPractice are intentionally omitted from deps
    // to avoid recreating the listener on every render. The closure will capture
    // the latest function references.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPracticeMode, currentKey, currentChordType]);

  // Reset shuffle when selections change
  useEffect(() => {
    updateShuffledCombinations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys, selectedChords]);

  // Auto-play chord when practice mode starts and chord is set (and not paused)
  useEffect(() => {
    if (
      isPracticeMode &&
      currentKey &&
      currentChordType &&
      piano &&
      !isPlaying &&
      !isPaused
    ) {
      const playCurrentChord = async () => {
        await playChord(currentKey, currentChordType, true);
      };
      playCurrentChord();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey, currentChordType, isPracticeMode, piano]);

  // Calculate total practice time
  const totalPracticeTime = practiceSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );

  // Calculate stats for keys and chords
  const keyStats: Record<string, number> = {};
  const chordStats: Record<string, number> = {};

  practiceSessions.forEach(session => {
    // Count time for each key in this session
    session.selectedKeys.forEach(key => {
      keyStats[key] = (keyStats[key] || 0) + session.duration;
    });
    // Count time for each chord in this session
    session.selectedChords.forEach(chord => {
      chordStats[chord] = (chordStats[chord] || 0) + session.duration;
    });
  });

  // Calculate percentages
  const keyPercentages = Object.entries(keyStats)
    .map(([key, time]) => ({
      key,
      percentage: totalPracticeTime > 0 ? (time / totalPracticeTime) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const chordPercentages = Object.entries(chordStats)
    .map(([chord, time]) => ({
      chord,
      percentage: totalPracticeTime > 0 ? (time / totalPracticeTime) * 100 : 0,
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
            <h1>🎸 Chord Practice Center</h1>
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
                <span className="difficulty-label">Difficulty:</span>
                <div className="difficulty-buttons">
                  <button
                    className={`difficulty-button ${difficulty === 'entry' ? 'active' : ''}`}
                    onClick={() => handleDifficultyChange('entry')}
                    disabled={isPracticeMode}
                  >
                    Entry
                  </button>
                  <button
                    className={`difficulty-button ${difficulty === 'intermediate' ? 'active' : ''}`}
                    onClick={() => handleDifficultyChange('intermediate')}
                    disabled={isPracticeMode}
                  >
                    Intermediate
                  </button>
                  <button
                    className={`difficulty-button ${difficulty === 'professional' ? 'active' : ''}`}
                    onClick={() => handleDifficultyChange('professional')}
                    disabled={isPracticeMode}
                  >
                    Professional
                  </button>
                </div>
              </div>

              <KeySelectionPanel
                selectedKeys={selectedKeys}
                onToggleKey={toggleKey}
                disabled={isPracticeMode}
                difficulty={difficulty}
              />

              <ChordSelectionPanel
                selectedChords={selectedChords}
                onToggleChord={toggleChord}
                onToggleCategory={toggleChordCategory}
                disabled={isPracticeMode}
                difficulty={difficulty}
              />
            </div>

            {/* Practice Interface - Full width on mobile */}
            <div className="right-panel">
              <ChordPracticePanel
                currentKey={currentKey}
                currentChordType={currentChordType}
                isPracticeMode={isPracticeMode}
                isPlaying={isPlaying}
                currentPlayingNoteIndex={currentPlayingNoteIndex}
                onStartPractice={startPractice}
                onStopPractice={stopPractice}
                onTogglePause={togglePause}
                isPaused={isPaused}
                onNextChord={playNextChord}
                selectedKeys={selectedKeys}
                selectedChords={selectedChords}
                bpm={bpm}
                onBpmChange={setBpm}
                autoPlayNext={autoPlayNext}
                onAutoPlayNextChange={setAutoPlayNext}
              />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="settings-container">
            <div className="settings-panel">
              <h2>⚙️ Practice Settings</h2>
              <p>Configure your key and chord selection preferences.</p>

              {/* Mobile: Show difficulty selector, key selection, and chord selection */}
              <div className="mobile-only">
                {/* Compact Difficulty Selector */}
                <div className="compact-difficulty-selector">
                  <span className="difficulty-label">Difficulty:</span>
                  <div className="difficulty-buttons">
                    <button
                      className={`difficulty-button ${difficulty === 'entry' ? 'active' : ''}`}
                      onClick={() => handleDifficultyChange('entry')}
                      disabled={isPracticeMode}
                    >
                      Entry
                    </button>
                    <button
                      className={`difficulty-button ${difficulty === 'intermediate' ? 'active' : ''}`}
                      onClick={() => handleDifficultyChange('intermediate')}
                      disabled={isPracticeMode}
                    >
                      Intermediate
                    </button>
                    <button
                      className={`difficulty-button ${difficulty === 'professional' ? 'active' : ''}`}
                      onClick={() => handleDifficultyChange('professional')}
                      disabled={isPracticeMode}
                    >
                      Professional
                    </button>
                  </div>
                </div>

                <KeySelectionPanel
                  selectedKeys={selectedKeys}
                  onToggleKey={toggleKey}
                  disabled={isPracticeMode}
                  difficulty={difficulty}
                />

                <ChordSelectionPanel
                  selectedChords={selectedChords}
                  onToggleChord={toggleChord}
                  onToggleCategory={toggleChordCategory}
                  disabled={isPracticeMode}
                  difficulty={difficulty}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="chord-practice-container">
            <div className="chord-practice-panel">
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
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="progress-percentage">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No practice data yet.</p>
                  )}
                </div>

                <div className="stats-panel">
                  <h3>Practice Time by Chord</h3>
                  {chordPercentages.length > 0 ? (
                    <div className="stats-list">
                      {chordPercentages.map(({ chord, percentage }) => (
                        <div key={chord} className="stat-item">
                          <div className="stat-label">{chord}</div>
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="progress-percentage">
                            {percentage.toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No practice data yet.</p>
                  )}
                </div>
              </div>

              {/* Recent Practice Sessions */}
              <div className="history-section">
                <h3>Recent Practice Sessions</h3>
                {practiceSessions.length > 0 ? (
                  <div className="history-list">
                    {practiceSessions.slice(0, 10).map((session, index) => (
                      <div key={index} className="history-item">
                        <div className="history-chord">{session.chord}</div>
                        <div className="history-keys">
                          Keys: {session.selectedKeys.join(', ')}
                        </div>
                        <div className="history-chords">
                          Chords: {session.selectedChords.join(', ')}
                        </div>
                        <div className="history-meta">
                          <span>
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span>
                            {Math.floor(session.duration / 60)}m{' '}
                            {session.duration % 60}s
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No practice sessions yet. Start practicing!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default ChordPracticeApp;
