import React from 'react';
import { getNoteDisplayName } from '../data/keyCenters';

interface ExercisePanelProps {
  score: number;
  totalAttempts: number;
  feedback: string;
  isExerciseMode: boolean;
  isPlaying: boolean;
  showAnswerButtons: boolean;
  selectedNotes: Set<string>;
  selectedKey: string;
  currentNote: string | null;
  onStartExercise: () => void;
  onStopExercise: () => void;
  onAnswerSelection: (note: string) => void;
  onResetScore: () => void;
  onRepeatNote: () => void;
}

const ExercisePanel: React.FC<ExercisePanelProps> = ({
  score,
  totalAttempts,
  feedback,
  isExerciseMode,
  isPlaying,
  showAnswerButtons,
  selectedNotes,
  selectedKey,
  currentNote,
  onStartExercise,
  onStopExercise,
  onAnswerSelection,
  onResetScore,
  onRepeatNote
}) => {
  return (
    <div className="exercise-panel">
      <h2>🎧 Ear Training Exercise</h2>
      
      {/* Score Card */}
      <div className="score-card">
        <div className="score-display">
          <div className="score-item">
            <span className="score-label">Score:</span>
            <span className="score-value">{score}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Total:</span>
            <span className="score-value">{totalAttempts}</span>
          </div>
          <div className="score-item">
            <span className="score-label">Accuracy:</span>
            <span className="score-value">
              {totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Display */}
      {feedback && (
        <div className={`feedback ${feedback.includes('Correct') ? 'correct' : 'incorrect'}`}>
          {feedback}
        </div>
      )}

      {/* Exercise Controls - Compact Button Row */}
      <div className="exercise-controls-compact">
        <button className="control-button reset-button" onClick={onResetScore}>
          ↻ Reset
        </button>
        
        {!isExerciseMode ? (
          <button 
            className="control-button start-button"
            onClick={onStartExercise}
            disabled={selectedNotes.size === 0 || isPlaying}
          >
            {isPlaying ? '▶ Playing...' : '▶ Start Exercise'}
          </button>
        ) : (
          <>
            <button 
              className="control-button stop-button"
              onClick={onStopExercise}
              disabled={isPlaying}
            >
              ⏹ Stop
            </button>
            
            {showAnswerButtons && (
              <button 
                className="control-button repeat-button"
                onClick={onRepeatNote}
                disabled={isPlaying || !currentNote}
              >
                ↻ Repeat
              </button>
            )}
          </>
        )}
      </div>

      {/* Answer Selection */}
      {showAnswerButtons && (
        <div className="answer-section">
          <h3>🎧 What note did you hear?</h3>
          
          <div className="answer-buttons">
            {Array.from(selectedNotes).map((note) => (
              <button
                key={note}
                className="answer-button"
                onClick={() => onAnswerSelection(note)}
              >
                {getNoteDisplayName(note, selectedKey)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePanel;
