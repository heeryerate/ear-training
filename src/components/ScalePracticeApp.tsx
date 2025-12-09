import './ScalePracticeApp.css';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';

import { getDiatonicNotes, keyCenters } from '../data/keyCenters';
import {
  getScaleDisplayName,
  getScaleNotes,
  getScaleNotesForAudio,
  ScaleType,
} from '../data/scales';
import KeySelectionPanel from './KeySelectionPanel';
import ScalePracticePanel from './ScalePracticePanel';
import ScaleSelectionPanel from './ScaleSelectionPanel';

type ActiveTab = 'practice' | 'progress' | 'settings';

function ScalePracticeApp() {
  const [piano, setPiano] = useState<Tone.Sampler | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');
  const [bpm, setBpm] = useState(120);

  // Key and scale selection (multiple selection)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['C']));
  const [selectedScales, setSelectedScales] = useState<Set<ScaleType>>(
    new Set<ScaleType>(['major', 'minor'])
  );

  // Practice state
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [currentScaleType, setCurrentScaleType] = useState<ScaleType | null>(
    null
  );
  const [currentPlayingNoteIndex, setCurrentPlayingNoteIndex] = useState<
    number | null
  >(null);

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

  // Store timeout IDs for cleanup
  const timeoutRefs = React.useRef<number[]>([]);
  // Store playback state for BPM adjustment
  const playbackStateRef = React.useRef<{
    startTime: number;
    scaleNotes: string[];
    currentKey: string;
    currentScaleType: ScaleType;
    startBpm: number;
    playbackId: number;
  } | null>(null);
  // Playback ID counter to invalidate old scheduled notes
  const playbackIdRef = React.useRef<number>(0);

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

  // Generate random combination of key and scale
  const generateRandomScale = () => {
    if (selectedKeys.size === 0 || selectedScales.size === 0) return;

    const keysArray = Array.from(selectedKeys);
    const scalesArray = Array.from(selectedScales);

    // Generate all possible combinations
    const allCombinations: Array<{ key: string; scale: ScaleType }> = [];
    keysArray.forEach(key => {
      scalesArray.forEach(scale => {
        allCombinations.push({ key, scale });
      });
    });

    // Filter out the current combination if it exists
    const availableCombinations = allCombinations.filter(
      combo => !(combo.key === currentKey && combo.scale === currentScaleType)
    );

    // If no other combinations available (only one option), use it anyway
    const combinationsToUse =
      availableCombinations.length > 0
        ? availableCombinations
        : allCombinations;

    // Pick a random combination
    const randomCombo =
      combinationsToUse[Math.floor(Math.random() * combinationsToUse.length)];

    // Reset playing state first to ensure useEffect can trigger
    setIsPlaying(false);
    setCurrentPlayingNoteIndex(null);

    // Set new scale - useEffect will auto-play when isPlaying becomes false
    setCurrentKey(randomCombo.key);
    setCurrentScaleType(randomCombo.scale);
  };

  // Play scale
  const playScale = async (
    key: string,
    scaleType: ScaleType,
    startFromIndex: number = 0
  ): Promise<void> => {
    if (!piano) return Promise.resolve();

    // Clear any existing timeouts
    clearAllTimeouts();

    setIsPlaying(true);
    setCurrentPlayingNoteIndex(null);
    await initializeAudio();

    // Use notes that match the display spelling
    const scaleNotes = getScaleNotesForAudio(key, scaleType);
    // Calculate note duration based on BPM (quarter note = 60/BPM seconds)
    const noteDuration = 60 / bpm; // Duration in seconds
    const totalDuration = (scaleNotes.length + 1) * noteDuration; // +1 for octave note

    // Store playback state for BPM adjustment
    const playbackStartTime = Date.now();
    const playbackId = ++playbackIdRef.current; // Increment and get new playback ID
    playbackStateRef.current = {
      startTime: playbackStartTime,
      scaleNotes,
      currentKey: key,
      currentScaleType: scaleType,
      startBpm: bpm,
      playbackId,
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
            piano
          ) {
            piano.triggerAttackRelease(note, noteDuration * 0.9);
          }
        },
        relativeIndex * noteDuration * 1000
      );
      timeoutRefs.current.push(noteTimeout);

      // Highlight note when it starts playing
      const highlightTimeout = window.setTimeout(
        () => {
          // Only update if this is still the current playback
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId
          ) {
            setCurrentPlayingNoteIndex(index);
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

    // Play octave note at the end (only if we haven't passed it)
    if (scaleNotes.length > 0 && startFromIndex <= scaleNotes.length) {
      const octaveNote = scaleNotes[0].replace(/(\d+)$/, match => {
        return String(parseInt(match) + 1);
      });
      const relativeOctaveIndex = scaleNotes.length - startFromIndex;
      const currentPlaybackId = playbackId; // Capture current playback ID

      // Schedule octave note to play with a timeout that checks playback ID
      const octaveTimeout = window.setTimeout(
        () => {
          // Only play note if this is still the current playback
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId &&
            piano
          ) {
            piano.triggerAttackRelease(octaveNote, noteDuration * 0.9);
          }
        },
        relativeOctaveIndex * noteDuration * 1000
      );
      timeoutRefs.current.push(octaveTimeout);

      // Highlight root note when octave plays
      const octaveHighlightTimeout = window.setTimeout(
        () => {
          // Only update if this is still the current playback
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId
          ) {
            setCurrentPlayingNoteIndex(0);
          }
        },
        relativeOctaveIndex * noteDuration * 1000
      );
      timeoutRefs.current.push(octaveHighlightTimeout);

      // Remove highlight when octave note ends
      const octaveUnhighlightTimeout = window.setTimeout(
        () => {
          // Only update if this is still the current playback
          if (
            playbackStateRef.current &&
            playbackStateRef.current.playbackId === currentPlaybackId
          ) {
            setCurrentPlayingNoteIndex(null);
          }
        },
        (relativeOctaveIndex + 1) * noteDuration * 1000
      );
      timeoutRefs.current.push(octaveUnhighlightTimeout);
    }

    // Return a promise that resolves when playback completes
    const remainingNotes = scaleNotes.length + 1 - startFromIndex; // +1 for octave
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
            clearAllTimeouts();
            playbackStateRef.current = null;
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
      const elapsedTime = (Date.now() - state.startTime) / 1000; // elapsed in seconds
      const oldNoteDuration = 60 / state.startBpm; // Duration based on BPM when playback started
      const newNoteDuration = 60 / bpm; // New duration based on current BPM

      // Determine which note is currently playing
      let currentPlayingIndex = 0;
      if (currentPlayingNoteIndex !== null) {
        // Use the actual playing note index
        currentPlayingIndex = currentPlayingNoteIndex;
      } else {
        // Calculate based on elapsed time
        currentPlayingIndex = Math.floor(elapsedTime / oldNoteDuration);
      }

      // Calculate the next note index to play
      const nextNoteIndex = currentPlayingIndex + 1;

      // Make sure we don't go beyond the scale length
      if (nextNoteIndex <= state.scaleNotes.length) {
        // Stop all currently playing notes to prevent overlaps
        piano.releaseAll();

        // Clear all pending timeouts and scheduled notes
        clearAllTimeouts();

        // Update playback state with new BPM
        playbackStateRef.current.startBpm = bpm;
        // Reset start time to now for immediate rescheduling
        playbackStateRef.current.startTime = Date.now();

        // Reschedule immediately from the next note with new BPM
        // This will make the next note play at the new speed
        playScale(state.currentKey, state.currentScaleType, nextNoteIndex);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bpm, isPlaying]);

  // Start practice session
  const startPractice = async () => {
    if (selectedKeys.size === 0 || selectedScales.size === 0) return;

    setIsPracticeMode(true);

    const keysArray = Array.from(selectedKeys);
    const scalesArray = Array.from(selectedScales);

    // Generate all possible combinations
    const allCombinations: Array<{ key: string; scale: ScaleType }> = [];
    keysArray.forEach(key => {
      scalesArray.forEach(scale => {
        allCombinations.push({ key, scale });
      });
    });

    // Pick a random combination
    const randomCombo =
      allCombinations[Math.floor(Math.random() * allCombinations.length)];

    // Set new scale and play it directly
    setCurrentKey(randomCombo.key);
    setCurrentScaleType(randomCombo.scale);
    // Wait for scale to finish playing before starting timer
    await playScale(randomCombo.key, randomCombo.scale);

    // Start session timer after first scale finishes
    setSessionStartTime(Date.now());
  };

  // Play next random scale
  const playNextScale = async () => {
    if (selectedKeys.size === 0 || selectedScales.size === 0) return;
    if (isPlaying) return;

    const keysArray = Array.from(selectedKeys);
    const scalesArray = Array.from(selectedScales);

    // Generate all possible combinations
    const allCombinations: Array<{ key: string; scale: ScaleType }> = [];
    keysArray.forEach(key => {
      scalesArray.forEach(scale => {
        allCombinations.push({ key, scale });
      });
    });

    // Filter out the current combination if it exists
    const availableCombinations = allCombinations.filter(
      combo => !(combo.key === currentKey && combo.scale === currentScaleType)
    );

    // If no other combinations available (only one option), use it anyway
    const combinationsToUse =
      availableCombinations.length > 0
        ? availableCombinations
        : allCombinations;

    // Pick a random combination
    const randomCombo =
      combinationsToUse[Math.floor(Math.random() * combinationsToUse.length)];

    // Set new scale and play it directly
    setCurrentKey(randomCombo.key);
    setCurrentScaleType(randomCombo.scale);
    await playScale(randomCombo.key, randomCombo.scale);
  };

  // Stop practice
  const stopPractice = () => {
    // Clear all pending timeouts
    clearAllTimeouts();
    playbackStateRef.current = null;

    setIsPracticeMode(false);
    setCurrentKey(null);
    setCurrentScaleType(null);
    setIsPlaying(false);
    setCurrentPlayingNoteIndex(null);

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

  // Repeat current scale
  const repeatScale = async () => {
    if (!currentKey || !currentScaleType || isPlaying) return;
    await playScale(currentKey, currentScaleType);
  };

  // Auto-play scale when it changes during practice
  useEffect(() => {
    if (
      isPracticeMode &&
      currentKey &&
      currentScaleType &&
      !isPlaying &&
      piano
    ) {
      const playCurrentScale = async () => {
        // Clear any existing timeouts
        clearAllTimeouts();

        await initializeAudio();
        setIsPlaying(true);
        setCurrentPlayingNoteIndex(null);
        // Use notes that match the display spelling
        const scaleNotes = getScaleNotesForAudio(currentKey, currentScaleType);
        // Calculate note duration based on BPM (quarter note = 60/BPM seconds)
        const noteDuration = 60 / bpm;
        const totalDuration = (scaleNotes.length + 1) * noteDuration;

        // Store playback state for BPM adjustment
        const playbackStartTime = Date.now();
        const playbackId = ++playbackIdRef.current; // Increment and get new playback ID
        playbackStateRef.current = {
          startTime: playbackStartTime,
          scaleNotes,
          currentKey,
          currentScaleType,
          startBpm: bpm,
          playbackId,
        };

        const currentPlaybackId = playbackId; // Capture current playback ID
        scaleNotes.forEach((note, index) => {
          // Schedule note to play with a timeout that checks playback ID
          const noteTimeout = window.setTimeout(
            () => {
              // Only play note if this is still the current playback
              if (
                playbackStateRef.current &&
                playbackStateRef.current.playbackId === currentPlaybackId &&
                piano
              ) {
                piano.triggerAttackRelease(note, noteDuration * 0.9);
              }
            },
            index * noteDuration * 1000
          );
          timeoutRefs.current.push(noteTimeout);

          // Highlight note when it starts playing
          const highlightTimeout = window.setTimeout(
            () => {
              // Only update if this is still the current playback
              if (
                playbackStateRef.current &&
                playbackStateRef.current.playbackId === currentPlaybackId
              ) {
                setCurrentPlayingNoteIndex(index);
              }
            },
            index * noteDuration * 1000
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
            (index + 1) * noteDuration * 1000
          );
          timeoutRefs.current.push(unhighlightTimeout);
        });

        if (scaleNotes.length > 0) {
          const octaveNote = scaleNotes[0].replace(/(\d+)$/, match => {
            return String(parseInt(match) + 1);
          });
          // Schedule octave note to play with a timeout that checks playback ID
          const octaveTimeout = window.setTimeout(
            () => {
              // Only play note if this is still the current playback
              if (
                playbackStateRef.current &&
                playbackStateRef.current.playbackId === currentPlaybackId &&
                piano
              ) {
                piano.triggerAttackRelease(octaveNote, noteDuration * 0.9);
              }
            },
            scaleNotes.length * noteDuration * 1000
          );
          timeoutRefs.current.push(octaveTimeout);

          // Highlight root note when octave plays
          const octaveHighlightTimeout = window.setTimeout(
            () => {
              // Only update if this is still the current playback
              if (
                playbackStateRef.current &&
                playbackStateRef.current.playbackId === currentPlaybackId
              ) {
                setCurrentPlayingNoteIndex(0);
              }
            },
            scaleNotes.length * noteDuration * 1000
          );
          timeoutRefs.current.push(octaveHighlightTimeout);

          // Remove highlight when octave note ends
          const octaveUnhighlightTimeout = window.setTimeout(
            () => {
              // Only update if this is still the current playback
              if (
                playbackStateRef.current &&
                playbackStateRef.current.playbackId === currentPlaybackId
              ) {
                setCurrentPlayingNoteIndex(null);
              }
            },
            (scaleNotes.length + 1) * noteDuration * 1000
          );
          timeoutRefs.current.push(octaveUnhighlightTimeout);
        }

        const finishPlaybackId = playbackId; // Capture playback ID for finish callback
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
          }
        }, totalDuration * 1000);
        timeoutRefs.current.push(finishTimeout);
      };
      playCurrentScale();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentKey, currentScaleType, isPracticeMode, piano]);

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
              <KeySelectionPanel
                selectedKeys={selectedKeys}
                onToggleKey={toggleKey}
                disabled={isPracticeMode}
              />

              <ScaleSelectionPanel
                selectedScales={selectedScales}
                onToggleScale={toggleScale}
                disabled={isPracticeMode}
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
                onStopPractice={stopPractice}
                onRepeatScale={repeatScale}
                onNextScale={playNextScale}
                selectedKeys={selectedKeys}
                selectedScales={selectedScales}
                bpm={bpm}
                onBpmChange={setBpm}
              />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="settings-container">
            <div className="settings-panel">
              <h2>⚙️ Practice Settings</h2>
              <p>Configure your key and scale selection preferences.</p>

              <KeySelectionPanel
                selectedKeys={selectedKeys}
                onToggleKey={toggleKey}
                disabled={isPracticeMode}
              />

              <ScaleSelectionPanel
                selectedScales={selectedScales}
                onToggleScale={toggleScale}
                disabled={isPracticeMode}
              />
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
