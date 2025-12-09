import './SightReadingApp.css';

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as Tone from 'tone';

import {
  getDiatonicNotes,
  getNoteDisplayName,
  keyCenters,
} from '../data/keyCenters';
import KeySelectionPanel from './KeySelectionPanel';
import SightReadingPanel from './SightReadingPanel';

type ActiveTab = 'practice' | 'progress' | 'settings';
type ClefType = 'treble' | 'bass' | 'both';

function SightReadingApp() {
  const [piano, setPiano] = useState<Tone.Sampler | null>(null);
  const [isSamplerLoaded, setIsSamplerLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('practice');

  // Key and clef selection
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['C']));
  const [selectedClef, setSelectedClef] = useState<ClefType>('treble');

  // Practice state
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [currentClef, setCurrentClef] = useState<ClefType>('treble');
  const [currentNote, setCurrentNote] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Progress tracking
  const [practiceSessions, setPracticeSessions] = useState<
    Array<{
      date: string;
      duration: number;
      score: number;
      totalAttempts: number;
      selectedKeys: string[];
      clef: ClefType;
    }>
  >([]);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);

  // Initialize Tone.js Sampler
  useEffect(() => {
    const sampler = new Tone.Sampler({
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
      release: 1,
      baseUrl: 'https://tonejs.github.io/audio/salamander/',
      onload: () => {
        console.log('Piano samples loaded successfully');
        setIsSamplerLoaded(true);
      },
    }).toDestination();

    setPiano(sampler);

    return () => {
      sampler.dispose();
    };
  }, []);

  // Initialize audio context for mobile
  const initializeAudio = async () => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
  };

  // Toggle key selection
  const toggleKey = (key: string) => {
    setSelectedKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Convert note to audio format (ensure sharps for Tone.js)
  const convertNoteToAudioFormat = (note: string): string => {
    // Mapping from flat to sharp notation for Tone.js compatibility
    const flatToSharp: { [key: string]: string } = {
      Bb: 'A#',
      Eb: 'D#',
      Ab: 'G#',
      Db: 'C#',
      Gb: 'F#',
    };

    // Extract note name and octave
    const match = note.match(/^([A-G][#b]?)(\d+)$/);
    if (!match) return note;

    const [, noteName, octave] = match;
    const sharpNoteName = flatToSharp[noteName] || noteName;

    return `${sharpNoteName}${octave}`;
  };

  // Generate a random note based on selected keys and clef
  const generateRandomNote = (): string => {
    const selectedKeysArray = Array.from(selectedKeys);
    if (selectedKeysArray.length === 0) return 'C4';

    const randomKey =
      selectedKeysArray[Math.floor(Math.random() * selectedKeysArray.length)];

    // For treble clef, use notes from C4 to C6
    // For bass clef, use notes from C2 to C4
    // For both, use notes from C2 to C6
    let minOctave = 2;
    let maxOctave = 4;

    if (currentClef === 'treble') {
      minOctave = 4;
      maxOctave = 6;
    } else if (currentClef === 'bass') {
      minOctave = 2;
      maxOctave = 4;
    } else {
      minOctave = 2;
      maxOctave = 6;
    }

    // Get diatonic notes for the key (already in sharp notation)
    const diatonicNotes = getDiatonicNotes(randomKey);
    const randomOctave =
      Math.floor(Math.random() * (maxOctave - minOctave + 1)) + minOctave;
    const randomNote =
      diatonicNotes[Math.floor(Math.random() * diatonicNotes.length)];

    // Extract note name without octave and add new octave
    // getDiatonicNotes already returns notes in sharp notation, so this should be safe
    const noteName = randomNote.replace(/\d+$/, '');
    const generatedNote = `${noteName}${randomOctave}`;

    // Ensure the note is in audio format (sharp notation)
    return convertNoteToAudioFormat(generatedNote);
  };

  // Start practice
  const startPractice = async () => {
    if (selectedKeys.size === 0) return;

    await initializeAudio();
    setIsPracticeMode(true);
    setScore(0);
    setTotalAttempts(0);
    setSessionStartTime(Date.now());
    setShowAnswer(false);
    setFeedback('');

    // Generate first note
    const clefToUse =
      selectedClef === 'both'
        ? Math.random() < 0.5
          ? 'treble'
          : 'bass'
        : selectedClef;
    setCurrentClef(clefToUse);

    const selectedKeysArray = Array.from(selectedKeys);
    const randomKey =
      selectedKeysArray[Math.floor(Math.random() * selectedKeysArray.length)];
    setCurrentKey(randomKey);

    const note = generateRandomNote();
    setCurrentNote(note);
  };

  // Stop practice
  const stopPractice = () => {
    setIsPracticeMode(false);
    setCurrentNote(null);
    setShowAnswer(false);
    setFeedback('');

    if (piano) {
      piano.releaseAll();
    }

    // Save session
    if (sessionStartTime) {
      const duration = (Date.now() - sessionStartTime) / 1000;
      setPracticeSessions(prev => [
        {
          date: new Date().toISOString(),
          duration,
          score,
          totalAttempts,
          selectedKeys: Array.from(selectedKeys),
          clef: selectedClef,
        },
        ...prev,
      ]);
      setSessionStartTime(null);
    }
  };

  // Handle answer selection
  const handleAnswerSelection = (selectedNote: string) => {
    if (!currentNote || !currentKey) return;

    setTotalAttempts(prev => prev + 1);
    const isCorrect = selectedNote === currentNote;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(
        `❌ Incorrect. The note is ${getNoteDisplayName(currentNote, currentKey)}`
      );
    }

    setShowAnswer(true);

    // Play the correct note
    if (piano && isSamplerLoaded) {
      try {
        const audioNote = convertNoteToAudioFormat(currentNote);
        piano.triggerAttackRelease(audioNote, '1n');
      } catch (error) {
        console.error('Error playing note:', error);
      }
    } else if (piano && !isSamplerLoaded) {
      // If sampler isn't loaded yet, wait a bit and try again
      setTimeout(() => {
        if (piano && currentNote && isSamplerLoaded) {
          try {
            const audioNote = convertNoteToAudioFormat(currentNote);
            piano.triggerAttackRelease(audioNote, '1n');
          } catch (retryError) {
            console.error('Error playing note on retry:', retryError);
          }
        }
      }, 200);
    }

    // Move to next note after a delay
    setTimeout(() => {
      setShowAnswer(false);
      setFeedback('');

      // Generate next note
      const clefToUse =
        selectedClef === 'both'
          ? Math.random() < 0.5
            ? 'treble'
            : 'bass'
          : selectedClef;
      setCurrentClef(clefToUse);

      const selectedKeysArray = Array.from(selectedKeys);
      const randomKey =
        selectedKeysArray[Math.floor(Math.random() * selectedKeysArray.length)];
      setCurrentKey(randomKey);

      const note = generateRandomNote();
      setCurrentNote(note);
    }, 2000);
  };

  // Repeat current note
  const repeatNote = async () => {
    if (!currentNote || !piano) return;

    await initializeAudio();
    if (isSamplerLoaded) {
      try {
        const audioNote = convertNoteToAudioFormat(currentNote);
        piano.triggerAttackRelease(audioNote, '1n');
      } catch (error) {
        console.error('Error playing note:', error);
      }
    } else {
      // If sampler isn't loaded yet, wait a bit and try again
      setTimeout(() => {
        if (piano && currentNote && isSamplerLoaded) {
          try {
            const audioNote = convertNoteToAudioFormat(currentNote);
            piano.triggerAttackRelease(audioNote, '1n');
          } catch (retryError) {
            console.error('Error playing note on retry:', retryError);
          }
        }
      }, 200);
    }
  };

  // Reset score
  const resetScore = () => {
    setScore(0);
    setTotalAttempts(0);
    setFeedback('');
  };

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
            <h1>🎼 Sight Reading Center</h1>
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

              <div className="clef-selection-panel">
                <h2>🎼 Clef Selection</h2>
                <div className="clef-buttons">
                  <button
                    className={`clef-button ${selectedClef === 'treble' ? 'selected' : ''}`}
                    onClick={() => setSelectedClef('treble')}
                    disabled={isPracticeMode}
                  >
                    Treble Clef
                  </button>
                  <button
                    className={`clef-button ${selectedClef === 'bass' ? 'selected' : ''}`}
                    onClick={() => setSelectedClef('bass')}
                    disabled={isPracticeMode}
                  >
                    Bass Clef
                  </button>
                  <button
                    className={`clef-button ${selectedClef === 'both' ? 'selected' : ''}`}
                    onClick={() => setSelectedClef('both')}
                    disabled={isPracticeMode}
                  >
                    Both
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile: Show selection panels above practice panel */}
            <div className="left-panel mobile-only">
              <KeySelectionPanel
                selectedKeys={selectedKeys}
                onToggleKey={toggleKey}
                disabled={isPracticeMode}
              />

              <div className="clef-selection-panel">
                <h2>🎼 Clef Selection</h2>
                <div className="clef-buttons">
                  <button
                    className={`clef-button ${selectedClef === 'treble' ? 'selected' : ''}`}
                    onClick={() => setSelectedClef('treble')}
                    disabled={isPracticeMode}
                  >
                    Treble Clef
                  </button>
                  <button
                    className={`clef-button ${selectedClef === 'bass' ? 'selected' : ''}`}
                    onClick={() => setSelectedClef('bass')}
                    disabled={isPracticeMode}
                  >
                    Bass Clef
                  </button>
                  <button
                    className={`clef-button ${selectedClef === 'both' ? 'selected' : ''}`}
                    onClick={() => setSelectedClef('both')}
                    disabled={isPracticeMode}
                  >
                    Both
                  </button>
                </div>
              </div>
            </div>

            {/* Practice Interface - Full width on mobile */}
            <div className="right-panel">
              <SightReadingPanel
                currentKey={currentKey}
                currentClef={currentClef}
                currentNote={currentNote}
                isPracticeMode={isPracticeMode}
                isPlaying={isPlaying}
                showAnswer={showAnswer}
                score={score}
                totalAttempts={totalAttempts}
                feedback={feedback}
                onStartPractice={startPractice}
                onStopPractice={stopPractice}
                onAnswerSelection={handleAnswerSelection}
                onRepeatNote={repeatNote}
                onResetScore={resetScore}
                selectedKeys={selectedKeys}
                selectedClef={selectedClef}
              />
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="settings-container">
            <div className="settings-panel">
              <h3>General Settings</h3>
              <div className="setting-item">
                <label>Default Clef:</label>
                <select
                  value={selectedClef}
                  onChange={e => setSelectedClef(e.target.value as ClefType)}
                  disabled={isPracticeMode}
                >
                  <option value="treble">Treble Clef</option>
                  <option value="bass">Bass Clef</option>
                  <option value="both">Both</option>
                </select>
              </div>
            </div>
          </div>
        ) : (
          <div className="progress-container">
            <div className="stats-panel">
              <h3>Practice Statistics</h3>
              {practiceSessions.length === 0 ? (
                <p>No practice sessions yet. Start practicing!</p>
              ) : (
                <div className="stats-list">
                  {practiceSessions.map((session, index) => {
                    const accuracy =
                      session.totalAttempts > 0
                        ? Math.round(
                            (session.score / session.totalAttempts) * 100
                          )
                        : 0;
                    const minutes = Math.floor(session.duration / 60);
                    const seconds = Math.floor(session.duration % 60);
                    return (
                      <div key={index} className="stat-item">
                        <div className="stat-header">
                          <span className="stat-date">
                            {new Date(session.date).toLocaleDateString()}
                          </span>
                          <span className="stat-time">
                            {minutes}m {seconds}s
                          </span>
                        </div>
                        <div className="stat-details">
                          <span>
                            Score: {session.score}/{session.totalAttempts} (
                            {accuracy}%)
                          </span>
                          <span>
                            Keys: {session.selectedKeys.join(', ')} | Clef:{' '}
                            {session.clef}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default SightReadingApp;
