import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';

import {
  baseProgressions,
  transposeProgression,
} from '../data/chordProgressions';
import { getDiatonicNotes, getNoteDisplayName } from '../data/keyCenters';
import { ActiveTab, Note, NoteStats } from '../types';
import ChordProgressionPanel from './ChordProgressionPanel';
import ExercisePanel from './ExercisePanel';
import NoteSelector from './NoteSelector';

function EarTrainingApp() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [piano, setPiano] = useState<Tone.Sampler | null>(null);
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(
    new Set(getDiatonicNotes('C'))
  ); // Default to C major scale

  // Ear training exercise state
  const [isExerciseMode, setIsExerciseMode] = useState(false);
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [showAnswerButtons, setShowAnswerButtons] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState<string>('');

  // Stats tracking
  const [activeTab, setActiveTab] = useState<ActiveTab>('exercise');
  const [noteStats, setNoteStats] = useState<Record<string, NoteStats>>({});
  const [confusionPairs, setConfusionPairs] = useState<Record<string, number>>(
    {}
  );

  // Chord progression and key selection
  const [selectedProgression, setSelectedProgression] = useState('I-IV-V-I');
  const [selectedKey, setSelectedKey] = useState('C');
  const [bpm, setBpm] = useState(120);

  // Handle progression change and auto-play
  const handleProgressionChange = async (progression: string) => {
    setSelectedProgression(progression);
    // Auto-play the progression when changed (skip if empty or random)
    if (
      piano &&
      !isPlaying &&
      progression &&
      progression !== '' &&
      progression !== 'random'
    ) {
      await playChordProgression(progression, selectedKey);
    }
  };

  // Initialize stats for all notes
  useEffect(() => {
    const initialStats: Record<string, { correct: number; incorrect: number }> =
      {};
    const allNoteNames = [
      'C4',
      'C#4',
      'D4',
      'D#4',
      'E4',
      'F4',
      'F#4',
      'G4',
      'G#4',
      'A4',
      'A#4',
      'B4',
    ];
    allNoteNames.forEach(note => {
      initialStats[note] = { correct: 0, incorrect: 0 };
    });
    setNoteStats(initialStats);
  }, []);

  useEffect(() => {
    // Initialize Tone.js with a piano sampler for realistic piano sounds
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
      newPiano.dispose();
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

  const playChordProgression = async (
    progressionOverride?: string,
    keyOverride?: string
  ) => {
    if (!piano) return;

    const progressionKey = progressionOverride || selectedProgression;
    // Skip if empty progression or random (random is handled in exercise functions)
    if (
      !progressionKey ||
      progressionKey === '' ||
      progressionKey === 'random'
    ) {
      return;
    }

    setIsPlaying(true);

    // Initialize audio for mobile devices
    await initializeAudio();

    // Get the transposed chord progression
    const progression = transposeProgression(
      progressionKey,
      keyOverride || selectedKey
    );

    // Calculate time between chords based on BPM (60/BPM seconds per beat)
    const beatDuration = 60 / bpm; // Duration in seconds

    // Play each chord in sequence with proper timing
    progression.chords.forEach((chord, chordIndex) => {
      const chordStartTime = Tone.now() + chordIndex * beatDuration;

      console.log(
        `Playing ${chord.name}: ${chord.notes.join(', ')} at time ${chordStartTime}`
      );

      // Play each note in the chord with small time offsets to avoid conflicts
      // Each chord lasts for one beat (beatDuration)
      chord.notes.forEach((note, noteIndex) => {
        const noteTime = chordStartTime + noteIndex * 0.01; // 10ms offset between notes
        piano.triggerAttackRelease(note, beatDuration, noteTime);
      });
    });

    // Reset playing state after the progression finishes
    setTimeout(
      () => {
        setIsPlaying(false);
      },
      progression.chords.length * beatDuration * 1000
    );
  };

  const startEarTrainingExercise = async () => {
    if (!piano || selectedNotes.size === 0) return;

    setIsPlaying(true);
    setShowAnswerButtons(false);
    setFeedback('');

    // Initialize audio for mobile devices
    await initializeAudio();

    // Handle random progression selection
    let progressionKey = selectedProgression;
    if (progressionKey === 'random') {
      // Randomly select from all progressions including empty
      const allProgressions = ['', ...Object.keys(baseProgressions)];
      progressionKey =
        allProgressions[Math.floor(Math.random() * allProgressions.length)];
    }

    // Get the transposed chord progression
    const progression = transposeProgression(progressionKey, selectedKey);

    // Check if progression is empty
    const hasProgression = progression.chords.length > 0;

    if (hasProgression) {
      // Calculate time between chords based on BPM (60/BPM seconds per beat)
      const beatDuration = 60 / bpm; // Duration in seconds

      // Play each chord in sequence
      progression.chords.forEach((chord, chordIndex) => {
        const chordStartTime = Tone.now() + chordIndex * beatDuration;

        // Each chord lasts for one beat (beatDuration)
        chord.notes.forEach((note, noteIndex) => {
          const noteTime = chordStartTime + noteIndex * 0.01;
          piano.triggerAttackRelease(note, beatDuration, noteTime);
        });
      });
    }

    // After chord progression (or immediately if no progression), play the random note
    const progressionDuration = hasProgression
      ? progression.chords.length * (60 / bpm) * 1000
      : 0;

    setTimeout(async () => {
      const selectedNotesArray = Array.from(selectedNotes);
      const randomNote =
        selectedNotesArray[
          Math.floor(Math.random() * selectedNotesArray.length)
        ];
      setCurrentNote(randomNote);

      console.log(`Playing random note for exercise: ${randomNote}`);

      // Play the note after a short pause
      piano.triggerAttackRelease(randomNote, '2n');

      // Show answer buttons after the note plays
      setTimeout(() => {
        setIsPlaying(false);
        setShowAnswerButtons(true);
        setIsExerciseMode(true);
      }, 1000);
    }, progressionDuration); // Wait for chord progression to finish (or 0 if no progression)
  };

  const handleAnswerSelection = (selectedNote: string) => {
    if (!currentNote) return;

    const isCorrect = selectedNote === currentNote;
    setTotalAttempts(prev => prev + 1);

    // Update note statistics
    setNoteStats(prev => {
      const newStats = { ...prev };
      if (isCorrect) {
        newStats[currentNote] = {
          ...newStats[currentNote],
          correct: newStats[currentNote].correct + 1,
        };
      } else {
        newStats[currentNote] = {
          ...newStats[currentNote],
          incorrect: newStats[currentNote].incorrect + 1,
        };
      }
      return newStats;
    });

    // Track confusion pairs (wrong answers only)
    if (!isCorrect) {
      const pairKey = `${currentNote}→${selectedNote}`;
      setConfusionPairs(prev => ({
        ...prev,
        [pairKey]: (prev[pairKey] || 0) + 1,
      }));
    }

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback(
        `✅ Correct! You heard ${getNoteDisplayName(currentNote, selectedKey)}`
      );
    } else {
      setFeedback(
        `❌ Incorrect. You heard ${getNoteDisplayName(currentNote, selectedKey)}, but selected ${getNoteDisplayName(selectedNote, selectedKey)}`
      );
    }

    // Hide answer buttons immediately
    setShowAnswerButtons(false);

    // Start next exercise after showing feedback briefly
    setTimeout(() => {
      setFeedback('');
      startNextExercise();
    }, 1500); // Reduced from 3000 to 1500ms for faster flow
  };

  const startNextExercise = async () => {
    if (!piano || selectedNotes.size === 0) return;

    setIsPlaying(true);

    // Initialize audio for mobile devices
    await initializeAudio();

    // Handle random progression selection
    let progressionKey = selectedProgression;
    if (progressionKey === 'random') {
      // Randomly select from all progressions including empty
      const allProgressions = ['', ...Object.keys(baseProgressions)];
      progressionKey =
        allProgressions[Math.floor(Math.random() * allProgressions.length)];
    }

    // Get the transposed chord progression
    const progression = transposeProgression(progressionKey, selectedKey);

    // Check if progression is empty
    const hasProgression = progression.chords.length > 0;

    if (hasProgression) {
      // Calculate time between chords based on BPM (60/BPM seconds per beat)
      const beatDuration = 60 / bpm; // Duration in seconds

      // Play each chord in sequence
      progression.chords.forEach((chord, chordIndex) => {
        const chordStartTime = Tone.now() + chordIndex * beatDuration;

        // Each chord lasts for one beat (beatDuration)
        chord.notes.forEach((note, noteIndex) => {
          const noteTime = chordStartTime + noteIndex * 0.01;
          piano.triggerAttackRelease(note, beatDuration, noteTime);
        });
      });
    }

    // After chord progression (or immediately if no progression), play the random note
    const progressionDuration = hasProgression
      ? progression.chords.length * (60 / bpm) * 1000
      : 0;

    setTimeout(async () => {
      const selectedNotesArray = Array.from(selectedNotes);
      const randomNote =
        selectedNotesArray[
          Math.floor(Math.random() * selectedNotesArray.length)
        ];
      setCurrentNote(randomNote);

      console.log(`Playing random note for exercise: ${randomNote}`);

      // Play the note after a short pause
      piano.triggerAttackRelease(randomNote, '2n');

      // Show answer buttons after the note plays
      setTimeout(() => {
        setIsPlaying(false);
        setShowAnswerButtons(true);
      }, 1000);
    }, progressionDuration); // Wait for chord progression to finish (or 0 if no progression)
  };

  const stopExercise = () => {
    setShowAnswerButtons(false);
    setIsExerciseMode(false);
    setCurrentNote(null);
    setFeedback('');
    setIsPlaying(false);
  };

  const resetScore = () => {
    setScore(0);
    setTotalAttempts(0);
    setFeedback('');
    setShowAnswerButtons(false);
    setIsExerciseMode(false);
    setCurrentNote(null);
  };

  const resetStats = () => {
    const resetStats: Record<string, { correct: number; incorrect: number }> =
      {};
    const allNoteNames = [
      'C4',
      'C#4',
      'D4',
      'D#4',
      'E4',
      'F4',
      'F#4',
      'G4',
      'G#4',
      'A4',
      'A#4',
      'B4',
    ];
    allNoteNames.forEach(note => {
      resetStats[note] = { correct: 0, incorrect: 0 };
    });
    setNoteStats(resetStats);
    setConfusionPairs({});
  };

  // Get most common confusion pairs
  const getTopConfusionPairs = (
    limit: number = 10
  ): Array<{
    pair: string;
    actualNote: string;
    guessedNote: string;
    count: number;
  }> => {
    return Object.entries(confusionPairs)
      .map(([pair, count]) => {
        const [actualNote, guessedNote] = pair.split('→');
        return { pair, actualNote, guessedNote, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  const getStrongestNotes = () => {
    const notesWithData = Object.entries(noteStats)
      .filter(([_, stats]) => stats.correct + stats.incorrect > 0)
      .map(([note, stats]) => ({
        note,
        accuracy: stats.correct / (stats.correct + stats.incorrect),
        total: stats.correct + stats.incorrect,
        isPerfect: stats.correct > 0 && stats.incorrect === 0,
      }));

    // Separate perfect and non-perfect notes
    const perfectNotes = notesWithData.filter(n => n.isPerfect);
    const nonPerfectNotes = notesWithData.filter(n => !n.isPerfect);

    // Sort non-perfect notes by accuracy desc
    const sortedNonPerfect = nonPerfectNotes.sort(
      (a, b) => b.accuracy - a.accuracy
    );

    const result = [];

    // If there are perfect notes, group them together as the first item
    if (perfectNotes.length > 0) {
      const totalPerfectAttempts = perfectNotes.reduce(
        (sum, note) => sum + note.total,
        0
      );
      result.push({
        notes: perfectNotes.map(n => n.note),
        accuracy: 1,
        total: totalPerfectAttempts,
        isPerfect: true,
        isGroup: true,
      });
    }

    // Add individual non-perfect notes (limit total results to 5)
    const remainingSlots = 5 - result.length;
    result.push(
      ...sortedNonPerfect.slice(0, remainingSlots).map(note => ({
        notes: [note.note],
        accuracy: note.accuracy,
        total: note.total,
        isPerfect: false,
        isGroup: false,
      }))
    );

    return result;
  };

  const toggleNote = (note: string) => {
    const newSelectedNotes = new Set(selectedNotes);
    if (newSelectedNotes.has(note)) {
      newSelectedNotes.delete(note);
    } else {
      newSelectedNotes.add(note);
    }
    setSelectedNotes(newSelectedNotes);
  };

  // Handler for key center changes - automatically selects diatonic notes
  const handleKeyChange = (newKey: string) => {
    setSelectedKey(newKey);
    const diatonicNotes = getDiatonicNotes(newKey);
    setSelectedNotes(new Set(diatonicNotes));
  };

  // Function to repeat the current note (with chord progression context)
  const repeatCurrentNote = async () => {
    if (!piano || !currentNote || isPlaying) return;

    setIsPlaying(true);
    await initializeAudio();

    console.log(
      `Repeating note with chord progression context: ${currentNote}`
    );

    // Handle random progression selection
    let progressionKey = selectedProgression;
    if (progressionKey === 'random') {
      // Randomly select from all progressions including empty
      const allProgressions = ['', ...Object.keys(baseProgressions)];
      progressionKey =
        allProgressions[Math.floor(Math.random() * allProgressions.length)];
    }

    // Play the chord progression first (same as in exercise) - skip if empty
    const progression = transposeProgression(progressionKey, selectedKey);
    const hasProgression = progression.chords.length > 0;

    if (hasProgression) {
      // Calculate time between chords based on BPM (60/BPM seconds per beat)
      const beatDuration = 60 / bpm; // Duration in seconds

      progression.chords.forEach((chord, chordIndex) => {
        const chordStartTime = Tone.now() + chordIndex * beatDuration;

        // Each chord lasts for one beat (beatDuration)
        chord.notes.forEach((note, noteIndex) => {
          const noteTime = chordStartTime + noteIndex * 0.01; // 10ms offset between notes
          piano.triggerAttackRelease(note, beatDuration, noteTime);
        });
      });
    }

    // Play the current note after the chord progression (or immediately if no progression)
    const progressionDuration = hasProgression
      ? progression.chords.length * (60 / bpm) * 1000
      : 0;

    setTimeout(() => {
      piano.triggerAttackRelease(currentNote, '2n');

      // Reset playing state after note duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 1000);
    }, progressionDuration); // Wait for chord progression to finish (or 0 if no progression)
  };

  // Mobile-specific: Add body padding when answer section is visible
  useEffect(() => {
    if (showAnswerButtons) {
      document.body.classList.add('answer-section-visible');
    } else {
      document.body.classList.remove('answer-section-visible');
    }

    return () => {
      document.body.classList.remove('answer-section-visible');
    };
  }, [showAnswerButtons]);

  const allNotes: Note[] = [
    { note: 'C4', name: 'C' },
    { note: 'C#4', name: 'C#' },
    { note: 'D4', name: 'D' },
    { note: 'D#4', name: 'D#' },
    { note: 'E4', name: 'E' },
    { note: 'F4', name: 'F' },
    { note: 'F#4', name: 'F#' },
    { note: 'G4', name: 'G' },
    { note: 'G#4', name: 'G#' },
    { note: 'A4', name: 'A' },
    { note: 'A#4', name: 'A#' },
    { note: 'B4', name: 'B' },
  ];

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
            <h1>🎵 Ear Training Key Center</h1>
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
            className={`tab-button ${activeTab === 'exercise' ? 'active' : ''}`}
            onClick={() => setActiveTab('exercise')}
          >
            🎯 Exercise
          </button>
          <button
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistics
          </button>
        </div>

        {activeTab === 'exercise' ? (
          <div className="panels-container">
            {/* Desktop: Side-by-side layout */}
            <div className="left-panel desktop-only">
              <NoteSelector
                allNotes={allNotes}
                selectedNotes={selectedNotes}
                selectedKey={selectedKey}
                onToggleNote={toggleNote}
                disabled={isExerciseMode}
              />

              <ChordProgressionPanel
                selectedProgression={selectedProgression}
                selectedKey={selectedKey}
                onProgressionChange={handleProgressionChange}
                onKeyChange={handleKeyChange}
                isPlaying={isPlaying}
                disabled={isExerciseMode}
              />
            </div>

            {/* Exercise Interface - Full width on mobile */}
            <div className="right-panel">
              <ExercisePanel
                score={score}
                totalAttempts={totalAttempts}
                feedback={feedback}
                isExerciseMode={isExerciseMode}
                isPlaying={isPlaying}
                showAnswerButtons={showAnswerButtons}
                selectedNotes={selectedNotes}
                selectedKey={selectedKey}
                currentNote={currentNote}
                onStartExercise={startEarTrainingExercise}
                onStopExercise={stopExercise}
                onAnswerSelection={handleAnswerSelection}
                onResetScore={resetScore}
                onRepeatNote={repeatCurrentNote}
                bpm={bpm}
                onBpmChange={setBpm}
              />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="settings-container">
            <div className="settings-panel">
              <h2>⚙️ Exercise Settings</h2>
              <p>
                Configure your note selection and chord progression preferences.
              </p>

              <NoteSelector
                allNotes={allNotes}
                selectedNotes={selectedNotes}
                selectedKey={selectedKey}
                onToggleNote={toggleNote}
                disabled={isExerciseMode}
              />

              <ChordProgressionPanel
                selectedProgression={selectedProgression}
                selectedKey={selectedKey}
                onProgressionChange={handleProgressionChange}
                onKeyChange={handleKeyChange}
                isPlaying={isPlaying}
                disabled={isExerciseMode}
              />
            </div>
          </div>
        ) : (
          // Stats Panel
          <div className="stats-container">
            <div className="stats-panel">
              <h2>📊 Performance Statistics</h2>

              {/* Stats Summary */}
              <div className="stats-summary">
                <div className="summary-card">
                  <h3>Overall Performance</h3>
                  <div className="summary-stats">
                    <div className="summary-item">
                      <span className="summary-label">Total Attempts</span>
                      <span className="summary-value">{totalAttempts}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Correct Answers</span>
                      <span className="summary-value">{score}</span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">Overall Accuracy</span>
                      <span className="summary-value">
                        {totalAttempts > 0
                          ? Math.round((score / totalAttempts) * 100)
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note Statistics Histogram */}
              <div className="note-histogram">
                <h3>Note Performance Histogram</h3>
                <div className="histogram-container">
                  {allNotes.map(({ note, name }) => {
                    const stats = noteStats[note];
                    const total = stats.correct + stats.incorrect;
                    const accuracy =
                      total > 0 ? (stats.correct / total) * 100 : 0;
                    const maxHeight = 100;
                    const correctHeight =
                      total > 0
                        ? Math.max(
                            (stats.correct / Math.max(total, 10)) * maxHeight,
                            2
                          )
                        : 0;
                    const incorrectHeight =
                      total > 0
                        ? Math.max(
                            (stats.incorrect / Math.max(total, 10)) * maxHeight,
                            2
                          )
                        : 0;

                    return (
                      <div key={note} className="histogram-bar">
                        <div className="bar-container">
                          <div
                            className="bar correct-bar"
                            style={{ height: `${correctHeight}px` }}
                            title={`Correct: ${stats.correct}`}
                          />
                          <div
                            className="bar incorrect-bar"
                            style={{ height: `${incorrectHeight}px` }}
                            title={`Incorrect: ${stats.incorrect}`}
                          />
                        </div>
                        <div className="bar-label">{name}</div>
                        <div className="bar-stats">
                          <div className="accuracy">
                            {total > 0 ? Math.round(accuracy) : 0}%
                          </div>
                          <div className="attempts">({total})</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Analysis and Recommendations */}
              <div className="analysis-section">
                <div className="analysis-card">
                  <h3>✨ Strongest Notes</h3>
                  <div className="note-list">
                    {getStrongestNotes().length > 0 ? (
                      getStrongestNotes().map((item, index) => (
                        <div
                          key={item.isGroup ? 'perfect-group' : item.notes[0]}
                          className={`note-item ${item.isPerfect ? 'perfect' : 'strong'}`}
                        >
                          <span className="note-name">
                            {item.isGroup
                              ? item.notes
                                  .map(note =>
                                    getNoteDisplayName(note, selectedKey)
                                  )
                                  .join(', ')
                              : getNoteDisplayName(item.notes[0], selectedKey)}
                          </span>
                          <span className="note-accuracy">
                            {item.isPerfect
                              ? '💯'
                              : `${Math.round(item.accuracy * 100)}%`}
                          </span>
                          <span className="note-total">
                            ({item.total} attempts)
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="no-data">
                        No data yet. Start practicing to see your strongest
                        notes!
                      </p>
                    )}
                  </div>
                </div>

                <div className="analysis-card">
                  <h3>⚠️ Most Common Confusions</h3>
                  <div className="confusion-list">
                    {getTopConfusionPairs(5).length > 0 ? (
                      getTopConfusionPairs(5).map(
                        ({ pair, actualNote, guessedNote, count }) => (
                          <div key={pair} className="confusion-item">
                            <div className="confusion-pair">
                              <span className="actual-note">
                                {getNoteDisplayName(actualNote, selectedKey)}
                              </span>
                              <span className="arrow">→</span>
                              <span className="guessed-note">
                                {getNoteDisplayName(guessedNote, selectedKey)}
                              </span>
                            </div>
                            <div className="confusion-details">
                              <span className="confusion-count">{count}x</span>
                              <span className="confusion-desc">
                                {count === 1 ? 'confusion' : 'confusions'}
                              </span>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="no-data">
                        No confusions yet. Start practicing to identify
                        patterns!
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Reset Stats Button */}
              <div className="stats-actions">
                <button className="reset-stats-button" onClick={resetStats}>
                  🔄 Reset All Statistics
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default EarTrainingApp;
