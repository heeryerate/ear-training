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
  onTogglePause: () => void;
  isPaused: boolean;
  onNextChord: () => void;
  onReset: () => void;
  selectedKeys: Set<string>;
  selectedChords: Set<ChordType>;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  autoPlayNext: 'off' | 'random' | 'key-priority' | 'chord-priority';
  onAutoPlayNextChange: (
    mode: 'off' | 'random' | 'key-priority' | 'chord-priority'
  ) => void;
}

const ChordPracticePanel: React.FC<ChordPracticePanelProps> = ({
  currentKey,
  currentChordType,
  isPracticeMode,
  isPlaying,
  currentPlayingNoteIndex,
  onTogglePause,
  isPaused,
  onNextChord,
  onReset,
  selectedKeys,
  selectedChords,
  bpm,
  onBpmChange,
  autoPlayNext,
  onAutoPlayNextChange,
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

      {/* Practice Settings - Only show during practice */}
      {isPracticeMode && (
        <div className="practice-settings">
          <div className="practice-settings-content">
            <div className="practice-settings-item">
              <label htmlFor="bpm-slider" className="practice-settings-label">
                BPM
              </label>
              <div className="practice-settings-control">
                <span className="practice-settings-value">{bpm}</span>
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
            </div>
            <div className="practice-settings-item">
              <label
                htmlFor="auto-play-next-select"
                className="practice-settings-label"
              >
                Auto play
              </label>
              <div className="practice-settings-control">
                <select
                  id="auto-play-next-select"
                  value={autoPlayNext}
                  onChange={e =>
                    onAutoPlayNextChange(
                      e.target.value as
                        | 'off'
                        | 'random'
                        | 'key-priority'
                        | 'chord-priority'
                    )
                  }
                  className="auto-play-next-select"
                >
                  <option value="off">Off</option>
                  <option value="random">Random</option>
                  <option value="key-priority">Key Priority</option>
                  <option value="chord-priority">Chord Priority</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Practice Controls */}
      <div className="practice-controls">
        <div className="practice-controls-row">
          <button
            className="control-button pause-play-button"
            onClick={onTogglePause}
            disabled={
              !currentKey ||
              !currentChordType ||
              selectedKeys.size === 0 ||
              selectedChords.size === 0
            }
          >
            {!isPlaying || isPaused ? '▶ Play' : '⏸ Pause'}{' '}
            <span className="key-indicator">(Space)</span>
          </button>
          <button
            className="control-button next-button"
            onClick={onNextChord}
            disabled={selectedKeys.size === 0 || selectedChords.size === 0}
          >
            ⏭ Next <span className="key-indicator">(Enter)</span>
          </button>
          <button
            className="control-button reset-button"
            onClick={onReset}
            disabled={selectedKeys.size === 0 || selectedChords.size === 0}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Help Text */}
      {selectedKeys.size === 0 || selectedChords.size === 0 ? (
        <div className="help-text">
          {selectedKeys.size === 0 && selectedChords.size === 0 && (
            <p>
              Select at least one key and one chord, then click Next to start.
            </p>
          )}
          {selectedKeys.size === 0 && selectedChords.size > 0 && (
            <p>Select at least one key, then click Next to start.</p>
          )}
          {selectedKeys.size > 0 && selectedChords.size === 0 && (
            <p>Select at least one chord, then click Next to start.</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ChordPracticePanel;
