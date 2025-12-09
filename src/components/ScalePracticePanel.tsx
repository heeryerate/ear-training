import React from 'react';

import {
  getScaleName,
  getScaleNoteDisplayNames,
  ScaleType,
} from '../data/scales';

interface ScalePracticePanelProps {
  currentKey: string | null;
  currentScaleType: ScaleType | null;
  isPracticeMode: boolean;
  isPlaying: boolean;
  currentPlayingNoteIndex: number | null;
  onStartPractice: () => void;
  onStopPractice: () => void;
  onRepeatScale: () => void;
  onNextScale: () => void;
  selectedKeys: Set<string>;
  selectedScales: Set<ScaleType>;
  bpm: number;
  onBpmChange: (bpm: number) => void;
}

const ScalePracticePanel: React.FC<ScalePracticePanelProps> = ({
  currentKey,
  currentScaleType,
  isPracticeMode,
  isPlaying,
  currentPlayingNoteIndex,
  onStartPractice,
  onStopPractice,
  onRepeatScale,
  onNextScale,
  selectedKeys,
  selectedScales,
  bpm,
  onBpmChange,
}) => {
  const scaleName =
    currentKey && currentScaleType
      ? getScaleName(currentKey, currentScaleType)
      : '';
  const scaleNoteNames =
    currentKey && currentScaleType
      ? getScaleNoteDisplayNames(currentKey, currentScaleType)
      : [];

  return (
    <div className="scale-practice-panel">
      <h2>🎵 Scale Practice</h2>

      {/* Current Scale Display - Only show when practice is active */}
      {isPracticeMode && currentKey && currentScaleType && (
        <div className="current-scale-display">
          <div className="scale-name-large">{scaleName}</div>
          <div className="scale-notes-display">
            {scaleNoteNames.map((noteName, index) => {
              const isPlaying = currentPlayingNoteIndex === index;
              return (
                <span
                  key={index}
                  className={`scale-note-display ${isPlaying ? 'playing' : ''}`}
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
              selectedKeys.size === 0 || selectedScales.size === 0 || isPlaying
            }
          >
            {isPlaying ? '▶ Playing...' : '▶ Start Practice'}
          </button>
        ) : (
          <div className="practice-controls-row">
            <button
              className="control-button stop-button"
              onClick={onStopPractice}
              disabled={isPlaying}
            >
              ⏹ Stop
            </button>
            <button
              className="control-button repeat-button"
              onClick={onRepeatScale}
              disabled={isPlaying || !currentKey || !currentScaleType}
            >
              ↻ Repeat
            </button>
            <button
              className="control-button next-button"
              onClick={onNextScale}
              disabled={
                isPlaying ||
                selectedKeys.size === 0 ||
                selectedScales.size === 0
              }
            >
              ⏭ Next
            </button>
          </div>
        )}
      </div>

      {/* Help Text */}
      {!isPracticeMode && (
        <div className="help-text">
          {selectedKeys.size === 0 && selectedScales.size === 0 && (
            <p>Select at least one key and one scale to start practicing.</p>
          )}
          {selectedKeys.size === 0 && selectedScales.size > 0 && (
            <p>Select at least one key to start practicing.</p>
          )}
          {selectedKeys.size > 0 && selectedScales.size === 0 && (
            <p>Select at least one scale to start practicing.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ScalePracticePanel;
