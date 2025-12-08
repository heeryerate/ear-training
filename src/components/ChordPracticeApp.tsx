import './ChordPracticeApp.css';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';

import { ChordType, getChordNotesForAudio } from '../data/chords';
import ChordPracticePanel from './ChordPracticePanel';
import ChordSelectionPanel from './ChordSelectionPanel';
import KeySelectionPanel from './KeySelectionPanel';

type ActiveTab = 'practice' | 'progress' | 'settings';

function ChordPracticeApp() {
  const [piano, setPiano] = useState<Tone.Sampler | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');

  // Key and chord selection (multiple selection)
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['C']));
  const [selectedChords, setSelectedChords] = useState<Set<ChordType>>(
    new Set<ChordType>(['major', 'minor'])
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

  // Play chord
  const playChord = async (
    key: string,
    chordType: ChordType
  ): Promise<void> => {
    if (!piano) return Promise.resolve();

    // Clear any existing timeouts
    clearAllTimeouts();

    setIsPlaying(true);
    setCurrentPlayingNoteIndex(null);
    await initializeAudio();

    // Use notes that match the display spelling
    const chordNotes = getChordNotesForAudio(key, chordType);
    const chordDuration = 1.0; // Duration for the full chord
    const noteGap = 0.4; // Time between when each note starts (overlapping)
    const noteDuration = noteGap * 1.5; // Each note plays longer to overlap smoothly
    const totalDuration =
      chordDuration + (chordNotes.length - 1) * noteGap + noteDuration;

    const startTime = Tone.now();

    // Step 1: Play all notes simultaneously (chord)
    const chordTime = startTime;

    // Highlight all notes when chord starts playing
    const chordHighlightTimeout = window.setTimeout(() => {
      setCurrentPlayingNoteIndex(-1); // -1 indicates all notes are playing
    }, 0);
    timeoutRefs.current.push(chordHighlightTimeout);

    // Play the full chord
    chordNotes.forEach(note => {
      // Play chord for the full duration (until all individual notes finish)
      piano.triggerAttackRelease(note, totalDuration * 0.95, chordTime);
    });

    // Step 2: After chord duration, play each note individually with highlighting
    const individualNotesStartTime = chordDuration * 1000;

    chordNotes.forEach((note, index) => {
      const noteStartTime = individualNotesStartTime + index * noteGap * 1000;

      // Highlight this specific note when it starts
      const noteHighlightTimeout = window.setTimeout(() => {
        setCurrentPlayingNoteIndex(index);
      }, noteStartTime);
      timeoutRefs.current.push(noteHighlightTimeout);

      // Remove highlight when this note ends (or when next note starts, whichever is later)
      const noteEndTime = noteStartTime + noteDuration * 1000;
      const noteUnhighlightTimeout = window.setTimeout(() => {
        // Only clear if this is the last note
        if (index === chordNotes.length - 1) {
          setCurrentPlayingNoteIndex(null);
        }
      }, noteEndTime);
      timeoutRefs.current.push(noteUnhighlightTimeout);

      // Play individual note - each note overlaps with the next
      const individualNoteTime = startTime + chordDuration + index * noteGap;
      piano.triggerAttackRelease(note, noteDuration * 0.95, individualNoteTime);
    });

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
    if (selectedKeys.size === 0 || selectedChords.size === 0) return;

    setIsPracticeMode(true);

    const keysArray = Array.from(selectedKeys);
    const chordsArray = Array.from(selectedChords);

    // Generate all possible combinations
    const allCombinations: Array<{ key: string; chord: ChordType }> = [];
    keysArray.forEach(key => {
      chordsArray.forEach(chord => {
        allCombinations.push({ key, chord });
      });
    });

    // Pick a random combination
    const randomCombo =
      allCombinations[Math.floor(Math.random() * allCombinations.length)];

    // Set new chord and play it directly
    setCurrentKey(randomCombo.key);
    setCurrentChordType(randomCombo.chord);
    // Wait for chord to finish playing before starting timer
    await playChord(randomCombo.key, randomCombo.chord);

    // Start session timer after first chord finishes
    setSessionStartTime(Date.now());
  };

  // Play next random chord
  const playNextChord = async () => {
    if (selectedKeys.size === 0 || selectedChords.size === 0) return;
    if (isPlaying) return;

    const keysArray = Array.from(selectedKeys);
    const chordsArray = Array.from(selectedChords);

    // Generate all possible combinations
    const allCombinations: Array<{ key: string; chord: ChordType }> = [];
    keysArray.forEach(key => {
      chordsArray.forEach(chord => {
        allCombinations.push({ key, chord });
      });
    });

    // Filter out the current combination if it exists
    const availableCombinations = allCombinations.filter(
      combo => !(combo.key === currentKey && combo.chord === currentChordType)
    );

    // If no other combinations available (only one option), use it anyway
    const combinationsToUse =
      availableCombinations.length > 0
        ? availableCombinations
        : allCombinations;

    // Pick a random combination
    const randomCombo =
      combinationsToUse[Math.floor(Math.random() * combinationsToUse.length)];

    // Set new chord and play it directly
    setCurrentKey(randomCombo.key);
    setCurrentChordType(randomCombo.chord);
    await playChord(randomCombo.key, randomCombo.chord);
  };

  // Stop practice
  const stopPractice = () => {
    // Clear all pending timeouts
    clearAllTimeouts();

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

  // Repeat current chord
  const repeatChord = async () => {
    if (!currentKey || !currentChordType || isPlaying) return;
    await playChord(currentKey, currentChordType);
  };

  // Auto-play chord when practice mode starts and chord is set
  useEffect(() => {
    if (
      isPracticeMode &&
      currentKey &&
      currentChordType &&
      piano &&
      !isPlaying
    ) {
      const playCurrentChord = async () => {
        await playChord(currentKey, currentChordType);
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
              <KeySelectionPanel
                selectedKeys={selectedKeys}
                onToggleKey={toggleKey}
                disabled={isPracticeMode}
              />

              <ChordSelectionPanel
                selectedChords={selectedChords}
                onToggleChord={toggleChord}
                disabled={isPracticeMode}
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
                onRepeatChord={repeatChord}
                onNextChord={playNextChord}
                selectedKeys={selectedKeys}
                selectedChords={selectedChords}
              />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="settings-container">
            <div className="settings-panel">
              <h2>⚙️ Practice Settings</h2>
              <p>Configure your key and chord selection preferences.</p>

              <KeySelectionPanel
                selectedKeys={selectedKeys}
                onToggleKey={toggleKey}
                disabled={isPracticeMode}
              />

              <ChordSelectionPanel
                selectedChords={selectedChords}
                onToggleChord={toggleChord}
                disabled={isPracticeMode}
              />
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
