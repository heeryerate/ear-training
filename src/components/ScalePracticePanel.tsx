import React, { useEffect, useRef } from 'react';

import {
  getScaleName,
  getScaleNoteDisplayNames,
  ScaleType,
} from '../data/scales';

type PracticeModeType = 'regular' | 'pattern';

interface ScalePracticePanelProps {
  currentKey: string | null;
  currentScaleType: ScaleType | null;
  isPracticeMode: boolean;
  isPlaying: boolean;
  currentPlayingNoteIndex: number | null;
  onStartPractice: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
  onNextScale: () => void;
  onReset: () => void;
  selectedKeys: Set<string>;
  selectedScales: Set<ScaleType>;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  autoPlayNext: 'off' | 'random' | 'key-priority' | 'scale-priority';
  onAutoPlayNextChange: (
    mode: 'off' | 'random' | 'key-priority' | 'scale-priority'
  ) => void;
  practiceModeType: PracticeModeType;
  onPracticeModeTypeChange: (mode: PracticeModeType) => void;
  isPatternModeEnabled: boolean;
  onPatternModeEnabledChange: (enabled: boolean) => void;
  patternInput: string;
  onPatternInputChange: (pattern: string) => void;
  patternSequences: string[][];
  patternSequencesDisplay: Array<Array<{ note: string; octave: number }>>;
  currentSequenceIndex: number;
}

const ScalePracticePanel: React.FC<ScalePracticePanelProps> = ({
  currentKey,
  currentScaleType,
  isPracticeMode,
  isPlaying,
  currentPlayingNoteIndex,
  onStartPractice,
  onTogglePause,
  isPaused,
  onNextScale,
  onReset,
  selectedKeys,
  selectedScales,
  bpm,
  onBpmChange,
  autoPlayNext,
  onAutoPlayNextChange,
  practiceModeType,
  onPracticeModeTypeChange,
  isPatternModeEnabled,
  onPatternModeEnabledChange,
  patternInput,
  onPatternInputChange,
  patternSequences,
  patternSequencesDisplay,
  currentSequenceIndex,
}) => {
  const scaleName =
    currentKey && currentScaleType
      ? getScaleName(currentKey, currentScaleType)
      : '';
  const scaleNoteNames =
    currentKey && currentScaleType
      ? getScaleNoteDisplayNames(currentKey, currentScaleType)
      : [];

  // Refs for pattern sequences to enable scrolling
  const sequenceRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll active sequence into view (centered) within the container only
  useEffect(() => {
    if (
      practiceModeType === 'pattern' &&
      currentSequenceIndex !== null &&
      sequenceRefs.current[currentSequenceIndex] &&
      containerRef.current
    ) {
      const activeElement = sequenceRefs.current[currentSequenceIndex];
      const container = containerRef.current;

      if (activeElement && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        const scrollTop = container.scrollTop;
        const elementOffsetTop = activeElement.offsetTop;
        const containerHeight = container.clientHeight;
        const elementHeight = activeElement.offsetHeight;

        // Check if element is already fully visible in viewport (vertical)
        const elementTop = elementRect.top - containerRect.top;
        const elementBottom = elementTop + elementHeight;
        const isFullyVisible =
          elementTop >= 0 && elementBottom <= containerHeight;

        // For the first few sequences (first row), keep scroll at top
        if (currentSequenceIndex < 3) {
          // Only scroll if we're scrolled down and need to go back to top
          if (scrollTop > 0) {
            container.scrollTo({
              top: 0,
              behavior: 'smooth',
            });
          }
        } else if (!isFullyVisible) {
          // Only scroll if element is not fully visible
          // Calculate the position to center the element vertically
          const targetScrollTop =
            elementOffsetTop - containerHeight / 2 + elementHeight / 2;

          container.scrollTo({
            top: targetScrollTop,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [currentSequenceIndex, practiceModeType]);

  return (
    <div className="scale-practice-panel">
      <h2>🎵 Scale Practice</h2>

      {/* Current Scale Display */}
      {currentKey && currentScaleType && (
        <div className="current-scale-display">
          <div className="scale-name-large">{scaleName}</div>
          {practiceModeType === 'regular' ? (
            <div className="scale-notes-display">
              {scaleNoteNames.map((noteName, index) => {
                const isPlayingNote = currentPlayingNoteIndex === index;
                return (
                  <span
                    key={index}
                    className={`scale-note-display ${isPlayingNote ? 'playing' : ''}`}
                  >
                    {noteName}
                  </span>
                );
              })}
            </div>
          ) : (
            <div ref={containerRef} className="pattern-sequences-display">
              {patternSequencesDisplay.map((sequence, seqIndex) => {
                const isCurrentSequence = currentSequenceIndex === seqIndex;
                return (
                  <div
                    key={seqIndex}
                    ref={el => {
                      sequenceRefs.current[seqIndex] = el;
                    }}
                    className={`pattern-sequence ${isCurrentSequence ? 'active' : ''}`}
                  >
                    {sequence.map((noteData, noteIndex) => (
                      <span key={noteIndex} className="pattern-note">
                        {noteData.note}
                        {noteData.octave > 0 && (
                          <span className="octave-indicator">
                            +{noteData.octave}
                          </span>
                        )}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Practice Settings */}
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
                      | 'scale-priority'
                  )
                }
                className="auto-play-next-select"
              >
                <option value="off">Off</option>
                <option value="random">Random</option>
                <option value="key-priority">Key Priority</option>
                <option value="scale-priority">Scale Priority</option>
              </select>
            </div>
          </div>
          <div className="practice-settings-item">
            <label className="practice-settings-label">Pattern Mode</label>
            <div className="practice-settings-control">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isPatternModeEnabled}
                  onChange={e => onPatternModeEnabledChange(e.target.checked)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
          {isPatternModeEnabled && (
            <div className="practice-settings-item">
              <label
                htmlFor="pattern-input"
                className="practice-settings-label"
              >
                Pattern
              </label>
              <div className="practice-settings-control">
                <input
                  id="pattern-input"
                  type="text"
                  value={patternInput}
                  onChange={e => onPatternInputChange(e.target.value)}
                  placeholder="1 2 3 5"
                  className="pattern-input"
                />
              </div>
              <div className="pattern-help">(1-13, scale degrees)</div>
            </div>
          )}
        </div>
      </div>

      {/* Practice Controls */}
      <div className="practice-controls">
        <div className="practice-controls-row">
          <button
            className="control-button pause-play-button"
            onClick={onTogglePause}
            disabled={!currentKey || !currentScaleType}
          >
            {!isPlaying || isPaused ? '▶ Play' : '⏸ Pause'}{' '}
            <span className="key-indicator">(Space)</span>
          </button>
          <button
            className="control-button next-button"
            onClick={onNextScale}
            disabled={selectedKeys.size === 0 || selectedScales.size === 0}
          >
            ⏭ Next <span className="key-indicator">(Enter)</span>
          </button>
          <button
            className="control-button reset-button"
            onClick={onReset}
            disabled={selectedKeys.size === 0 || selectedScales.size === 0}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Help Text */}
      {!currentKey || !currentScaleType ? (
        <div className="help-text">
          {selectedKeys.size === 0 && selectedScales.size === 0 && (
            <p>
              Select at least one key and one scale, then click Next to start.
            </p>
          )}
          {selectedKeys.size === 0 && selectedScales.size > 0 && (
            <p>Select at least one key, then click Next to start.</p>
          )}
          {selectedKeys.size > 0 && selectedScales.size === 0 && (
            <p>Select at least one scale, then click Next to start.</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ScalePracticePanel;
