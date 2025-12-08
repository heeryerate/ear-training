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

  // Clear all pending timeouts
  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
    timeoutRefs.current = [];
  };

  // Initialize piano sampler
  useEffect(() => {
    const newPiano = new Tone.Sampler({
      urls: {
        C4: 'C4.mp3',
        'D#4': 'Ds4.mp3',
        'F#4': 'Fs4.mp3',
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
    scaleType: ScaleType
  ): Promise<void> => {
    if (!piano) return Promise.resolve();

    // Clear any existing timeouts
    clearAllTimeouts();

    setIsPlaying(true);
    setCurrentPlayingNoteIndex(null);
    await initializeAudio();

    // Use notes that match the display spelling
    const scaleNotes = getScaleNotesForAudio(key, scaleType);
    const noteDuration = 0.5; // Duration in seconds
    const totalDuration = (scaleNotes.length + 1) * noteDuration; // +1 for octave note

    // Play each note in sequence
    scaleNotes.forEach((note, index) => {
      const noteTime = Tone.now() + index * noteDuration;
      // Highlight note when it starts playing
      const highlightTimeout = window.setTimeout(
        () => {
          setCurrentPlayingNoteIndex(index);
        },
        index * noteDuration * 1000
      );
      timeoutRefs.current.push(highlightTimeout);

      // Remove highlight when note ends
      const unhighlightTimeout = window.setTimeout(
        () => {
          setCurrentPlayingNoteIndex(null);
        },
        (index + 1) * noteDuration * 1000
      );
      timeoutRefs.current.push(unhighlightTimeout);

      piano.triggerAttackRelease(note, noteDuration * 0.9, noteTime);
    });

    // Play octave note at the end
    if (scaleNotes.length > 0) {
      const octaveNote = scaleNotes[0].replace(/(\d+)$/, match => {
        return String(parseInt(match) + 1);
      });
      const octaveTime = Tone.now() + scaleNotes.length * noteDuration;
      // Highlight root note when octave plays
      const octaveHighlightTimeout = window.setTimeout(
        () => {
          setCurrentPlayingNoteIndex(0);
        },
        scaleNotes.length * noteDuration * 1000
      );
      timeoutRefs.current.push(octaveHighlightTimeout);

      // Remove highlight when octave note ends
      const octaveUnhighlightTimeout = window.setTimeout(
        () => {
          setCurrentPlayingNoteIndex(null);
        },
        (scaleNotes.length + 1) * noteDuration * 1000
      );
      timeoutRefs.current.push(octaveUnhighlightTimeout);

      piano.triggerAttackRelease(octaveNote, noteDuration * 0.9, octaveTime);
    }

    // Return a promise that resolves when playback completes
    return new Promise<void>(resolve => {
      const finishTimeout = window.setTimeout(() => {
        setIsPlaying(false);
        setCurrentPlayingNoteIndex(null);
        clearAllTimeouts();
        resolve();
      }, totalDuration * 1000);
      timeoutRefs.current.push(finishTimeout);
    });
  };

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
        const noteDuration = 0.5;
        const totalDuration = (scaleNotes.length + 1) * noteDuration;

        scaleNotes.forEach((note, index) => {
          const noteTime = Tone.now() + index * noteDuration;
          // Highlight note when it starts playing
          const highlightTimeout = window.setTimeout(
            () => {
              setCurrentPlayingNoteIndex(index);
            },
            index * noteDuration * 1000
          );
          timeoutRefs.current.push(highlightTimeout);

          // Remove highlight when note ends
          const unhighlightTimeout = window.setTimeout(
            () => {
              setCurrentPlayingNoteIndex(null);
            },
            (index + 1) * noteDuration * 1000
          );
          timeoutRefs.current.push(unhighlightTimeout);

          piano.triggerAttackRelease(note, noteDuration * 0.9, noteTime);
        });

        if (scaleNotes.length > 0) {
          const octaveNote = scaleNotes[0].replace(/(\d+)$/, match => {
            return String(parseInt(match) + 1);
          });
          const octaveTime = Tone.now() + scaleNotes.length * noteDuration;
          // Highlight root note when octave plays
          const octaveHighlightTimeout = window.setTimeout(
            () => {
              setCurrentPlayingNoteIndex(0);
            },
            scaleNotes.length * noteDuration * 1000
          );
          timeoutRefs.current.push(octaveHighlightTimeout);

          // Remove highlight when octave note ends
          const octaveUnhighlightTimeout = window.setTimeout(
            () => {
              setCurrentPlayingNoteIndex(null);
            },
            (scaleNotes.length + 1) * noteDuration * 1000
          );
          timeoutRefs.current.push(octaveUnhighlightTimeout);

          piano.triggerAttackRelease(
            octaveNote,
            noteDuration * 0.9,
            octaveTime
          );
        }

        const finishTimeout = window.setTimeout(() => {
          setIsPlaying(false);
          setCurrentPlayingNoteIndex(null);
          clearAllTimeouts();
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
