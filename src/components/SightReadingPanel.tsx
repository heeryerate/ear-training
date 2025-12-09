import React from 'react';

import {
  getDiatonicNotes,
  getNoteDisplayName,
  keyCenters,
} from '../data/keyCenters';

type ClefType = 'treble' | 'bass' | 'both';

interface SightReadingPanelProps {
  currentKey: string | null;
  currentClef: ClefType;
  currentNote: string | null;
  isPracticeMode: boolean;
  isPlaying: boolean;
  showAnswer: boolean;
  score: number;
  totalAttempts: number;
  feedback: string;
  onStartPractice: () => void;
  onStopPractice: () => void;
  onAnswerSelection: (note: string) => void;
  onRepeatNote: () => void;
  onResetScore: () => void;
  selectedKeys: Set<string>;
  selectedClef: ClefType;
}

const SightReadingPanel: React.FC<SightReadingPanelProps> = ({
  currentKey,
  currentClef,
  currentNote,
  isPracticeMode,
  isPlaying,
  showAnswer,
  score,
  totalAttempts,
  feedback,
  onStartPractice,
  onStopPractice,
  onAnswerSelection,
  onRepeatNote,
  onResetScore,
  selectedKeys,
  selectedClef,
}) => {
  // Get available notes for answer buttons
  const getAvailableNotes = (): string[] => {
    if (!currentKey) return [];

    const keyCenter = keyCenters.find(k => k.key === currentKey);
    if (!keyCenter) return [];

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

    const diatonicNotes = getDiatonicNotes(currentKey);
    const notes: string[] = [];
    for (let octave = minOctave; octave <= maxOctave; octave++) {
      diatonicNotes.forEach((note: string) => {
        // Extract note name without octave and add new octave
        const noteName = note.replace(/\d+$/, '');
        notes.push(`${noteName}${octave}`);
      });
    }

    return notes;
  };

  // Convert note to staff position (simplified)
  const getNotePosition = (note: string): number => {
    if (!note) return 0;

    const noteName = note[0];
    const octave = parseInt(note[1]) || 4;
    const isSharp = note.includes('#');

    // Simplified staff position calculation
    // Treble clef: C4 is middle C (line below staff)
    // Bass clef: C4 is middle C (line above staff)
    let position = 0;

    if (currentClef === 'treble') {
      // Treble clef positions (C4 = middle C, line below staff)
      const noteMap: { [key: string]: number } = {
        C: 0,
        D: 1,
        E: 2,
        F: 3,
        G: 4,
        A: 5,
        B: 6,
      };
      position = noteMap[noteName] || 0;
      position += (octave - 4) * 7;
      if (isSharp) position += 0.5;
    } else {
      // Bass clef positions (C4 = middle C, line above staff)
      const noteMap: { [key: string]: number } = {
        C: 0,
        D: 1,
        E: 2,
        F: 3,
        G: 4,
        A: 5,
        B: 6,
      };
      position = noteMap[noteName] || 0;
      position += (octave - 4) * 7;
      if (isSharp) position += 0.5;
    }

    return position;
  };

  const availableNotes = getAvailableNotes();
  const accuracy =
    totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

  return (
    <div className="sight-reading-panel">
      <h2>🎼 Sight Reading Practice</h2>

      {/* Score Display */}
      {isPracticeMode && (
        <div className="score-display">
          <div className="score-item">
            <span className="score-label">Score:</span>
            <span className="score-value">
              {score}/{totalAttempts}
            </span>
          </div>
          <div className="score-item">
            <span className="score-label">Accuracy:</span>
            <span className="score-value">{accuracy}%</span>
          </div>
        </div>
      )}

      {/* Staff Display */}
      {isPracticeMode && currentNote && (
        <div className="staff-container">
          <div className="staff">
            <div className="staff-lines">
              {[0, 1, 2, 3, 4].map(line => (
                <div key={line} className="staff-line"></div>
              ))}
            </div>
            <div className="clef-symbol">
              {currentClef === 'treble' || currentClef === 'both' ? '𝄞' : '𝄢'}
            </div>
            <div
              className="note-on-staff"
              style={{
                bottom: `${getNotePosition(currentNote) * 8 + 20}px`,
              }}
            >
              <div className="note-head"></div>
              {getNotePosition(currentNote) > 20 && (
                <div className="note-stem"></div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          className={`feedback ${feedback.includes('✅') ? 'correct' : 'incorrect'}`}
        >
          {feedback}
        </div>
      )}

      {/* Answer Buttons */}
      {isPracticeMode && currentNote && !showAnswer && (
        <div className="answer-buttons">
          <h3>What note is this?</h3>
          <div className="note-buttons-grid">
            {availableNotes.map(note => (
              <button
                key={note}
                className="note-button"
                onClick={() => onAnswerSelection(note)}
                disabled={isPlaying}
              >
                {currentKey ? getNoteDisplayName(note, currentKey) : note}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Practice Controls */}
      <div className="practice-controls">
        {!isPracticeMode ? (
          <button
            className="control-button start-button"
            onClick={onStartPractice}
            disabled={selectedKeys.size === 0 || isPlaying}
          >
            {isPlaying ? '▶ Playing...' : '▶ Start Practice'}
          </button>
        ) : (
          <div className="practice-controls-row">
            <button
              className="control-button stop-button"
              onClick={onStopPractice}
            >
              ⏹ Stop
            </button>
            <button
              className="control-button repeat-button"
              onClick={onRepeatNote}
              disabled={!currentNote || isPlaying}
            >
              🔁 Repeat
            </button>
            <button
              className="control-button reset-button"
              onClick={onResetScore}
            >
              🔄 Reset Score
            </button>
          </div>
        )}
      </div>

      {/* Help Text */}
      {!isPracticeMode && (
        <div className="help-text">
          {selectedKeys.size === 0 && (
            <p>Select at least one key to start practicing.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SightReadingPanel;
