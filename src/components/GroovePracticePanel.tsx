import React from 'react';

import { getGroovePattern } from '../data/groovePatterns';
import { getGroove, getGrooveDisplayName, GrooveType } from '../data/grooves';

interface GroovePracticePanelProps {
  currentGrooveType: GrooveType | null;
  isPracticeMode: boolean;
  isPlaying: boolean;
  currentBeat: number | null;
  currentSubdivision: number | null;
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onStartPractice: () => void;
  onStopPractice: () => void;
  onRepeatGroove: () => void;
  onNextGroove: () => void;
  selectedGrooves: Set<GrooveType>;
}

const GroovePracticePanel: React.FC<GroovePracticePanelProps> = ({
  currentGrooveType,
  isPracticeMode,
  isPlaying,
  currentBeat,
  currentSubdivision,
  bpm,
  onBpmChange,
  onStartPractice,
  onStopPractice,
  onRepeatGroove,
  onNextGroove,
  selectedGrooves,
}) => {
  const groove =
    currentGrooveType !== null ? getGroove(currentGrooveType) : null;
  const grooveName = groove ? getGrooveDisplayName(currentGrooveType!) : '';
  const pattern =
    currentGrooveType !== null ? getGroovePattern(currentGrooveType) : null;

  return (
    <div className="groove-practice-panel">
      <h2>🎵 Groove Practice</h2>

      {/* Current Groove Display - Only show when practice is active */}
      {isPracticeMode && currentGrooveType && groove && (
        <div className="current-groove-display">
          <div className="groove-name-large">{grooveName}</div>
          {groove.description && (
            <div className="groove-description">{groove.description}</div>
          )}

          {/* Metronome Beat Display */}
          {isPlaying && (
            <div className="metronome-display">
              <div className="drum-notation">
                {/* Drum staff lines */}
                <div className="drum-staff">
                  {/* Hi-hat line */}
                  {pattern && (
                    <div className="drum-line hi-hat-line">
                      <div className="line-label">Hi-Hat</div>
                      <div className="drum-hits">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(subdivision => {
                          const shouldShowHit =
                            pattern.hiHat.includes(subdivision);
                          const isActive =
                            currentSubdivision === subdivision ||
                            (currentBeat !== null &&
                              !currentSubdivision &&
                              subdivision % 2 === 1 &&
                              Math.floor((subdivision - 1) / 2) + 1 ===
                                currentBeat);

                          return (
                            <div
                              key={subdivision}
                              className={`drum-hit ${shouldShowHit ? '' : 'empty'} ${isActive ? 'active' : ''}`}
                            >
                              {shouldShowHit ? '×' : ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Snare line */}
                  {pattern && (
                    <div className="drum-line snare-line">
                      <div className="line-label">Snare</div>
                      <div className="drum-hits">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(subdivision => {
                          const shouldShowHit =
                            pattern.snare.includes(subdivision);
                          const isActive =
                            currentSubdivision === subdivision ||
                            (currentBeat !== null &&
                              !currentSubdivision &&
                              subdivision % 2 === 1 &&
                              Math.floor((subdivision - 1) / 2) + 1 ===
                                currentBeat);

                          return (
                            <div
                              key={subdivision}
                              className={`drum-hit ${shouldShowHit ? '' : 'empty'} ${isActive ? 'active' : ''}`}
                            >
                              {shouldShowHit ? '○' : ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Kick line */}
                  {pattern && (
                    <div className="drum-line kick-line">
                      <div className="line-label">Kick</div>
                      <div className="drum-hits">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(subdivision => {
                          const shouldShowHit =
                            pattern.kick.includes(subdivision);
                          const isActive =
                            currentSubdivision === subdivision ||
                            (currentBeat !== null &&
                              !currentSubdivision &&
                              subdivision % 2 === 1 &&
                              Math.floor((subdivision - 1) / 2) + 1 ===
                                currentBeat);

                          return (
                            <div
                              key={subdivision}
                              className={`drum-hit ${shouldShowHit ? '' : 'empty'} ${isActive ? 'active' : ''}`}
                            >
                              {shouldShowHit ? '●' : ''}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
            </div>
          )}
        </div>
      )}

      {/* Practice Controls */}
      <div className="practice-controls">
        {!isPracticeMode ? (
          <button
            className="control-button start-button"
            onClick={onStartPractice}
            disabled={selectedGrooves.size === 0 || isPlaying}
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
              onClick={onRepeatGroove}
              disabled={!currentGrooveType}
            >
              ↻ Repeat
            </button>
            <button
              className="control-button next-button"
              onClick={onNextGroove}
              disabled={selectedGrooves.size === 0 || !currentGrooveType}
            >
              ⏭ Next
            </button>
          </div>
        )}
      </div>

      {/* Help Text */}
      {!isPracticeMode && (
        <div className="help-text">
          {selectedGrooves.size === 0 && (
            <p>Select at least one groove to start practicing.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GroovePracticePanel;
