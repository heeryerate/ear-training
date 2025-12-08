import React from 'react';

import {
  ChordCategory,
  ChordType,
  getCategoryDisplayName,
  getChordDisplayName,
  getChordTypesByCategory,
} from '../data/chords';

interface ChordSelectionPanelProps {
  selectedChords: Set<ChordType>;
  onToggleChord: (chordType: ChordType) => void;
  disabled: boolean;
}

const ChordSelectionPanel: React.FC<ChordSelectionPanelProps> = ({
  selectedChords,
  onToggleChord,
  disabled,
}) => {
  const chordTypesByCategory = getChordTypesByCategory();
  const categoryOrder: ChordCategory[] = [
    'major-family',
    'minor-family',
    'dominant-family',
    'diminished-family',
  ];

  return (
    <div className="chord-selection-panel">
      <h2>🎵 Chord Selection</h2>

      <div className="chord-selector">
        {categoryOrder.map(category => {
          const chordTypes = chordTypesByCategory[category];
          if (chordTypes.length === 0) return null;

          return (
            <div key={category} className="chord-category-group">
              <h3 className="chord-category-title">
                {getCategoryDisplayName(category)}
              </h3>
              <div className="chord-buttons">
                {chordTypes.map(chordType => (
                  <button
                    key={chordType}
                    className={`chord-button ${selectedChords.has(chordType) ? 'selected' : ''}`}
                    onClick={() => onToggleChord(chordType)}
                    disabled={disabled}
                  >
                    {getChordDisplayName(chordType)}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChordSelectionPanel;
