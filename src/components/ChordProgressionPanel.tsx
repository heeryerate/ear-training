import React from 'react';

import { getAvailableProgressions } from '../data/chordProgressions';
import { keyCenters } from '../data/keyCenters';
import { KeyCenter } from '../types';

interface ChordProgressionPanelProps {
  selectedProgression: string;
  selectedKey: string;
  onProgressionChange: (progression: string) => void;
  onKeyChange: (key: string) => void;
  onPlayProgression: () => void;
  isPlaying: boolean;
  disabled: boolean;
}

const ChordProgressionPanel: React.FC<ChordProgressionPanelProps> = ({
  selectedProgression,
  selectedKey,
  onProgressionChange,
  onKeyChange,
  onPlayProgression,
  isPlaying,
  disabled,
}) => {
  const progressions = getAvailableProgressions();

  return (
    <div className="chord-progression">
      <h2>🎼 Key Center Context</h2>

      {/* Key Center Selector */}
      <div className="key-selector">
        <h3>Key Center:</h3>
        <div className="key-buttons">
          {keyCenters.map((keyCenter: KeyCenter) => (
            <button
              key={keyCenter.key}
              className={`key-button ${selectedKey === keyCenter.key ? 'selected' : ''}`}
              onClick={() => onKeyChange(keyCenter.key)}
              disabled={disabled || isPlaying}
            >
              {keyCenter.key}
            </button>
          ))}
        </div>
      </div>

      {/* Progression Selector */}
      <div className="progression-selector">
        <h3>Progression:</h3>
        <div className="progression-buttons">
          {progressions.map(progression => (
            <button
              key={progression}
              className={`progression-button ${selectedProgression === progression ? 'selected' : ''}`}
              onClick={() => onProgressionChange(progression)}
              disabled={disabled || isPlaying}
            >
              {progression}
            </button>
          ))}
        </div>
      </div>

      <button
        className="play-button"
        onClick={onPlayProgression}
        disabled={isPlaying}
      >
        {isPlaying ? 'Playing...' : '▶ Play Progression'}
      </button>
    </div>
  );
};

export default ChordProgressionPanel;
