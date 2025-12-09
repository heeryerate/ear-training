import React from 'react';

import {
  ChordType,
  getChordName,
  getChordNoteDisplayNames,
} from '../data/chords';

interface ChordPracticePanelProps {
  currentKey: string | null;
  currentChordType: ChordType | null;
  isPracticeMode: boolean;
  isPlaying: boolean;
  currentPlayingNoteIndex: number | null;
  onStartPractice: () => void;
  onStopPractice: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  onNextChord: () => void;
  selectedKeys: Set<string>;
  selectedChords: Set<ChordType>;
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

const ChordPracticePanel: React.FC<ChordPracticePanelProps> = ({
  currentKey,
  currentChordType,
  isPracticeMode,
  isPlaying,
  currentPlayingNoteIndex,
  onStartPractice,
  onStopPractice,
  onTogglePause,
  isPaused,
  onNextChord,
  selectedKeys,
  selectedChords,
  bpm,
  onBpmChange,
}) => {
  const chordName =
    currentKey && currentChordType
      ? getChordName(currentKey, currentChordType)
      : '';
  const chordNoteNames =
    currentKey && currentChordType
      ? getChordNoteDisplayNames(currentKey, currentChordType)
      : [];

  return (
    <div className="chord-practice-panel">
      <h2>🎵 Chord Practice</h2>

      {/* Current Chord Display - Only show when practice is active */}
      {isPracticeMode && currentKey && currentChordType && (
        <div className="current-chord-display">
          <div className="chord-name-large">{chordName}</div>
          <div className="chord-notes-display">
            {chordNoteNames.map((noteName, index) => {
              // -1 means all notes are playing (full chord)
              // Otherwise, highlight the specific note index
              const isPlayingNote =
                currentPlayingNoteIndex === -1 ||
                currentPlayingNoteIndex === index;
              return (
                <span
                  key={index}
                  className={`chord-note-display ${isPlayingNote ? 'playing' : ''}`}
                >
                  {noteName}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* BPM Control - Only show during practice */}
      {isPracticeMode && (
        <div className="bpm-control">
          <label htmlFor="bpm-slider">BPM: {bpm}</label>
          <input
            id="bpm-slider"
            type="range"
            min="60"
            max="200"
            value={bpm}
            onChange={e => onBpmChange(parseInt(e.target.value))}
            className="bpm-slider"
          />
        </div>
      )}

      {/* Practice Controls */}
      <div className="practice-controls">
        {!isPracticeMode ? (
          <button
            className="control-button start-button"
            onClick={onStartPractice}
            disabled={
              selectedKeys.size === 0 || selectedChords.size === 0 || isPlaying
            }
          >
            {isPlaying ? '▶ Playing...' : '▶ Start Practice'}
          </button>
        ) : (
          <div className="practice-controls-row">
            <button
              className="control-button stop-button"
              onClick={onStopPractice}
            >
              ⏹ Stop <span className="key-indicator">(Esc)</span>
            </button>
            <button
              className="control-button pause-play-button"
              onClick={onTogglePause}
              disabled={!currentKey || !currentChordType}
            >
              {isPaused ? '▶ Play' : '⏸ Pause'}{' '}
              <span className="key-indicator">(Space)</span>
            </button>
            <button
              className="control-button next-button"
              onClick={onNextChord}
              disabled={selectedKeys.size === 0 || selectedChords.size === 0}
            >
              ⏭ Next <span className="key-indicator">(Enter)</span>
            </button>
          </div>
        )}
      </div>

      {/* Help Text */}
      {!isPracticeMode && (
        <div className="help-text">
          {selectedKeys.size === 0 && selectedChords.size === 0 && (
            <p>Select at least one key and one chord to start practicing.</p>
          )}
          {selectedKeys.size === 0 && selectedChords.size > 0 && (
            <p>Select at least one key to start practicing.</p>
          )}
          {selectedKeys.size > 0 && selectedChords.size === 0 && (
            <p>Select at least one chord to start practicing.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChordPracticePanel;
